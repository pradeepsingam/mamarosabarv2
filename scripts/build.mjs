import { cp, mkdir, readdir, rm, stat } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const output = join(root, 'dist');
const publicFiles = ['index.html', 'menu.html', 'contact.html', '404.html', 'robots.txt', 'sitemap.xml'];
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
for (const file of publicFiles) await cp(join(root, file), join(output, file));
await cp(join(root, 'assets'), join(output, 'assets'), { recursive: true });

let count = 0;
let largest = { bytes: 0, name: '' };
async function validate(directory) {
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.name.startsWith('.') || entry.isSymbolicLink()) throw new Error(`Unexpected publish entry: ${path}`);
    if (entry.isDirectory()) { await validate(path); continue; }
    const { size } = await stat(path);
    if (size > 25 * 1024 * 1024) throw new Error(`Asset exceeds Cloudflare's 25 MiB limit: ${path}`);
    count += 1;
    if (size > largest.bytes) largest = { bytes: size, name: path.slice(output.length + 1) };
  }
}
await validate(output);
console.log(`Built ${count} public files into dist/. Largest asset: ${largest.name} (${largest.bytes} bytes).`);
