/**
 * Play CDN 제거: cdn.tailwindcss.com → /static/tailwind-app.css
 * 인라인 tailwind.config 스크립트 제거 (tailwind.config.cjs로 통합)
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, '..');

const CDN_DOUBLE = /<script\s+src="https:\/\/cdn\.tailwindcss\.com"><\/script>\s*/g;
const CDN_SINGLE = /<script\s+src='https:\/\/cdn\.tailwindcss\.com'><\/script>\s*/g;
const LINK = '<link rel="stylesheet" href="/static/tailwind-app.css">\n';
const CONFIG_BLOCK = /<script>\s*tailwind\.config\s*=\s*\{[\s\S]*?<\/script>\s*/g;

function walk(dir, files = []) {
  const skip = new Set(['node_modules', 'dist', '.git', '.wrangler']);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (skip.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) walk(full, files);
    else if (/\.(ts|tsx|js|mjs)$/.test(ent.name)) files.push(full);
  }
  return files;
}

for (const file of walk(path.join(root, 'src'))) {
  let s = fs.readFileSync(file, 'utf8');
  if (!s.includes('cdn.tailwindcss.com') && !s.includes('tailwind.config')) continue;
  const orig = s;
  s = s.replace(CDN_DOUBLE, LINK);
  s = s.replace(CDN_SINGLE, "<link rel='stylesheet' href='/static/tailwind-app.css'>\n");
  let prev;
  do {
    prev = s;
    s = s.replace(CONFIG_BLOCK, '');
  } while (prev !== s);
  s = s.replace(/\n{5,}/g, '\n\n\n\n');
  if (s !== orig) {
    fs.writeFileSync(file, s, 'utf8');
    console.log('updated', path.relative(root, file));
  }
}
