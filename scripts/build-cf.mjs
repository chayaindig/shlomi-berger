// Production build for shlomifruit.com (Cloudflare Workers static assets).
// Version D is the home page; the earlier comparison pages (A, B, C) stay on the GitHub Pages preview only.
import { execSync } from 'node:child_process';
import { renameSync, rmSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const out = 'dist-cf';
// base '/' (not './') so the 404 page loads its files from any missing path
execSync(`npx vite build --base / --outDir ${out} --emptyOutDir`, { stdio: 'inherit' });
renameSync(join(out, 'd.html'), join(out, 'index.html'));
for (const f of ['melon.html', 'combo.html']) rmSync(join(out, f), { force: true });
// Asset credits are for us, not for the public site
const drop = dir => readdirSync(dir).forEach(f => {
  const p = join(dir, f);
  if (statSync(p).isDirectory()) drop(p); else if (f === 'SOURCES.md') rmSync(p);
});
drop(out);
