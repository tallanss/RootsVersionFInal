// ============================================================
// Prerender post-build (SEO) — PhotoRoots
// ------------------------------------------------------------
// Génère une version HTML statique de chaque route publique en
// chargeant le SPA dans un navigateur headless et en capturant le
// DOM rendu (contenu + balises Helmet : title/meta).
//
// SÉCURITÉ : ce script est NON-BLOQUANT. Toute erreur est attrapée et
// le process se termine en code 0, pour que le déploiement réussisse
// même si le prerender échoue (on retombe alors sur le SPA classique).
// ============================================================

import { createServer } from 'node:http';
import { readFile, writeFile, mkdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DIST = join(__dirname, '..', 'dist');

// Villes (doivent rester alignées avec src/data/cities.js)
const CITY_SLUGS = [
  'le-havre', 'rouen', 'dieppe', 'montivilliers', 'harfleur',
  'fecamp', 'etretat', 'bolbec', 'lillebonne', 'yvetot',
  'saint-romain-de-colbosc',
];

// Articles de blog (doivent rester alignés avec src/data/blog.js)
const BLOG_SLUGS = [
  'combien-coute-location-photobooth',
  'photobooth-ou-photographe-mariage',
  'idees-accessoires-photobooth',
  'photobooth-soiree-entreprise',
  'organiser-photobooth-mariage-normandie',
];

// Routes publiques à prerender (on exclut /admin, /save-the-date/:slug, 404)
const ROUTES = [
  '/',
  '/photobooth',
  '/tarifs',
  '/options-a-louer',
  '/galerie',
  '/contact',
  '/mentions-legales',
  '/blog',
  ...BLOG_SLUGS.map((s) => `/blog/${s}`),
  ...CITY_SLUGS.map((s) => `/location-photobooth-${s}`),
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.webmanifest': 'application/manifest+json',
  '.xml': 'application/xml',
  '.txt': 'text/plain',
};

async function main() {
  if (!existsSync(join(DIST, 'index.html'))) {
    console.warn('[prerender] dist/index.html introuvable — étape ignorée.');
    return;
  }

  const indexHtml = await readFile(join(DIST, 'index.html'), 'utf-8');

  // --- Serveur statique avec fallback SPA ---
  const server = createServer(async (req, res) => {
    try {
      const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
      const filePath = join(DIST, urlPath);
      // Sert tout fichier réel existant (asset JS/CSS/img…) avec le bon MIME
      if (existsSync(filePath) && (await stat(filePath)).isFile()) {
        const type = MIME[extname(urlPath).toLowerCase()] || 'application/octet-stream';
        const data = await readFile(filePath);
        res.writeHead(200, { 'Content-Type': type });
        res.end(data);
        return;
      }
      // Sinon → fallback SPA (index.html original)
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(indexHtml);
    } catch {
      res.writeHead(500);
      res.end('error');
    }
  });

  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  // --- Lancement du navigateur headless ---
  // Sur Vercel/CI (Linux sans libs système), on utilise @sparticuz/chromium
  // (Chromium auto-suffisant) via puppeteer-core. En local, le puppeteer
  // complet avec son Chromium intégré.
  const onVercel = !!(process.env.VERCEL || process.env.CI);
  let browser;
  if (onVercel) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteerCore = (await import('puppeteer-core')).default;
    browser = await puppeteerCore.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    });
  } else {
    const puppeteer = (await import('puppeteer')).default;
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  }

  const results = [];
  for (const route of ROUTES) {
    const page = await browser.newPage();
    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));
    page.on('console', (m) => { if (m.type() === 'error') pageErrors.push(m.text()); });
    try {
      await page.goto(base + route, { waitUntil: 'networkidle0', timeout: 30000 });
      // Attendre que l'app ait réellement peint du contenu (un h1/section)
      await page.waitForFunction(
        () => {
          const root = document.querySelector('#root');
          return root && root.innerHTML.length > 500;
        },
        { timeout: 15000 }
      ).catch(() => {});
      // Laisser Helmet/effets poser le title + meta
      await new Promise((r) => setTimeout(r, 1000));
      const rootLen = await page.evaluate(() => document.querySelector('#root')?.innerHTML.length || 0);
      const html = '<!doctype html>\n' + await page.evaluate(() => document.documentElement.outerHTML);
      if (rootLen < 500) {
        console.warn(`[prerender] ⚠ ${route} : contenu vide (root=${rootLen})` + (pageErrors[0] ? ` — ${pageErrors[0]}` : ''));
      } else {
        results.push({ route, html });
        console.log(`[prerender] ✓ ${route} (${rootLen} chars)`);
      }
    } catch (err) {
      console.warn(`[prerender] ⚠ ${route} : ${err.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();
  await new Promise((resolve) => server.close(resolve));

  // --- Écriture des fichiers (après capture pour ne pas servir des shells modifiés) ---
  for (const { route, html } of results) {
    const outPath = route === '/'
      ? join(DIST, 'index.html')
      : join(DIST, route, 'index.html');
    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, 'utf-8');
  }

  console.log(`[prerender] Terminé — ${results.length}/${ROUTES.length} routes prérendues.`);
}

main()
  .catch((err) => {
    console.warn('[prerender] Échec non bloquant :', err?.message || err);
  })
  .finally(() => {
    // Toujours sortir en succès pour ne jamais casser le déploiement
    process.exit(0);
  });
