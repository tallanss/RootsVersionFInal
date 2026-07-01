// ============================================================
// Google Analytics 4 — chargement CONDITIONNÉ au consentement cookies
// ------------------------------------------------------------
// GA pose des cookies de mesure : en RGPD (France), on ne le charge
// QUE si l'utilisateur a cliqué « Accepter » sur la bannière cookies
// (clé localStorage 'photoroots_cookies_accepted' === 'true').
// Tant qu'il n'a pas accepté (ou a refusé), aucun script GA n'est chargé,
// aucun cookie n'est posé — conforme aux mentions légales du site.
// ============================================================

const GA_ID = 'G-F844HQD1EP';
const CONSENT_KEY = 'photoroots_cookies_accepted';

let loaded = false;

export const hasCookieConsent = () => {
  try {
    return localStorage.getItem(CONSENT_KEY) === 'true';
  } catch {
    return false;
  }
};

// Injecte gtag.js et initialise GA4 (idempotent : ne charge qu'une seule fois).
export function loadGoogleAnalytics() {
  if (loaded || typeof window === 'undefined') return;
  if (!hasCookieConsent()) return;
  loaded = true;

  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  // send_page_view par défaut → envoie la page en cours au moment du chargement.
  gtag('config', GA_ID);
}

// Envoie une vue de page (pour les navigations SPA après le chargement initial).
export function trackPageview(path) {
  if (!loaded || typeof window.gtag !== 'function') return;
  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: document.title,
  });
}
