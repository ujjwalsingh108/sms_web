const fs = require('fs');
const path = require('path');

function walk(dir, filelist = []) {
  fs.readdirSync(dir).forEach((file) => {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    if (stat.isDirectory()) {
      walk(filepath, filelist);
    } else {
      filelist.push(filepath);
    }
  });
  return filelist;
}

function readIfExists(p) {
  try {
    return fs.readFileSync(p, 'utf8');
  } catch (e) {
    return null;
  }
}

const root = path.resolve(__dirname, '..');

// 1. Find API route files under app/api
const apiDir = path.join(root, 'app', 'api');
const apiFiles = [];
if (fs.existsSync(apiDir)) {
  walk(apiDir).forEach((f) => {
    if (f.endsWith('route.ts') || f.endsWith('route.js')) apiFiles.push(f);
  });
}

// 2. Find server action file for academic
const actionsPath = path.join(root, 'app', 'dashboard', 'academic', 'actions.ts');
const actionsContent = readIfExists(actionsPath) || '';

// 3. Find pages that should match Academic styling under app/dashboard/**
const dashboardDir = path.join(root, 'app', 'dashboard');
const pageFiles = [];
if (fs.existsSync(dashboardDir)) {
  walk(dashboardDir).forEach((f) => {
    if (f.endsWith('.tsx') || f.endsWith('.ts') || f.endsWith('.jsx') || f.endsWith('.js')) {
      pageFiles.push(f);
    }
  });
}

// 4. Collect component usage: Button, Card, Table imports
function collectImports(content) {
  const imports = {};
  const lines = content.split(/\r?\n/);
  lines.forEach((l) => {
    const m = l.match(/import\s+\{?\s*([^}]+)\s*\}?\s+from\s+['"]([^'"]+)['"]/);
    if (m) {
      const names = m[1].split(',').map(s => s.trim());
      imports[m[2]] = (imports[m[2]] || []).concat(names);
    }
  });
  return imports;
}

const academicPagePath = path.join(root, 'app', 'dashboard', 'academic', 'page.tsx');
const academicPage = readIfExists(academicPagePath) || '';
const academicImports = collectImports(academicPage);

// Compare other pages for reuse of core UI components
const uiMismatches = [];
pageFiles.forEach((p) => {
  if (p === academicPagePath) return;
  const c = readIfExists(p) || '';
  const imports = collectImports(c);
  // Check that Button and Card are imported from components/ui
  const usesButton = Object.keys(imports).some(k => k.includes('/components/ui/button') || k.endsWith('/components/ui/button') || (imports['@/components/ui/button']));
  const usesCard = Object.keys(imports).some(k => k.includes('/components/ui/card') || (imports['@/components/ui/card']));
  if (!usesButton || !usesCard) {
    uiMismatches.push({ file: path.relative(root, p), usesButton, usesCard });
  }
});

// Check for SUPABASE_SERVICE_ROLE_KEY usage
const envIssues = [];
if (actionsContent.includes('SUPABASE_SERVICE_ROLE_KEY')) {
  envIssues.push({ file: path.relative(root, actionsPath), key: 'SUPABASE_SERVICE_ROLE_KEY' });
}

// Gather API route exports (GET/POST etc) by simple regex
const apiRoutes = apiFiles.map((f) => {
  const content = readIfExists(f) || '';
  const methods = [];
  ['GET','POST','PUT','PATCH','DELETE'].forEach((m) => {
    if (new RegExp(`export\s+async\s+function\s+${m}\b`).test(content)) methods.push(m);
  });
  return { file: path.relative(root, f), methods };
});

const report = {
  generated_at: new Date().toISOString(),
  api_routes: apiRoutes,
  academic_page_imports: academicImports,
  ui_mismatches: uiMismatches,
  env_issues: envIssues,
  notes: []
};

// Add helpful notes
if (apiRoutes.length === 0) report.notes.push('No API route files found under app/api');
if (envIssues.length > 0) report.notes.push('Server actions depend on SUPABASE_SERVICE_ROLE_KEY; tests requiring admin client will fail without it');
if (uiMismatches.length > 0) report.notes.push('Some dashboard pages do not import core UI components `Button` or `Card` from components/ui — consider reusing shared components for styling consistency');

const outPath = path.join(root, 'reports');
if (!fs.existsSync(outPath)) fs.mkdirSync(outPath);
fs.writeFileSync(path.join(outPath, 'automated_e2e_static_report.json'), JSON.stringify(report, null, 2));

console.log('Static analysis complete. Report written to reports/automated_e2e_static_report.json');
