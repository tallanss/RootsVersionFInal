// ============================================================
// Interrupteurs de fonctionnalités (temporaires)
// ============================================================
// Un seul endroit pour activer/désactiver une fonctionnalité côté public.
//
// RENTAL_OPTIONS_ENABLED — « Options à louer » (add-ons).
//   false = masqué PARTOUT côté public (les données restent en base et le
//   module admin « Options à louer » reste utilisable pour préparer la suite).
//   Repasser à true réaffiche tout d'un coup.
//   Points branchés sur ce drapeau :
//     • src/pages/Contact.jsx        → section du formulaire de devis
//     • src/pages/Tarifs.jsx         → section « à la carte » + lien
//     • src/components/Footer.jsx    → lien du pied de page
//     • src/App.jsx                  → route /options-a-louer
//     • src/context/ContentContext.jsx → entrée éventuelle dans le menu
//   (Pensez aussi à réactiver la route dans scripts/prerender.mjs et
//    vite.config.js — repérées par le commentaire RENTAL_OPTIONS.)
export const RENTAL_OPTIONS_ENABLED = false;
