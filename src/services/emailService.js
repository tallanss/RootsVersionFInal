import { BOOKING_CONFIG, isConfigured } from '../config/emailjs';

/**
 * Formate une date YYYY-MM-DD en français (sans timezone bug)
 */
export function formatDateFR(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  return date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/**
 * Récupère les créneaux déjà réservés depuis Google Calendar
 * Retourne un tableau de strings "YYYY-MM-DD_slot"
 */
export async function fetchBusySlots() {
  if (!isConfigured()) {
    console.log('[DEMO] Pas de dates occupées (mode démo)');
    return [];
  }

  try {
    const url = `${BOOKING_CONFIG.APPS_SCRIPT_URL}?action=busy`;
    const response = await fetch(url);
    const data = await response.json();
    return data.busySlots || [];
  } catch (error) {
    console.error('Erreur récupération dates occupées:', error);
    return [];
  }
}

/**
 * Envoie la réservation au Google Apps Script
 * → Crée l'événement sur Google Calendar
 * → Envoie les emails (confirmation client + notification propriétaire)
 */
export async function processBooking(booking) {
  if (!isConfigured()) {
    // Mode démo : simuler le succès
    console.log('[DEMO] Réservation simulée:', booking);
    return {
      success: true,
      isDemo: true,
      message: 'Réservation simulée (mode démo)',
    };
  }

  try {
    const response = await fetch(BOOKING_CONFIG.APPS_SCRIPT_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(booking),
      mode: 'no-cors', // Google Apps Script nécessite no-cors
    });

    // Avec no-cors, on ne peut pas lire la réponse mais la requête est envoyée
    // Google Apps Script renverra un redirect, donc on considère que c'est un succès
    // si pas d'erreur réseau
    return {
      success: true,
      isDemo: false,
      message: 'Réservation confirmée !',
    };
  } catch (error) {
    console.error('Erreur réservation:', error);
    return {
      success: false,
      error: 'Erreur de connexion. Veuillez réessayer ou nous contacter directement.',
    };
  }
}
