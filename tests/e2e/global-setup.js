const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

// Ensure a fetch() is available in Node (Node 18+ has it); fallback to node-fetch if installed
let fetchFn = globalThis.fetch;
if (!fetchFn) {
  try {
    // eslint-disable-next-line node/no-extraneous-require
    fetchFn = require('node-fetch');
  } catch (e) {
    fetchFn = null;
  }
}

// Load .env into process.env (simple parser)
function loadEnv() {
  const rootEnv = path.resolve(__dirname, '..', '..', '.env');
  if (!fs.existsSync(rootEnv)) return;
  const content = fs.readFileSync(rootEnv, 'utf8');
  content.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^\s*([A-Z0-9_]+)=(.*)$/);
    if (m) {
      let val = m[2] || '';
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[m[1]] = val;
    }
  });
}

module.exports = async () => {
  loadEnv();

  const baseURL = process.env.PLAYWRIGHT_BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    console.warn('E2E_EMAIL or E2E_PASSWORD not set in .env — attempting programmatic Supabase auth fallback.');

    // Try programmatic fallback using Supabase service role + anon key
    const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!SUPABASE_URL || !SERVICE_KEY || !ANON_KEY) {
      console.warn('Missing SUPABASE_SERVICE_ROLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY — cannot create test user.');
      return;
    }

    try {
      const testEmail = `e2e+${Date.now()}@example.com`;
      const testPassword = `E2E!${Math.random().toString(36).slice(-8)}A1`;

      // Create user via Supabase Admin API
      const createRes = await (fetchFn || fetch)(`${SUPABASE_URL}/auth/v1/admin/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({ email: testEmail, password: testPassword, email_confirm: true }),
      }).then((r) => r.json()).catch((e) => { throw new Error('create-user-failed: ' + (e.message || e)); });

      // log create response for debugging
      if (createRes && createRes.id) {
        console.log('global-setup: created test user id', createRes.id);
      } else if (createRes && createRes.code) {
        console.warn('global-setup: create user response', createRes);
      }

      // Exchange credentials for a session (token)
      // Exchange credentials for a session (token) - send form-encoded body as required by Supabase
      const params = new URLSearchParams();
      params.append('grant_type', 'password');
      params.append('email', testEmail);
      params.append('password', testPassword);

      const tokenRes = await (fetchFn || fetch)(`${SUPABASE_URL}/auth/v1/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          apikey: ANON_KEY,
        },
        body: params.toString(),
      });

      const tokenJson = await tokenRes.json();
      if (!tokenJson || !tokenJson.access_token) {
        console.warn('Programmatic signin failed, response:', tokenJson);
        return;
      }

      // Build a minimal storageState with Supabase auth token in localStorage
      const storage = {
        cookies: [],
        origins: [
          {
            origin: baseURL,
            localStorage: [
              {
                name: 'supabase.auth.token',
                value: JSON.stringify({
                  currentSession: tokenJson,
                  user: tokenJson.user || null,
                }),
              },
            ],
          },
        ],
      };

      const outPath = path.join(__dirname, 'state.json');
      fs.writeFileSync(outPath, JSON.stringify(storage, null, 2));
      console.log('global-setup: wrote programmatic authenticated storage state to', outPath);
      // expose created creds for debugging if needed
      process.env.E2E_EMAIL = testEmail;
      process.env.E2E_PASSWORD = testPassword;
      return;
    } catch (e) {
      console.warn('global-setup programmatic fallback failed:', e.message || e);
      return;
    }
  }

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    await page.goto(`${baseURL}/login`);

    // Try several selectors to fill email/password
    await page.fill('input[type="email"]', email).catch(() => {});
    await page.fill('input[name="email"]', email).catch(() => {});
    await page.fill('input[placeholder*="email"]', email).catch(() => {});
    await page.fill('input[type="password"]', password).catch(() => {});
    await page.fill('input[name="password"]', password).catch(() => {});

    await Promise.all([
      page.waitForNavigation({ waitUntil: 'networkidle', timeout: 10000 }).catch(() => {}),
      page.click('button[type="submit"]').catch(() => {}),
      page.click('text=Sign in').catch(() => {}),
      page.click('text=Sign In').catch(() => {}),
    ]);

    // Wait a short time for client to set auth storage
    await page.waitForTimeout(1000);

    const storage = await context.storageState();
    const outPath = path.join(__dirname, 'state.json');
    fs.writeFileSync(outPath, JSON.stringify(storage, null, 2));
    console.log('global-setup: wrote authenticated storage state to', outPath);
  } catch (e) {
    console.warn('global-setup: signin may have failed:', e.message || e);
  } finally {
    await browser.close();
  }
};
