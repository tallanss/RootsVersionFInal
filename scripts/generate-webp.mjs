// ============================================================
// Génère une version .webp de chaque image PNG/JPG du dossier public/
// (lancé avant le build). Réduit fortement le poids des images servies.
// NON-BLOQUANT : toute erreur est attrapée et le process sort en code 0.
// ============================================================

import { readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PUBLIC_DIR = join(__dirname, '..', 'public');

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = join(dir, e.name);
    if (e.isDirectory()) files.push(...await walk(full));
    else files.push(full);
  }
  return files;
}

async function main() {
  if (!existsSync(PUBLIC_DIR)) return;
  const sharp = (await import('sharp')).default;

  const files = await walk(PUBLIC_DIR);
  const images = files.filter((f) => /\.(png|jpe?g)$/i.test(f));

  let generated = 0;
  for (const img of images) {
    const webp = img.replace(/\.(png|jpe?g)$/i, '.webp');
    try {
      // Incrémental : on saute si le webp existe et est plus récent que la source
      if (existsSync(webp)) {
        const [s1, s2] = await Promise.all([stat(img), stat(webp)]);
        if (s2.mtimeMs >= s1.mtimeMs) continue;
      }
      await sharp(img).webp({ quality: 78 }).toFile(webp);
      generated++;
    } catch (err) {
      console.warn(`[webp] ⚠ ${img} : ${err.message}`);
    }
  }
  console.log(`[webp] ${generated} image(s) converties en WebP (${images.length} sources).`);
}

main()
  .catch((err) => console.warn('[webp] Échec non bloquant :', err?.message || err))
  .finally(() => process.exit(0));
