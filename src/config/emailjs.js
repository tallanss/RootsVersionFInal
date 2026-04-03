// ============================================
// Configuration PhotoRoots Booking
// ============================================

export const BOOKING_CONFIG = {
  // ===== GOOGLE APPS SCRIPT =====
  // Définir VITE_APPS_SCRIPT_URL dans .env (ne jamais committer l'URL réelle)
  APPS_SCRIPT_URL: import.meta.env.VITE_APPS_SCRIPT_URL || '',

  // ===== INFO ENTREPRISE =====
  OWNER_EMAIL: import.meta.env.VITE_OWNER_EMAIL || '',
  BUSINESS_NAME: 'PhotoRoots',
  BUSINESS_PHONE: import.meta.env.VITE_BUSINESS_PHONE || '',
};

// Le système est configuré quand l'URL du script est renseignée
export const isConfigured = () => {
  return !!BOOKING_CONFIG.APPS_SCRIPT_URL;
};
