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
  if (!text.includes('function getUser(request)')) continue;
  text = text.replace(/import \{ NextRequest, NextResponse \} from 'next\/server'\r?\n/, "import { NextResponse } from 'next/server'\n");
  const rel = path.relative(path.join(root, 'src/app/api/admin'), file);
  const depth = rel.split(path.sep).length;
  let authPath = Array(depth).fill('..').join('/') + '/lib/auth.js';
  if (authPath.startsWith('./')) authPath = authPath.slice(2);
  if (!text.includes("getUserFromRequest")) {
    text = `import { getUserFromRequest } from '${authPath}'\n` + text;
  }
  text = text.replace(/function getUser\(request\) \{\s*const userHeader = request\.headers\.get\('x-user'\)\s*if \(!userHeader\) throw new Error\('No user'\)\s*return JSON\.parse\(userHeader\)\s*\}\s*/, '');
  text = text.replace(/const user = getUser\(request\)/g, 'const user = getUserFromRequest(request)');
  text = text.replace(/getUser\(request\)/g, 'getUserFromRequest(request)');
  fs.writeFileSync(file, text, 'utf8');
  console.log('patched', path.relative(root, file));
}