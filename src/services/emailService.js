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

const BUSY_SLOTS_CACHE_KEY = 'pr_busy_slots_cache';
const BUSY_SLOTS_TTL_MS = 10 * 60 * 1000; // 10 minutes

/**
 * Récupère les créneaux déjà réservés depuis Google Calendar
 * Résultat mis en cache 10 min dans sessionStorage pour éviter les cold starts
 * Retourne un tableau de strings "YYYY-MM-DD_slot"
 */
export async function fetchBusySlots() {
  if (!isConfigured()) {
    return [];
  }

  // Lire le cache
  try {
    const cached = sessionStorage.getItem(BUSY_SLOTS_CACHE_KEY);
    if (cached) {
      const { slots, timestamp } = JSON.parse(cached);
      if (Date.now() - timestamp < BUSY_SLOTS_TTL_MS) {
        return slots;
      }
    }
  } catch {}

  // Fetch frais
  try {
    const url = `${BOOKING_CONFIG.APPS_SCRIPT_URL}?action=busy`;
    const response = await fetch(url);
    const data = await response.json();
    const slots = data.busySlots || [];
    sessionStorage.setItem(BUSY_SLOTS_CACHE_KEY, JSON.stringify({ slots, timestamp: Date.now() }));
    return slots;
  } catch (error) {
    console.error('Erreur récupération dates occupées:', error);
    return [];
  }
}

/**
 * Invalide le cache des créneaux (à appeler après une réservation réussie)
 */
export function invalidateBusySlotsCache() {
  sessionStorage.removeItem(BUSY_SLOTS_CACHE_KEY);
}

/**
 * Envoie la réservation au Google Apps Script
 * → Crée l'événement sur Google Calendar
 * → Envoie les emails (confirmation client + notification propriétaire)
 */
export async function processBooking(booking) {
  if (!isConfigured()) {
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
