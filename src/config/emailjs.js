// ============================================
// Configuration PhotoRoots Booking
// ============================================

export const BOOKING_CONFIG = {
  // ===== GOOGLE APPS SCRIPT =====
  // URL de votre Google Apps Script déployé en tant qu'Application Web
  // Suivez les instructions dans google-apps-script/booking-api.gs
  APPS_SCRIPT_URL: 'https://script.google.com/macros/s/AKfycbznU-4laUBwbrdx-IJFlpjWz_PO5d62pWr0FwwwSCwCJ64mHdoIgqZmFzXluvJt2OnQ/exec',

  // ===== INFO ENTREPRISE =====
  OWNER_EMAIL: 'Jimmy.racine@outlook.fr',
  BUSINESS_NAME: 'PhotoRoots',
  BUSINESS_PHONE: '+33 6 12 34 56 78',
};

// Le système est configuré quand l'URL du script est renseignée
export const isConfigured = () => {
  return !!BOOKING_CONFIG.APPS_SCRIPT_URL;
};
