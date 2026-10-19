// ============================================================
// Catalogue d'options à la carte (add-ons) — source unique de vérité.
// Utilisé à la fois comme défaut (ContentContext → DEFAULT_CONTENT.addons)
// et comme liste « suggérée » dans l'admin (CMSModules → AddonsManager,
// bouton « Ajouter les options suggérées »).
// Prix à 0 = « Sur devis » côté public tant que le client ne l'a pas fixé.
// ============================================================
export const ADDONS_CATALOG = [
  { id: 'guestbook',  name: "Livre d'or Premium",             price: 39, desc: 'Album souvenir avec collages, stylos et emplacements photos.', enabled: true },
  { id: 'usb',        name: 'Clé USB souvenirs',              price: 15, desc: 'Toutes les photos de la soirée en haute définition.', enabled: true },
  { id: 'branding',   name: 'Branding écran',                 price: 29, desc: "Votre logo et vos couleurs sur l'interface de la borne.", enabled: true },
  { id: 'portecles',  name: 'Porte-clés photo',               price: 0,  desc: 'Vos photos transformées en porte-clés souvenirs à offrir.', enabled: true },
  { id: 'goodies',    name: 'Goodies personnalisés',          price: 0,  desc: 'Magnets, cartes et objets souvenirs à vos couleurs.', enabled: true },
  { id: 'telephone-or', name: "Téléphone d'Or (audio & vidéo)", price: 0, desc: 'Un combiné vintage pour enregistrer les messages audio et vidéo de vos invités.', enabled: true },
  { id: 'gifs',       name: 'GIFs, boomerangs & vidéos courtes', price: 0, desc: 'Animations GIF et boomerangs à partager instantanément.', enabled: true },
  { id: 'fonds',      name: 'Fonds photo, fonds verts & IA',  price: 0,  desc: 'Décors personnalisés, fond vert et retouches par intelligence artificielle.', enabled: true },
  { id: 'accessoires', name: 'Pack accessoires & props',      price: 0,  desc: 'Lunettes, chapeaux, pancartes et accessoires fun pour vos invités.', enabled: true },
  { id: 'tirages',    name: 'Tirages supplémentaires',        price: 0,  desc: 'Impressions papier additionnelles pour que chacun reparte avec sa photo.', enabled: true },
  { id: 'installation-premium', name: 'Installation premium', price: 0,  desc: 'Tapis rouge et poteaux dorés pour une entrée prestigieuse.', enabled: true },
];
