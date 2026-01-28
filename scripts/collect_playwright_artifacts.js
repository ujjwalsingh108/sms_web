const fs = require('fs');
const path = require('path');

function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

const repoRoot = path.resolve(__dirname, '..');
const outDir = path.join(repoRoot, 'reports', 'playwright-report');
ensureDir(outDir);

const candidates = [
  path.join(repoRoot, 'tests', 'e2e', 'tests', 'e2e', 'playwright-report', 'index.html'),
  path.join(repoRoot, 'tests', 'e2e', 'playwright-report', 'index.html'),
  path.join(repoRoot, 'tests', 'e2e', 'tests', 'e2e', 'playwright-report'),
];

// copy index.html if present
for (const c of candidates) {
  if (fs.existsSync(c) && fs.statSync(c).isFile()) {
    const dest = path.join(outDir, 'index.html');
    fs.copyFileSync(c, dest);
    console.log('Copied report:', c, '->', dest);
    break;
  }
}

// copy Playwright last-run summary
const lastRun = path.join(repoRoot, 'test-results', '.last-run.json');
if (fs.existsSync(lastRun)) {
  fs.copyFileSync(lastRun, path.join(outDir, '.last-run.json'));
  console.log('Copied', lastRun);
}

// copy state.json used by tests
const state = path.join(repoRoot, 'tests', 'e2e', 'state.json');
if (fs.existsSync(state)) {
  fs.copyFileSync(state, path.join(outDir, 'state.json'));
  console.log('Copied', state);
}

console.log('Artifact collection complete. Output dir:', outDir);
