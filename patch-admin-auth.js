const fs = require('fs');
const path = require('path');
const root = process.cwd();
function walk(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(d =>
    d.isDirectory() ? walk(path.join(dir, d.name)) : [path.join(dir, d.name)]
  );
}
const files = walk(path.join(root, 'src/app/api/admin')).filter(f => f.endsWith('.js'));
for (const file of files) {
  let text = fs.readFileSync(file, 'utf8');
  const rel = path.relative(path.join(root, 'src/app/api/admin'), file).replace(/\\/g, '/');
  const isAdminsRoute = rel === 'admins/route.js' || rel === 'admins/[id]/route.js';
  if (!text.includes('getUserFromRequest(request)')) continue;
  const importMatch = text.match(/import \{ getUserFromRequest \} from '([^']+)'/);
  if (!importMatch) continue;
  const authPath = importMatch[1];
  const helperName = isAdminsRoute ? 'requireSuperAdmin' : 'requireAdmin';
  text = text.replace(/import \{ getUserFromRequest \} from '[^']+'/, `import { ${helperName} } from '${authPath}'`);
  text = text.replace(/const user = getUserFromRequest\(request\)/g, `const user = ${helperName}(request)`);
  text = text.replace(/getUserFromRequest\(request\)/g, `${helperName}(request)`);
  fs.writeFileSync(file, text, 'utf8');
  console.log('patched', rel);
}
