// ============================================================
// Google Apps Script — PhotoRoots Booking API
// ============================================================
// 
// INSTRUCTIONS DE DÉPLOIEMENT :
// 
// 1. Allez sur https://script.google.com/
// 2. Créez un nouveau projet "PhotoRoots Booking"
// 3. Collez TOUT ce code dans l'éditeur (remplacez le contenu par défaut)
// 4. Modifiez les constantes ci-dessous avec vos infos
// 5. Cliquez sur "Déployer" > "Nouveau déploiement"
// 6. Type : "Application Web"
//    - Exécuter en tant que : "Moi"
//    - Qui a accès : "Tout le monde"
// 7. Cliquez sur "Déployer" et copiez l'URL générée
// 8. Collez cette URL dans src/config/emailjs.js > APPS_SCRIPT_URL
//
// ============================================================

// ===== CONFIGURATION (À MODIFIER) =====
const CALENDAR_ID = 'primary'; // 'primary' = votre calendrier principal, ou ID spécifique
const OWNER_EMAIL = 'Jimmy.racine@outlook.fr'; // Votre email
const BUSINESS_NAME = 'PhotoRoots';
const BUSINESS_PHONE = '+33 6 12 34 56 78';

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
    if (!data.date || !data.slot || !data.name || !data.email || !data.eventType) {
      return jsonResponse({ error: 'Données manquantes' }, 400);
    }

    // Vérifier que la date n'est pas déjà prise
    const busy = getBusyDatesArray();
    const dateKey = data.date + '_' + data.slot;
    if (busy.includes(dateKey)) {
      return jsonResponse({ error: 'Ce créneau est déjà réservé. Veuillez choisir une autre date.' }, 409);
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

  const busySlots = [];

  events.forEach(function(event) {
    const title = event.getTitle();
    // Ne prendre que les événements PhotoRoots
    if (title.indexOf('PhotoRoots') === -1 && title.indexOf('📸') === -1) return;

    const start = event.getStartTime();
    const dateStr = Utilities.formatDate(start, Session.getScriptTimeZone(), 'yyyy-MM-dd');
    const hour = start.getHours();
    const slot = hour < 17 ? 'afternoon' : 'evening';

    busySlots.push(dateStr + '_' + slot);
  });

  return busySlots;
}

// ===== Créer un événement sur Google Calendar =====
function createCalendarEvent(data) {
  const calendar = CalendarApp.getCalendarById(CALENDAR_ID);

  const parts = data.date.split('-');
  const year = parseInt(parts[0]);
  const month = parseInt(parts[1]) - 1;
  const day = parseInt(parts[2]);

  const startHour = data.slot === 'afternoon' ? 14 : 19;
  const endHour = data.slot === 'afternoon' ? 18 : 23;

  const startTime = new Date(year, month, day, startHour, 0, 0);
  const endTime = new Date(year, month, day, endHour, 0, 0);

  const slotLabel = data.slot === 'afternoon' ? 'Après-midi (14h-18h)' : 'Soirée (19h-23h)';

  const description = 
    '📸 Réservation PhotoRoots\n\n' +
    'Client : ' + data.name + '\n' +
    'Email : ' + data.email + '\n' +
    'Téléphone : ' + (data.phone || 'Non renseigné') + '\n' +
    'Type : ' + data.eventType + '\n' +
    'Formule : ' + (data.formula || 'Non précisée') + '\n' +
    'Créneau : ' + slotLabel + '\n\n' +
    'Message : ' + (data.message || 'Aucun');

  const event = calendar.createEvent(
    '📸 PhotoRoots — ' + data.name + ' (' + data.eventType + ')',
    startTime,
    endTime,
    {
      description: description,
      location: 'Seine-Maritime, France',
    }
  );

  // Ajouter une couleur (orange/rouge pour bien voir)
  event.setColor(CalendarApp.EventColor.GREEN);

  return event;
}

// ===== Envoyer email de confirmation au client =====
function sendClientEmail(data) {
  const slotLabel = data.slot === 'afternoon' ? 'Après-midi (14h-18h)' : 'Soirée (19h-23h)';
  const parts = data.date.split('-');
  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const dateFormatted = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'EEEE d MMMM yyyy');

  const subject = '✅ Réservation confirmée — ' + BUSINESS_NAME;
  const htmlBody = 
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' +
    '<div style="background: #16a34a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">' +
    '<h1 style="color: white; margin: 0; font-size: 24px;">✅ Réservation Confirmée</h1>' +
    '</div>' +
    '<div style="background: #f8faf9; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">' +
    '<p>Bonjour <strong>' + data.name + '</strong>,</p>' +
    '<p>Votre réservation de photobooth a bien été enregistrée !</p>' +
    '<table style="width: 100%; border-collapse: collapse; margin: 20px 0;">' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Date</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + dateFormatted + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Créneau</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + slotLabel + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Formule</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + (data.formula || '—') + '</td></tr>' +
    '<tr><td style="padding: 10px; color: #64748b;">Événement</td>' +
    '<td style="padding: 10px; font-weight: bold; text-align: right;">' + data.eventType + '</td></tr>' +
    '</table>' +
    '<p style="color: #64748b; font-size: 14px;">Nous vous contacterons bientôt pour finaliser les détails.</p>' +
    '<p>À très vite !<br><strong>' + BUSINESS_NAME + '</strong><br>' + BUSINESS_PHONE + '</p>' +
    '</div></div>';

  MailApp.sendEmail({
    to: data.email,
    subject: subject,
    htmlBody: htmlBody,
  });
}

// ===== Envoyer email de notification au propriétaire =====
function sendOwnerEmail(data) {
  const slotLabel = data.slot === 'afternoon' ? 'Après-midi (14h-18h)' : 'Soirée (19h-23h)';
  const parts = data.date.split('-');
  const dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
  const dateFormatted = Utilities.formatDate(dateObj, Session.getScriptTimeZone(), 'EEEE d MMMM yyyy');

  const subject = '🔔 Nouvelle réservation — ' + data.name + ' (' + data.eventType + ')';
  const htmlBody = 
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">' +
    '<div style="background: #0f172a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">' +
    '<h1 style="color: #22c55e; margin: 0; font-size: 24px;">🔔 Nouvelle Réservation</h1>' +
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
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Créneau</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + slotLabel + '</td></tr>' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Formule</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + (data.formula || '—') + '</td></tr>' +
    '<tr><td style="padding: 10px; color: #64748b;">Événement</td>' +
    '<td style="padding: 10px; font-weight: bold; text-align: right;">' + data.eventType + '</td></tr>' +
    '</table>' +
    (data.message ? '<div style="background: white; padding: 14px; border-radius: 8px; margin-top: 12px; border: 1px solid #e2e8f0;"><strong>Message :</strong><br>' + data.message + '</div>' : '') +
    '<p style="color: #64748b; font-size: 13px; margin-top: 16px;">L\'événement a été ajouté automatiquement à votre Google Calendar.</p>' +
    '</div></div>';

  MailApp.sendEmail({
    to: OWNER_EMAIL,
    subject: subject,
    htmlBody: htmlBody,
  });
}

// ===== Helper : Réponse JSON avec CORS =====
function jsonResponse(data, status) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
