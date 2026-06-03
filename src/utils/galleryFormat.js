// ============================================================
// Helpers partagés galerie + formatage prix
// Source unique de vérité — évite les duplications divergentes
// entre Gallery.jsx, Home.jsx, Tarifs.jsx, Contact.jsx, CMSModules.jsx
// ============================================================

// Catégories de la galerie (onglets de filtre). "Tous" est ajouté
// uniquement côté affichage public, pas dans la liste éditable admin.
export const GALLERY_CATEGORIES = ['Mariage', 'Corporate', 'Anniversaire', 'Gala'];

// Mappe d'anciennes catégories (données legacy) vers les catégories actuelles.
const CATEGORY_ALIASES = {
  Entreprise: 'Corporate',
  Pro: 'Corporate',
  Soirée: 'Gala',
  Soiree: 'Gala',
  Anniv: 'Anniversaire',
};

/** Normalise une catégorie de photo (gère les valeurs legacy). */
export const normalizeCategory = (cat) => {
  if (!cat) return GALLERY_CATEGORIES[0];
  const c = String(cat).trim();
  if (GALLERY_CATEGORIES.includes(c)) return c;
  return CATEGORY_ALIASES[c] || c; // inconnue → on la garde telle quelle (restera filtrable)
};

/**
 * Détecte les titres qui ressemblent à un nom de fichier brut
 * (ex: "img_6241", "DSC_0123", "P10234567", "photo-2024-10-15",
 * "Capture d'écran 2025…", "Screenshot…", "Sans titre…").
 * Ces titres ne doivent pas s'afficher sur la galerie publique.
 */
export const isPlaceholderTitle = (title) => {
  if (!title) return true;
  const t = String(title).trim();
  if (!t) return true;
  const patterns = [
    /^img[_\s-]*\d+/i,
    /^dsc[_\s-]*\d+/i,
    /^dscn[_\s-]*\d+/i,
    /^p\d{6,}/i,
    /^photo[_\s-]*\d+/i,
    /^image[_\s-]*\d+/i,
    /^capture/i,
    /^screenshot/i,
    /^untitled/i,
    /^sans[_\s-]?titre/i,
    /^\d{4}[_\s-]?\d{2}[_\s-]?\d{2}/, // dates style 2025-04-19
  ];
  return patterns.some((rx) => rx.test(t));
};

/** Renvoie le titre à afficher, ou '' si c'est un placeholder. */
export const displayTitle = (title) => (isPlaceholderTitle(title) ? '' : title);

/** Texte alt de secours pour une image de galerie sans titre exploitable. */
export const galleryAlt = (item) =>
  displayTitle(item?.title) ||
  `Photobooth ${item?.category || ''} ${item?.location || ''}`.trim();

/**
 * Formate un prix de façon robuste :
 * - numérique ("249" / 249 / "1290")  → "249€"
 * - déjà suffixé ("249€")             → "249€"
 * - texte ("Sur devis")              → tel quel
 */
export const formatPrice = (price) => {
  const raw = String(price ?? '').trim();
  if (/^\d+(?:[.,]\d+)?$/.test(raw)) return `${raw}€`;
  return raw;
};

/**
 * Convertit un prix CMS (potentiellement "1 290€", "289 €", "289")
 * en nombre exploitable pour les calculs. Retourne 0 si non numérique.
 */
export const priceToNumber = (price) => {
  const cleaned = String(price ?? '').replace(/[^\d.,]/g, '').replace(',', '.');
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
};
