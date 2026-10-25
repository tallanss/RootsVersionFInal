// ============================================================
// Optimisation de la LIVRAISON des images (réduction de l'egress Supabase)
// ------------------------------------------------------------
// Les images uploadées via l'admin sont stockées dans Supabase Storage. Sur le
// plan gratuit, Supabase ne propose pas de redimensionnement à la volée et son
// quota de bande passante (egress) est faible (5 Go/mois). Pour éviter de le
// saturer, on route les images distantes via images.weserv.nl : un proxy
// d'images gratuit (adossé à Cloudflare) qui redimensionne, recompresse en WebP
// et MET EN CACHE. Résultat : Supabase n'est sollicité qu'au premier chargement
// d'une image (cache-miss), et les visiteurs reçoivent une version bien plus
// légère servie depuis le CDN du proxy.
//
// Repli : si le proxy échoue, PremiumImage retombe automatiquement sur l'URL
// d'origine (voir PremiumImage.jsx, onError).
// ============================================================

// true = on passe par le proxy weserv pour les images distantes. Mettre false
// pour revenir au comportement d'origine (images servies directement).
export const IMAGE_PROXY_ENABLED = true;

const isRemote = (src) => typeof src === 'string' && /^https?:\/\//i.test(src);

/**
 * Renvoie une URL d'image optimisée.
 * - Images locales (/...) et data: → inchangées (servies par Vercel).
 * - SVG / GIF distants → inchangés (vecteur / animation à préserver).
 * - Images distantes (ex. Supabase Storage) → routées via le proxy, en WebP,
 *   redimensionnées à `w` px de large max et compressées à la qualité `q`.
 *
 * @param {string} src    URL source
 * @param {object} [opts]
 * @param {number} [opts.w=1280] largeur max en px
 * @param {number} [opts.q=72]   qualité (1–100)
 */
export function optimizedSrc(src, { w = 1280, q = 72 } = {}) {
  if (!IMAGE_PROXY_ENABLED) return src;
  if (!isRemote(src)) return src;
  if (/\.svg(\?|$)/i.test(src) || /\.gif(\?|$)/i.test(src)) return src;
  // weserv veut l'URL sans le protocole ; il sert en HTTPS automatiquement
  // pour les hôtes qui le supportent (ce qui est le cas de *.supabase.co).
  const clean = src.replace(/^https?:\/\//i, '');
  return `https://images.weserv.nl/?url=${encodeURIComponent(clean)}&w=${w}&q=${q}&output=webp&we`;
}
