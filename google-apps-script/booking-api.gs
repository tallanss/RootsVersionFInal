// ============================================================
// Google Apps Script — PhotoRoots Booking API (Resend)
// ============================================================
//
// INSTRUCTIONS DE DÉPLOIEMENT :
//
// 1. Ouvrez le projet "PhotoRoots Booking" sur https://script.google.com/
// 2. Collez TOUT ce code (remplacez le contenu existant)
// 3. Dans "Paramètres du projet" (roue crantée à gauche) → "Propriétés
//    du script" → ajoutez une propriété :
//        clé    : RESEND_API_KEY
//        valeur : re_xxxxxxxxxxxxxxxxxxx (votre clé Resend)
// 4. Déployer → Gérer les déploiements → crayon (Modifier) → Version :
//    "Nouvelle version" → Déployer
// 5. L'URL ne change pas : rien à modifier côté Vercel
//
// ============================================================

// ===== CONFIGURATION (À MODIFIER) =====
const CALENDAR_ID = 'primary';
const OWNER_EMAIL = 'Jimmy.racine@outlook.fr';
const BUSINESS_NAME = 'PhotoRoots';
const BUSINESS_PHONE = '06 03 16 36 21';

// Adresse d'expédition (domaine doit être vérifié dans Resend)
const FROM_EMAIL = 'PhotoRoots <noreply@photoroots.fr>';
const REPLY_TO = 'contact@photoroots.fr';

// ===== GET : Récupérer les dates occupées =====
function doGet(e) {
  try {
    const action = e.parameter.action;

    if (action === 'busy') {
      return getBusyDates();
    }

    return jsonResponse({ error: 'Action non reconnue' }, 400);
  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// ===== POST : Créer une réservation =====
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    
    // Valider les données requises
    if (!data.date || !data.name || !data.email || !data.eventType) {
      return jsonResponse({ error: 'Données manquantes' }, 400);
    }

    // Vérifier que la date n'est pas déjà prise
    const busy = getBusyDatesArray();
    if (busy.includes(data.date)) {
      return jsonResponse({ error: 'Cette date est déjà réservée. Veuillez choisir une autre date.' }, 409);
    }

    // Créer l'événement sur Google Calendar
    const event = createCalendarEvent(data);

    // Envoyer email de confirmation au client
    sendClientEmail(data);

    // Envoyer email de notification au propriétaire
    sendOwnerEmail(data);

    return jsonResponse({ 
      success: true, 
      eventId: event.getId(),
      message: 'Réservation confirmée !'
    });

  } catch (error) {
    return jsonResponse({ error: error.message }, 500);
  }
}

// ===== Récupérer les dates occupées =====
function getBusyDates() {
  const dates = getBusyDatesArray();
  return jsonResponse({ busySlots: dates });
}

function getBusyDatesArray() {
  const now = new Date();
  const sixMonthsLater = new Date();
  sixMonthsLater.setMonth(sixMonthsLater.getMonth() + 6);

  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);
  const events = calendar.getEvents(now, sixMonthsLater);

  // Il y a 2 photobooths disponibles : une date n'est considérée comme
  // complète que lorsqu'elle totalise au moins 2 événements.
  const countPerDate = {};
  events.forEach(function(event) {
    const start = event.getStartTime();
    const dateStr = Utilities.formatDate(start, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    countPerDate[dateStr] = (countPerDate[dateStr] || 0) + 1;
  });

  return Object.keys(countPerDate).filter(function(d) {
    return countPerDate[d] >= 2;
  });
}

// ===== Helpers dates en français =====
function parseDateFR(dateStr) {
  const parts = dateStr.split('-');
  return new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
}

function formatDateFR(dateObj) {
  // Force la locale française (jour et mois en toutes lettres)
  return dateObj.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

// ===== Créer un événement sur Google Calendar =====
function createCalendarEvent(data) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);

  const startDate = parseDateFR(data.date);
  const endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);

  const description =
    '📸 Réservation PhotoRoots\n\n' +
    'Client : ' + data.name + '\n' +
    'Email : ' + data.email + '\n' +
    'Téléphone : ' + (data.phone || 'Non renseigné') + '\n' +
    'Type : ' + data.eventType + '\n' +
    'Lieu : ' + (data.location || 'Non renseigné') + '\n' +
    'Formule : ' + (data.formula || 'Non précisée') + '\n\n' +
    'Message : ' + (data.message || 'Aucun');

  const event = calendar.createAllDayEvent(
    '📸 PhotoRoots — ' + data.name + ' (' + data.eventType + ')',
    startDate,
    endDate,
    {
      description: description,
      location: data.location || 'Seine-Maritime, France',
    }
  );

  event.setColor(CalendarApp.EventColor.GREEN);
  return event;
}

// ===== Envoyer email de confirmation au client =====
function sendClientEmail(data) {
  const dateFormatted = formatDateFR(parseDateFR(data.date));

  const subject = '✅ Réservation confirmée — ' + BUSINESS_NAME;
  const htmlBody =
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;" lang="fr">' +
    '<div style="background: #16a34a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">' +
    '<h1 style="color: white; margin: 0; font-size: 24px;">✅ Réservation confirmée</h1>' +
    '</div>' +
    '<div style="background: #f8faf9; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">' +
    '<p>Bonjour <strong>' + data.name + '</strong>,</p>' +
    '<p>Nous avons bien enregistré votre réservation de photobooth. Voici le récapitulatif :</p>' +
    '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Date</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + dateFormatted + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Événement</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + data.eventType + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Lieu</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + (data.location || 'À préciser') + '</td></tr>' +
    '<tr><td style="padding: 10px; color: #64748b;">Formule</td>' +
    '<td style="padding: 10px; font-weight: bold; text-align: right;">' + (data.formula || '—') + '</td></tr>' +
    '</table>' +
    '<p style="color: #64748b; font-size: 14px;">Nous vous recontacterons très vite pour finaliser ensemble les détails de votre événement.</p>' +
    '<p style="color: #64748b; font-size: 14px;">Pour toute question, répondez simplement à cet email ou appelez-nous au ' + BUSINESS_PHONE + '.</p>' +
    '<p>À très bientôt,<br><strong>L\'équipe ' + BUSINESS_NAME + '</strong></p>' +
    '</div></div>';

  sendViaResend(data.email, subject, htmlBody);
}

// ===== Envoyer email de notification au propriétaire =====
function sendOwnerEmail(data) {
  const dateFormatted = formatDateFR(parseDateFR(data.date));

  const subject = '🔔 Nouvelle réservation — ' + data.name + ' (' + data.eventType + ')';
  const htmlBody =
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;" lang="fr">' +
    '<div style="background: #0f172a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">' +
    '<h1 style="color: #22c55e; margin: 0; font-size: 24px;">🔔 Nouvelle réservation</h1>' +
    '</div>' +
    '<div style="background: #f8faf9; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">' +
    '<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Client</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + data.name + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Email</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; text-align: right;"><a href="mailto:' + data.email + '">' + data.email + '</a></td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Téléphone</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + (data.phone || '—') + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Date</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + dateFormatted + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Événement</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + data.eventType + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Lieu</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + (data.location || 'Non renseigné') + '</td></tr>' +
    '<tr><td style="padding: 10px; color: #64748b;">Formule</td>' +
    '<td style="padding: 10px; font-weight: bold; text-align: right;">' + (data.formula || '—') + '</td></tr>' +
    '</table>' +
    (data.message ? '<div style="background: white; padding: 14px; border-radius: 8px; margin-top: 12px; border: 1px solid #e2e8f0;"><strong>Message :</strong><br>' + data.message + '</div>' : '') +
    '<p style="color: #64748b; font-size: 13px; margin-top: 16px;">L\'événement a été ajouté automatiquement à votre Google Calendar.</p>' +
    '</div></div>';

  sendViaResend(OWNER_EMAIL, subject, htmlBody);
}

// ===== Helper : Envoi d'email via l'API Resend =====
function sendViaResend(to, subject, htmlBody) {
  const apiKey = PropertiesService.getScriptProperties().getProperty('RESEND_API_KEY');
  if (!apiKey) {
    throw new Error('RESEND_API_KEY manquante dans les Propriétés du script');
  }

  const payload = {
    from: FROM_EMAIL,
    to: [to],
    subject: subject,
    html: htmlBody,
    reply_to: REPLY_TO,
  };

  const response = UrlFetchApp.fetch('https://api.resend.com/emails', {
    method: 'post',
    contentType: 'application/json',
    headers: { Authorization: 'Bearer ' + apiKey },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  });

  const code = response.getResponseCode();
  if (code < 200 || code >= 300) {
    console.error('Resend API error ' + code + ': ' + response.getContentText());
  } else {
    console.log('Email envoyé à ' + to);
  }
}

// ===== Helper : Réponse JSON avec CORS =====
function jsonResponse(data, status) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
