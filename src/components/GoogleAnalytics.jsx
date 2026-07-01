import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { loadGoogleAnalytics, hasCookieConsent, trackPageview } from '../utils/analytics';

/**
 * Charge Google Analytics 4 uniquement après consentement cookies,
 * et suit les changements de page en mode SPA.
 * Ne rend rien (composant logique).
 */
export default function GoogleAnalytics() {
  const location = useLocation();
  const firstRun = useRef(true);

  // Charger GA si déjà consenti au montage, ou dès que l'utilisateur accepte.
  useEffect(() => {
    if (hasCookieConsent()) loadGoogleAnalytics();
    const onAccept = () => loadGoogleAnalytics();
    window.addEventListener('pr-cookies-accepted', onAccept);
    return () => window.removeEventListener('pr-cookies-accepted', onAccept);
  }, []);

  // Suivre les navigations SPA. On saute le 1er run : la vue de la page
  // d'arrivée est déjà envoyée par gtag('config') au chargement de GA.
  useEffect(() => {
    if (firstRun.current) { firstRun.current = false; return; }
    trackPageview(location.pathname + location.search);
  }, [location.pathname, location.search]);

  return null;
}
