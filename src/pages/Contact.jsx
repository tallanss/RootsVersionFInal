import { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2, Send, ChevronRight, ChevronLeft, Calendar, CalendarCheck, Loader2, AlertCircle } from 'lucide-react';
import { processBooking, formatDateFR, fetchBusySlots, invalidateBusySlotsCache } from '../services/emailService';
import { isConfigured } from '../config/emailjs';
import Confetti from '../components/Confetti';
import { Helmet } from 'react-helmet-async';
import EditableBlock from '../components/admin/EditableBlock';

import { useContent } from '../context/ContentContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s()./-]{7,20}$/;

const CONTACT_PREFERENCES = ['Par email', 'Par téléphone', 'Par SMS', 'WhatsApp', 'Peu importe'];
const REFERRAL_SOURCES = ['Google', 'Bouche à oreille', 'Réseaux sociaux (Instagram, Facebook…)', 'Salle de réception', 'Wedding planner', 'Autre'];

const Contact = () => {
  const { content, updateContent } = useContent();

  const eventTypes = content.formOptions?.eventTypes || ['Mariage', 'Anniversaire', 'Entreprise', 'Baptême', 'EVJF/EVG', 'Autre'];

  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [busySlots, setBusySlots] = useState([]);

  // Calendar dropdown state
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const dateFieldRef = useRef(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventType: '',
    date: '', // YYYY-MM-DD
    location: '',
    contactPreference: '',
    referralSource: '',
  });

  // Charger les dates occupées au montage
  useEffect(() => {
    const loadBusySlots = async () => {
      setLoadingSlots(true);
      const slots = await fetchBusySlots();
      const busyDates = slots.map(s => s.split('_')[0]);
      const cmsBlocked = content.blockedDates || [];
      setBusySlots([...new Set([...busyDates, ...cmsBlocked])]);
      setLoadingSlots(false);
    };
    loadBusySlots();
  }, [content.blockedDates]);

  // Click outside closes calendar
  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e) => {
      if (dateFieldRef.current && !dateFieldRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [calendarOpen]);

  // Calendar logic
  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startPad = (firstDay.getDay() + 6) % 7;

    const days = [];
    for (let i = 0; i < startPad; i++) days.push(null);
    for (let d = 1; d <= lastDay.getDate(); d++) {
      const date = new Date(year, month, d);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const isPast = date < today;
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const isFullyBooked = busySlots.includes(dateStr);
      days.push({ day: d, date, isPast, dateStr, isFullyBooked });
    }
    return days;
  }, [currentMonth, busySlots]);

  const monthLabel = currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });

  const prevMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() - 1);
    const now = new Date();
    if (d.getFullYear() > now.getFullYear() || (d.getFullYear() === now.getFullYear() && d.getMonth() >= now.getMonth())) {
      setCurrentMonth(d);
    }
  };

  const nextMonth = () => {
    const d = new Date(currentMonth);
    d.setMonth(d.getMonth() + 1);
    setCurrentMonth(d);
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const selectDate = (dateStr) => {
    setFormData({ ...formData, date: dateStr });
    setCalendarOpen(false);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!formData.name.trim()) { setError('Veuillez saisir vos nom et prénom.'); return; }
    if (!EMAIL_REGEX.test(formData.email)) { setError('Veuillez saisir une adresse email valide.'); return; }
    if (formData.phone && !PHONE_REGEX.test(formData.phone)) { setError('Numéro de téléphone invalide.'); return; }
    if (!formData.date) { setError('Veuillez sélectionner une date pour votre événement.'); return; }

    // Rate limiting: 1 soumission par 30s
    const lastSubmit = sessionStorage.getItem('pr_last_submit');
    if (lastSubmit && Date.now() - Number(lastSubmit) < 30000) {
      setError('Veuillez patienter quelques secondes avant de renvoyer.');
      return;
    }
    sessionStorage.setItem('pr_last_submit', String(Date.now()));
    setLoading(true);

    // Compose un message lisible si l'utilisateur n'a rien écrit (et inclut les nouveaux champs)
    const autoMessage = [
      formData.contactPreference ? `Contact préféré : ${formData.contactPreference}` : null,
      formData.referralSource ? `Connu via : ${formData.referralSource}` : null,
    ].filter(Boolean).join('\n');

    const booking = {
      date: formData.date,
      formula: 'Demande de devis',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      eventType: formData.eventType,
      location: formData.location,
      message: autoMessage,
      contactPreference: formData.contactPreference,
      referralSource: formData.referralSource,
    };

    const res = await processBooking(booking);
    setLoading(false);

    if (res.success) {
      invalidateBusySlotsCache();
      const newMessage = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formatDateFR(formData.date),
        subject: formData.eventType || 'Demande de devis',
        location: formData.location,
        formula: 'Demande de devis',
        fullMessage: autoMessage,
        contactPreference: formData.contactPreference,
        referralSource: formData.referralSource,
        status: 'Nouveau',
        createdAt: new Date().toISOString(),
      };
      const newMessages = [newMessage, ...(content.messages || [])];
      updateContent({ messages: newMessages });

      setResult(res);
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(res.error || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // ===== SUCCESS STATE =====
  if (submitted) {
    return (
      <div className="animate-in">
        <Confetti active={submitted} />
        <Helmet>
          <title>Demande envoyée | PhotoRoots</title>
        </Helmet>
        <section className="container" style={{ padding: '32px 24px' }}>
          <div style={{ textAlign: 'center', padding: '32px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <CheckCircle2 size={36} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>Merci, votre demande est bien reçue !</h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {result?.isDemo ? (
                <>Mode démo — en production, nous reviendrons vers vous sous 24h à <strong>{formData.email}</strong>.</>
              ) : (
                <>Nous revenons vers vous sous 24h à <strong>{formData.email}</strong> avec un devis personnalisé.</>
              )}
            </p>

            <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Date envisagée</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{formatDateFR(formData.date)}</span>
              </div>
              {formData.eventType && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: formData.location ? '1px solid var(--border-light)' : 'none' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Événement</span>
                  <span style={{ fontSize: '14px', fontWeight: 700 }}>{formData.eventType}</span>
                </div>
              )}
              {formData.location && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                  <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Lieu</span>
                  <span style={{ fontSize: '14px', fontWeight: 700, textAlign: 'right', maxWidth: '60%' }}>{formData.location}</span>
                </div>
              )}
            </div>

            <Link to="/">
              <button className="btn-primary" style={{ width: '100%' }}>
                Retour à l'accueil
              </button>
            </Link>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="animate-in">
      <Helmet>
        <title>Contact & devis | PhotoRoots</title>
        <meta name="description" content="Contactez PhotoRoots pour votre événement en Seine-Maritime. Demande de devis gratuit en 24h." />
        <meta name="keywords" content="contact photoroots, devis photobooth normandie, location borne photo le havre, rouen" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://photoroots.fr/contact" />
        <meta property="og:title" content="Contact & devis | PhotoRoots" />
        <meta property="og:description" content="Contactez PhotoRoots pour votre événement en Seine-Maritime. Demande de devis gratuit en 24h." />
        <meta property="og:image" content="https://photoroots.fr/photobooth-hero.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact & devis | PhotoRoots" />
        <meta name="twitter:description" content="Contactez PhotoRoots pour votre événement en Seine-Maritime. Demande de devis gratuit en 24h." />
        <meta name="twitter:image" content="https://photoroots.fr/photobooth-hero.png" />
        <link rel="canonical" href="https://photoroots.fr/contact" />
      </Helmet>

      {/* HEADER */}
      <section className="container" style={{ padding: '32px 20px 16px' }}>
        <div className="section-tag"><Calendar size={14} /> Contact</div>
        <EditableBlock
          label="Header Contact"
          modalTitle="Modifier le Titre"
          fields={[
            { key: 'title', label: 'Titre', type: 'text', value: content.contactPage?.title || 'Demande de devis' },
            { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: content.contactPage?.subtitle || 'Parlez-nous de votre événement, nous revenons vers vous sous 24h avec une proposition personnalisée.' },
          ]}
          onSave={(vals) => updateContent({ contactPage: { ...content.contactPage, ...vals } })}
        >
          <h1 className="section-title" style={{ fontSize: '28px' }}>{content.contactPage?.title || 'Demande de devis'}</h1>
          <p className="section-subtitle" style={{ marginBottom: '20px' }}>
            {content.contactPage?.subtitle || 'Parlez-nous de votre événement, nous revenons vers vous sous 24h avec une proposition personnalisée.'}
          </p>
        </EditableBlock>

        {!isConfigured() && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '20px', fontSize: '13px', color: 'var(--primary)', lineHeight: 1.5 }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span><strong>Mode démo</strong> — Configurez l'URL Google Apps Script dans <code>src/config/emailjs.js</code> pour activer l'envoi réel.</span>
          </div>
        )}
      </section>

      {/* FORM */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <form
          onSubmit={handleSubmit}
          style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}
        >
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '0 20px',
            }}
          >
            {/* Nom et prénom */}
            <div className="form-group">
              <label className="form-label" htmlFor="name">Nom et prénom *</label>
              <input className="form-input" type="text" id="name" name="name" placeholder="Jean Dupont" value={formData.name} onChange={handleChange} required />
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email *</label>
              <input className="form-input" type="email" id="email" name="email" placeholder="jean@exemple.com" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Téléphone */}
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Numéro de téléphone</label>
              <input className="form-input" type="tel" id="phone" name="phone" placeholder="06 12 34 56 78" value={formData.phone} onChange={handleChange} />
            </div>

            {/* Type d'événement */}
            <div className="form-group">
              <label className="form-label" htmlFor="eventType">Type d'événement</label>
              <select className="form-select" id="eventType" name="eventType" value={formData.eventType} onChange={handleChange}>
                <option value="">Sélectionnez...</option>
                {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            {/* Date avec calendrier dropdown */}
            <div className="form-group" style={{ position: 'relative', gridColumn: '1 / -1' }} ref={dateFieldRef}>
              <label className="form-label" htmlFor="date">Date de l'événement *</label>
              <button
                type="button"
                id="date"
                onClick={() => setCalendarOpen(o => !o)}
                className="form-input"
                style={{
                  textAlign: 'left',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '8px',
                  color: formData.date ? 'var(--text-main)' : 'var(--text-light)',
                }}
              >
                <span>{formData.date ? formatDateFR(formData.date) : 'Choisir une date...'}</span>
                <Calendar size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
              </button>

              <AnimatePresence>
                {calendarOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    style={{
                      position: 'absolute',
                      top: 'calc(100% + 4px)',
                      left: 0,
                      right: 0,
                      zIndex: 50,
                      background: '#ffffff',
                      borderRadius: 'var(--radius-lg)',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 20px 50px rgba(15, 23, 42, 0.18)',
                      overflow: 'hidden',
                    }}
                  >
                    {/* Month nav */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                      <button type="button" onClick={prevMonth} style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#0f172a' }}>
                        <ChevronLeft size={16} />
                      </button>
                      <span style={{ fontWeight: 700, fontSize: '14px', textTransform: 'capitalize', color: '#0f172a' }}>{monthLabel}</span>
                      <button type="button" onClick={nextMonth} style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#0f172a' }}>
                        <ChevronRight size={16} />
                      </button>
                    </div>

                    {/* Legend */}
                    <div style={{ display: 'flex', gap: '14px', padding: '8px 16px', fontSize: '11px', color: '#64748b', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} /> Disponible
                      </span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#fee2e2', border: '1px solid #fca5a5', display: 'inline-block' }} /> Complet
                      </span>
                    </div>

                    <div style={{ position: 'relative', minHeight: '240px', background: '#ffffff' }}>
                      {loadingSlots && (
                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(255,255,255,0.85)', backdropFilter: 'blur(6px)', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                          <Loader2 size={20} style={{ color: 'var(--primary)', animation: 'spin 1s linear infinite' }} />
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)' }}>Chargement...</span>
                        </div>
                      )}

                      {/* Day headers */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '10px 10px 4px' }}>
                        {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
                          <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#94a3b8', padding: '4px' }}>{d}</div>
                        ))}
                      </div>

                      {/* Days */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '4px 10px 14px', gap: '4px' }}>
                        {calendarDays.map((day, i) => {
                          if (!day) return <div key={`empty-${i}`} />;
                          const isSelected = formData.date === day.dateStr;
                          const isDisabled = day.isPast || day.isFullyBooked;
                          return (
                            <button
                              type="button"
                              key={day.dateStr}
                              disabled={isDisabled}
                              onClick={() => selectDate(day.dateStr)}
                              style={{
                                width: '100%', aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                fontSize: '13px', fontWeight: isSelected ? 700 : 500,
                                background: isSelected ? 'var(--primary)' : day.isFullyBooked ? '#fee2e2' : 'transparent',
                                color: isSelected ? '#fff' : day.isFullyBooked ? '#ef4444' : day.isPast ? '#cbd5e1' : '#0f172a',
                                opacity: day.isPast ? 0.5 : 1,
                                cursor: isDisabled ? 'not-allowed' : 'pointer',
                                transition: 'all 0.2s',
                                border: day.isFullyBooked ? '1px solid #fca5a5' : 'none',
                                border: day.isFullyBooked ? '1px solid #fca5a5' : 'none',
                              }}
                            >
                              {day.day}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Adresse */}
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label" htmlFor="location">Adresse de l'événement</label>
              <input className="form-input" type="text" id="location" name="location" placeholder="Salle des fêtes, Le Havre" value={formData.location} onChange={handleChange} />
            </div>

            {/* Préférence de contact */}
            <div className="form-group">
              <label className="form-label" htmlFor="contactPreference">Comment préférez-vous être contacté ?</label>
              <select className="form-select" id="contactPreference" name="contactPreference" value={formData.contactPreference} onChange={handleChange}>
                <option value="">Sélectionnez...</option>
                {CONTACT_PREFERENCES.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            {/* Source */}
            <div className="form-group">
              <label className="form-label" htmlFor="referralSource">Comment nous avez-vous connu ?</label>
              <select className="form-select" id="referralSource" name="referralSource" value={formData.referralSource} onChange={handleChange}>
                <option value="">Sélectionnez...</option>
                {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {error && (
            <div style={{ marginTop: '8px', marginBottom: '16px', padding: '14px 18px', background: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{ width: '100%', marginTop: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
          >
            {loading ? (
              <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Envoi en cours...</>
            ) : (
              <><Send size={18} /> Envoyer ma demande</>
            )}
          </button>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Réponse sous 24h
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarCheck size={12} /> Devis gratuit & sans engagement
            </span>
          </div>
        </form>
      </section>

      {/* CONTACT INFO */}
      <section className="container" style={{ padding: '16px 20px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <EditableBlock
            label="Contact Téléphone"
            modalTitle="Modifier le Téléphone"
            fields={[{ key: 'phone', label: 'Numéro', type: 'text', value: content.contact?.phone || '06 03 16 36 21' }]}
            onSave={(vals) => updateContent({ ...content, contact: { ...content.contact, ...vals } })}
          >
            <div className="contact-info-card">
              <div className="contact-info-icon"><Phone size={20} /></div>
              <div><h3>Téléphone</h3><p>{content.contact?.phone || '06 03 16 36 21'}</p></div>
            </div>
          </EditableBlock>

          <EditableBlock
            label="Contact Email"
            modalTitle="Modifier l'Email"
            fields={[{ key: 'email', label: 'Email', type: 'text', value: content.contact?.email || 'contact@photoroots.fr' }]}
            onSave={(vals) => updateContent({ ...content, contact: { ...content.contact, ...vals } })}
          >
            <div className="contact-info-card">
              <div className="contact-info-icon"><Mail size={20} /></div>
              <div><h3>Email</h3><p>{content.contact?.email || 'contact@photoroots.fr'}</p></div>
            </div>
          </EditableBlock>

          <EditableBlock
            label="Contact Zone"
            modalTitle="Modifier la Zone"
            fields={[{ key: 'zone', label: 'Zone Géographique', type: 'text', value: content.contact?.zone || 'Le Havre, Rouen, Dieppe — Seine-Maritime' }]}
            onSave={(vals) => updateContent({ ...content, contact: { ...content.contact, ...vals } })}
          >
            <div className="contact-info-card">
              <div className="contact-info-icon"><MapPin size={20} /></div>
              <div><h3>Zone</h3><p>{content.contact?.zone || 'Le Havre, Rouen, Dieppe — Seine-Maritime'}</p></div>
            </div>
          </EditableBlock>
        </div>
      </section>
    </div>
  );
};

export default Contact;
