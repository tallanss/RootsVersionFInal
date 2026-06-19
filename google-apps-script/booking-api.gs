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
// 6. ⚠️ Cette version ajoute une notification de SECOURS via Gmail (MailApp).
//    À la première exécution, Google demandera de RÉAUTORISER le script
//    (nouveau périmètre Gmail) → cliquez "Autoriser". Sans ça, le repli
//    propriétaire ne fonctionnera pas.
//
// ============================================================

// ===== CONFIGURATION (À MODIFIER) =====
const CALENDAR_ID = 'primary';
const OWNER_EMAIL = 'Jimmy.racine@outlook.fr';
const BUSINESS_NAME = 'PhotoRoots';
const BUSINESS_PHONE = '06 03 16 36 21';

// Adresse d'expédition (domaine doit être vérifié dans Resend)
const FROM_EMAIL = 'PhotoRoots <noreply@photoroots.fr>';
const REPLY_TO = 'serviceclient@photoroots.fr';

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

// ===== POST : Enregistrer une demande de devis OU un message simple =====
function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // ----- Message simple (nom, email, message — sans date ni calendrier) -----
    if (data.type === 'message') {
      if (!data.name || !data.email || !data.message) {
        return jsonResponse({ error: 'Données manquantes (nom, email ou message)' }, 400);
      }
      sendContactMessageEmails(data);
      return jsonResponse({ success: true, message: 'Message bien reçu !' });
    }

    // ----- Demande de devis (parcours complet) -----
    // Valider les données requises (eventType, location, etc. sont optionnels)
    if (!data.date || !data.name || !data.email) {
      return jsonResponse({ error: 'Données manquantes (nom, email ou date)' }, 400);
    }

    // (La détection automatique « 2+ événements → date complète » a été retirée :
    // toute date reste réservable. Le blocage éventuel se gère à la main via le
    // dashboard, onglet « Disponibilités ».)

    // Chaque étape est INDÉPENDANTE : un échec n'empêche pas les suivantes.
    const status = { calendar: false, clientEmail: false, ownerEmail: false, ownerFallback: false };

    // 1) Événement Google Calendar (orange, à confirmer)
    try { createCalendarEvent(data); status.calendar = true; }
    catch (err) { logError_('Google Calendar', err); }

    // 2) Email de confirmation au client (via Resend)
    try { sendClientEmail(data); status.clientEmail = true; }
    catch (err) { logError_('Email client (Resend)', err); }

    // 3) Notification au propriétaire — DOIT aboutir quoi qu'il arrive.
    try {
      sendOwnerEmail(data);
      status.ownerEmail = true;
    } catch (err) {
      logError_('Email propriétaire (Resend)', err);
      // Repli Gmail indépendant de Resend → le proprio est toujours prévenu.
      try { notifyOwnerFallback_(data, err); status.ownerFallback = true; }
      catch (err2) { logError_('Repli Gmail (MailApp)', err2); }
    }

    return jsonResponse({ success: true, status: status, message: 'Demande de devis bien reçue !' });

  } catch (error) {
    // Dernier filet : prévenir le propriétaire qu'une demande a planté côté serveur.
    try {
      MailApp.sendEmail(OWNER_EMAIL, '⚠️ Erreur réservation — site PhotoRoots',
        'Une demande a échoué côté serveur : ' + error.message + '\n\n' +
        'Données reçues :\n' + (e && e.postData ? e.postData.contents : '(indisponible)'));
    } catch (_) {}
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
    '📩 Demande de devis PhotoRoots\n\n' +
    'Client : ' + data.name + '\n' +
    'Email : ' + data.email + '\n' +
    'Téléphone : ' + (data.phone || 'Non renseigné') + '\n' +
    'Type : ' + (data.eventType || 'Non précisé') + '\n' +
    'Lieu : ' + (data.location || 'Non renseigné') + '\n' +
    'Nombre d\'invités : ' + (data.guests || 'Non précisé') + '\n' +
    'Pack souhaité : ' + (data.formula || 'Non précisé') + '\n' +
    'Options : ' + (data.addons || 'Aucune') + '\n' +
    'Préférence de contact : ' + (data.contactPreference || 'Non précisée') + '\n' +
    'Connu via : ' + (data.referralSource || 'Non précisé') + '\n\n' +
    'Message : ' + (data.message || 'Aucun');

  const event = calendar.createAllDayEvent(
    '📩 Devis — ' + data.name + (data.eventType ? ' (' + data.eventType + ')' : ''),
    startDate,
    endDate,
    {
      description: description,
      location: data.location || 'Seine-Maritime, France',
    }
  );

  // Orange = devis en attente. Une fois confirmé, le propriétaire peut
  // changer la couleur manuellement (ex: GREEN pour confirmé).
  event.setColor(CalendarApp.EventColor.ORANGE);
  return event;
}

// ===== Envoyer email de confirmation de demande de devis au client =====
function sendClientEmail(data) {
  const dateFormatted = formatDateFR(parseDateFR(data.date));

  const subject = '📩 Demande de devis bien reçue — ' + BUSINESS_NAME;
  const rows = [
    ['Date de l\'événement', dateFormatted],
    ['Type d\'événement',   data.eventType || 'À préciser'],
    ['Lieu',                data.location || 'À préciser'],
    ['Nombre d\'invités',   data.guests || 'À préciser'],
    ['Pack souhaité',       data.formula || 'À préciser'],
    ['Téléphone',           data.phone || '—'],
    ['Préférence de contact', data.contactPreference || '—'],
  ];
  if (data.addons) rows.push(['Options souhaitées', data.addons]);

  const tableRows = rows.map(function(r, i) {
    var border = i < rows.length - 1 ? 'border-bottom: 1px solid #e2e8f0;' : '';
    return '<tr>' +
      '<td style="padding: 10px; ' + border + ' color: #64748b;">' + r[0] + '</td>' +
      '<td style="padding: 10px; ' + border + ' font-weight: bold; text-align: right;">' + r[1] + '</td>' +
    '</tr>';
  }).join('');

  const htmlBody =
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;" lang="fr">' +
    '<div style="background: #c5a059; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">' +
    '<h1 style="color: white; margin: 0; font-size: 24px;">📩 Nous avons bien reçu votre demande de devis</h1>' +
    '</div>' +
    '<div style="background: #f8faf9; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">' +
    '<p>Bonjour <strong>' + data.name + '</strong>,</p>' +
    '<p>Merci de nous avoir contactés. Nous avons bien reçu votre demande de devis et nous reviendrons vers vous <strong>sous 24h</strong> avec une proposition personnalisée.</p>' +
    '<p style="color: #64748b; font-size: 14px; margin-top: 16px;">Voici les informations que vous nous avez transmises :</p>' +
    '<table style="width: 100%; border-collapse: collapse; margin: 12px 0 20px;">' + tableRows + '</table>' +
    '<p style="color: #64748b; font-size: 14px;">Pour toute question urgente, répondez directement à cet email ou appelez-nous au <strong>' + BUSINESS_PHONE + '</strong>.</p>' +
    '<p>À très vite,<br><strong>L\'équipe ' + BUSINESS_NAME + '</strong></p>' +
    '</div></div>';

  sendViaResend(data.email, subject, htmlBody);
}

// ===== Envoyer email de notification au propriétaire =====
function sendOwnerEmail(data) {
  const dateFormatted = formatDateFR(parseDateFR(data.date));

  const subject = '🔔 Nouvelle demande de devis — ' + data.name + (data.eventType ? ' (' + data.eventType + ')' : '');

  const rows = [
    ['Client',                data.name],
    ['Email',                 '<a href="mailto:' + data.email + '">' + data.email + '</a>'],
    ['Téléphone',             data.phone || '—'],
    ['Date',                  dateFormatted],
    ['Événement',             data.eventType || '—'],
    ['Lieu',                  data.location || 'Non renseigné'],
    ['Nombre d\'invités',     data.guests || '—'],
    ['Pack souhaité',         data.formula || '—'],
    ['Préférence de contact', data.contactPreference || '—'],
    ['Connu via',             data.referralSource || '—'],
  ];
  if (data.addons) rows.push(['Options souhaitées', data.addons]);

  const tableRows = rows.map(function(r, i) {
    var border = i < rows.length - 1 ? 'border-bottom: 1px solid #e2e8f0;' : '';
    return '<tr>' +
      '<td style="padding: 10px; ' + border + ' color: #64748b;">' + r[0] + '</td>' +
      '<td style="padding: 10px; ' + border + ' font-weight: bold; text-align: right;">' + r[1] + '</td>' +
    '</tr>';
  }).join('');

  const htmlBody =
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;" lang="fr">' +
    '<div style="background: #0f172a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">' +
    '<h1 style="color: #c5a059; margin: 0; font-size: 24px;">🔔 Nouvelle demande de devis</h1>' +
    '</div>' +
    '<div style="background: #f8faf9; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">' +
    '<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">' + tableRows + '</table>' +
    (data.message ? '<div style="background: white; padding: 14px; border-radius: 8px; margin-top: 12px; border: 1px solid #e2e8f0;"><strong>Message :</strong><br>' + data.message + '</div>' : '') +
    '<p style="color: #64748b; font-size: 13px; margin-top: 16px;">Une entrée pré-réservation a été ajoutée à votre Google Calendar — pensez à confirmer ou retirer après envoi du devis.</p>' +
    '</div></div>';

  sendViaResend(OWNER_EMAIL, subject, htmlBody);
}

// ===== Emails pour un message simple (sans réservation) =====
function sendContactMessageEmails(data) {
  // 1) Notification au propriétaire
  const ownerSubject = '✉️ Nouveau message — ' + data.name;
  const ownerBody =
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;" lang="fr">' +
    '<div style="background: #0f172a; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">' +
    '<h1 style="color: #c5a059; margin: 0; font-size: 24px;">✉️ Nouveau message</h1>' +
    '</div>' +
    '<div style="background: #f8faf9; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">' +
    '<table style="width: 100%; border-collapse: collapse; margin: 10px 0;">' +
    '<tr><td style="padding: 10px; border-bottom: 1px solid #e2e8f0; color: #64748b;">Nom</td>' +
    '<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-weight: bold; text-align: right;">' + data.name + '</td></tr>' +
    '<tr><td style="padding: 10px; color: #64748b;">Email</td>' +
    '<td style="padding: 10px; text-align: right;"><a href="mailto:' + data.email + '">' + data.email + '</a></td></tr>' +
    '</table>' +
    '<div style="background: white; padding: 14px; border-radius: 8px; margin-top: 12px; border: 1px solid #e2e8f0;"><strong>Message :</strong><br>' + data.message + '</div>' +
    '</div></div>';
  try {
    sendViaResend(OWNER_EMAIL, ownerSubject, ownerBody);
  } catch (err) {
    logError_('Message — email propriétaire (Resend)', err);
    // Repli Gmail : le proprio reçoit quand même le message.
    try {
      MailApp.sendEmail(OWNER_EMAIL, '🔔 [SECOURS] Nouveau message — ' + data.name,
        'De : ' + data.name + ' <' + data.email + '>\n\n' + data.message +
        '\n\n⚠️ L\'email via Resend a échoué : ' + err.message);
    } catch (_) {}
  }

  // 2) Accusé de réception au client
  const clientSubject = '✅ Votre message est bien reçu — ' + BUSINESS_NAME;
  const clientBody =
    '<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;" lang="fr">' +
    '<div style="background: #c5a059; padding: 24px; text-align: center; border-radius: 12px 12px 0 0;">' +
    '<h1 style="color: white; margin: 0; font-size: 24px;">✅ Message bien reçu</h1>' +
    '</div>' +
    '<div style="background: #f8faf9; padding: 24px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px;">' +
    '<p>Bonjour <strong>' + data.name + '</strong>,</p>' +
    '<p>Merci pour votre message, nous y répondrons dans les plus brefs délais.</p>' +
    '<div style="background: white; padding: 14px; border-radius: 8px; margin: 12px 0; border: 1px solid #e2e8f0; color: #64748b;"><em>« ' + data.message + ' »</em></div>' +
    '<p style="color: #64748b; font-size: 14px;">Besoin d\'une réponse rapide ? Appelez-nous au <strong>' + BUSINESS_PHONE + '</strong>.</p>' +
    '<p>À très vite,<br><strong>L\'équipe ' + BUSINESS_NAME + '</strong></p>' +
    '</div></div>';
  try {
    sendViaResend(data.email, clientSubject, clientBody);
  } catch (err) {
    logError_('Message — accusé client (Resend)', err);
  }
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
    // On lève une vraie erreur : l'appelant décide quoi faire (repli Gmail, log).
    // AVANT, l'échec était avalé silencieusement → emails coupés sans alerte.
    throw new Error('Resend ' + code + ' : ' + response.getContentText());
  }
  console.log('Email envoyé à ' + to);
}

// ===== Log d'erreur (visible dans Apps Script → Exécutions) =====
function logError_(etape, err) {
  console.error('[PhotoRoots] Échec ' + etape + ' : ' + (err && err.message ? err.message : err));
}

// ===== Repli : prévenir le propriétaire via Gmail si Resend échoue =====
// MailApp envoie depuis le compte Google propriétaire du script — INDÉPENDANT
// de la vérification du domaine Resend. Quota ~100/jour (large pour des leads).
function notifyOwnerFallback_(data, resendErr) {
  const dateFormatted = data.date ? formatDateFR(parseDateFR(data.date)) : '—';
  const body =
    '⚠️ NOTIFICATION DE SECOURS — l\'envoi via Resend a échoué, mais voici la demande reçue :\n\n' +
    'Client : ' + data.name + '\n' +
    'Email : ' + data.email + '\n' +
    'Téléphone : ' + (data.phone || '—') + '\n' +
    'Date : ' + dateFormatted + '\n' +
    'Événement : ' + (data.eventType || '—') + '\n' +
    'Lieu : ' + (data.location || '—') + '\n' +
    'Nombre d\'invités : ' + (data.guests || '—') + '\n' +
    'Pack souhaité : ' + (data.formula || '—') + '\n' +
    'Options : ' + (data.addons || '—') + '\n' +
    'Préférence de contact : ' + (data.contactPreference || '—') + '\n' +
    'Message : ' + (data.message || '—') + '\n\n' +
    'Erreur Resend : ' + (resendErr && resendErr.message ? resendErr.message : resendErr) + '\n' +
    'À faire : vérifier la vérification du domaine sur https://resend.com/domains';
  MailApp.sendEmail(OWNER_EMAIL, '🔔 [SECOURS] Nouvelle demande — ' + data.name, body);
}

// ===== Helper : Réponse JSON avec CORS =====
function jsonResponse(data, status) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON);
}
