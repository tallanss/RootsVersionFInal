import { useState, useMemo, useEffect, useRef, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';
import {
  Mail, Phone, MapPin, CheckCircle2, Send, ChevronRight, ChevronLeft,
  Calendar, CalendarCheck, Loader2, AlertCircle, Users, Heart, Cake,
  Briefcase, Sparkles, Gift, PartyPopper, MoreHorizontal, MessageCircle,
} from 'lucide-react';
import { processBooking, formatDateFR, fetchBusySlots, invalidateBusySlotsCache } from '../services/emailService';
import { isConfigured } from '../config/emailjs';
import { formatPrice } from '../utils/galleryFormat';
const Confetti = lazy(() => import('../components/Confetti'));
import { Helmet } from 'react-helmet-async';
import EditableBlock from '../components/admin/EditableBlock';

import { useContent } from '../context/ContentContext';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s()./-]{7,20}$/;

const CONTACT_PREFERENCES = ['Par email', 'Par téléphone', 'Par SMS', 'WhatsApp', 'Peu importe'];
const REFERRAL_SOURCES = ['Google', 'Bouche à oreille', 'Réseaux sociaux (Instagram, Facebook…)', 'Salle de réception', 'Wedding planner', 'Autre'];

// Icône associée à chaque type d'événement (fallback : PartyPopper)
const EVENT_ICONS = {
  Mariage: Heart,
  Anniversaire: Cake,
  Entreprise: Briefcase,
  Baptême: Sparkles,
  'EVJF/EVG': Gift,
  Séminaire: Users,
  Autre: MoreHorizontal,
};

const STEPS = [
  { n: 1, label: 'Coordonnées' },
  { n: 2, label: 'Événement' },
];

// Extrait le nombre de tirages depuis les fonctionnalités d'une formule CMS
// Nombre de tirages affiché à côté de chaque pack dans le formulaire de devis.
// Correspondance explicite par nom de pack (insensible à la casse/accents),
// avec extraction automatique en repli pour un pack inconnu.
const TIRAGES_BY_NAME = {
  'starter': '100% digital',
  'essentiel': '100% digital',
  'prestige': '200 tirages',
  'excellence': '400 tirages',
};

const normalizeName = (s) =>
  String(s || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

const extractTirages = (plan) => {
  // 1) Correspondance explicite par nom
  const override = TIRAGES_BY_NAME[normalizeName(plan?.name)];
  if (override) return override;
  // 2) Repli : extraction depuis les fonctionnalités
  const feats = plan?.features || [];
  const f = feats.find((x) => /impression|tirage|photo/i.test(String(x)));
  if (!f) return null;
  if (/illimit/i.test(f)) return 'Tirages illimités';
  const m = String(f).match(/\d+/);
  return m ? `${m[0]} tirages` : null;
};

const Contact = () => {
  const { content, updateContent } = useContent();
  const location = useLocation();

  const eventTypes = content.formOptions?.eventTypes || ['Mariage', 'Anniversaire', 'Entreprise', 'Baptême', 'EVJF/EVG', 'Autre'];

  // Mode initial depuis l'URL : /contact?mode=message ouvre le message rapide
  const initialMode = new URLSearchParams(location.search).get('mode') === 'message' ? 'message' : 'devis';
  const [mode, setMode] = useState(initialMode); // 'devis' | 'message'
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = backward
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [submittedMode, setSubmittedMode] = useState('devis');
  const [busySlots, setBusySlots] = useState([]);

  // Formulaire "message rapide" (nom, email, message uniquement)
  const [msg, setMsg] = useState({ name: '', email: '', message: '' });

  const phoneRaw = (content.contact?.phone || '06 03 16 36 21').replace(/\s/g, '');
  const phoneDisplay = content.contact?.phone || '06 03 16 36 21';

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
    guests: '',
    formula: '',
    contactPreference: '',
    referralSource: '',
  });

  // Formules disponibles (depuis le CMS, avec fallback) — incluent prix + desc
  const formulaOptions = useMemo(() => {
    if (content.pricing_plans?.length > 0) {
      return content.pricing_plans.map(p => ({
        name: p.name,
        price: formatPrice(p.price),
        tirages: extractTirages(p),
        featured: !!p.featured,
      }));
    }
    return [
      { name: 'Starter', price: '99€', tirages: '100% digital' },
      { name: 'Essentiel', price: '189€', tirages: '100% digital' },
      { name: 'Prestige', price: '249€', tirages: '200 tirages', featured: true },
      { name: 'Excellence', price: '389€', tirages: '400 tirages' },
    ];
  }, [content.pricing_plans]);

  // Synchroniser le mode avec le paramètre d'URL (?mode=message)
  useEffect(() => {
    const m = new URLSearchParams(location.search).get('mode');
    if (m === 'message') setMode('message');
    else if (m === 'devis') setMode('devis');
  }, [location.search]);

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

  // Click outside or Escape closes calendar
  useEffect(() => {
    if (!calendarOpen) return;
    const handler = (e) => {
      if (dateFieldRef.current && !dateFieldRef.current.contains(e.target)) {
        setCalendarOpen(false);
      }
    };
    const keyHandler = (e) => {
      if (e.key === 'Escape') setCalendarOpen(false);
    };
    document.addEventListener('mousedown', handler);
    document.addEventListener('keydown', keyHandler);
    return () => {
      document.removeEventListener('mousedown', handler);
      document.removeEventListener('keydown', keyHandler);
    };
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
  const setField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));

  const selectDate = (dateStr) => {
    setField('date', dateStr);
    setCalendarOpen(false);
  };

  // ===== Navigation entre étapes =====
  const goTo = (target, dir) => {
    setError(null);
    setDirection(dir);
    setStep(target);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goNext = () => {
    if (step === 1) {
      if (!formData.name.trim()) { setError('Veuillez saisir vos nom et prénom.'); return; }
      if (!EMAIL_REGEX.test(formData.email)) { setError('Veuillez saisir une adresse email valide.'); return; }
      if (formData.phone && !PHONE_REGEX.test(formData.phone)) { setError('Numéro de téléphone invalide.'); return; }
    }
    goTo(Math.min(2, step + 1), 1);
  };

  const goBack = () => goTo(Math.max(1, step - 1), -1);

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!formData.name.trim()) { setError('Veuillez saisir vos nom et prénom.'); return; }
    if (!EMAIL_REGEX.test(formData.email)) { setError('Veuillez saisir une adresse email valide.'); return; }
    if (formData.phone && !PHONE_REGEX.test(formData.phone)) { setError('Numéro de téléphone invalide.'); return; }
    if (!formData.date) { setError('Veuillez sélectionner une date pour votre événement.'); return; }
    if (!formData.location.trim()) { setError('Veuillez indiquer le lieu de votre événement.'); return; }

    // Rate limiting: 1 soumission par 30s
    const lastSubmit = sessionStorage.getItem('pr_last_submit');
    if (lastSubmit && Date.now() - Number(lastSubmit) < 30000) {
      setError('Veuillez patienter quelques secondes avant de renvoyer.');
      return;
    }
    sessionStorage.setItem('pr_last_submit', String(Date.now()));
    setLoading(true);

    const autoMessage = [
      formData.guests ? `Nombre d'invités : ${formData.guests}` : null,
      formData.formula ? `Pack souhaité : ${formData.formula}` : null,
      formData.contactPreference ? `Contact préféré : ${formData.contactPreference}` : null,
      formData.referralSource ? `Connu via : ${formData.referralSource}` : null,
    ].filter(Boolean).join('\n');

    const booking = {
      date: formData.date,
      formula: formData.formula || 'Demande de devis',
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      eventType: formData.eventType,
      location: formData.location,
      guests: formData.guests,
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
        guests: formData.guests,
        formula: formData.formula || 'Demande de devis',
        fullMessage: autoMessage,
        contactPreference: formData.contactPreference,
        referralSource: formData.referralSource,
        status: 'Nouveau',
        createdAt: new Date().toISOString(),
      };
      const newMessages = [newMessage, ...(content.messages || [])];
      updateContent({ messages: newMessages });

      setResult(res);
      setSubmittedMode('devis');
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setError(res.error || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  // ===== Soumission du "message rapide" =====
  const handleMessageSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!msg.name.trim()) { setError('Veuillez saisir vos nom et prénom.'); return; }
    if (!EMAIL_REGEX.test(msg.email)) { setError('Veuillez saisir une adresse email valide.'); return; }
    if (!msg.message.trim()) { setError('Veuillez écrire votre message.'); return; }

    const lastSubmit = sessionStorage.getItem('pr_last_submit');
    if (lastSubmit && Date.now() - Number(lastSubmit) < 30000) {
      setError('Veuillez patienter quelques secondes avant de renvoyer.');
      return;
    }
    sessionStorage.setItem('pr_last_submit', String(Date.now()));
    setLoading(true);

    const payload = {
      type: 'message',
      name: msg.name,
      email: msg.email,
      message: msg.message,
      formula: 'Message',
    };

    const res = await processBooking(payload);
    setLoading(false);

    if (res.success) {
      const newMessage = {
        id: Date.now(),
        name: msg.name,
        email: msg.email,
        phone: '',
        date: '',
        subject: 'Message',
        formula: 'Message',
        fullMessage: msg.message,
        status: 'Nouveau',
        createdAt: new Date().toISOString(),
      };
      updateContent({ messages: [newMessage, ...(content.messages || [])] });

      setResult(res);
      setSubmittedMode('message');
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
        <Suspense fallback={null}><Confetti active={submitted} /></Suspense>
        <Helmet>
          <title>Demande envoyée | PhotoRoots</title>
        </Helmet>
        <section className="container" style={{ padding: '32px 24px' }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ textAlign: 'center', padding: '36px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
              style={{ width: '76px', height: '76px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 0 8px var(--accent-glow)' }}
            >
              <CheckCircle2 size={38} />
            </motion.div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>
              {submittedMode === 'message' ? 'Merci, votre message est bien reçu !' : 'Merci, votre demande est bien reçue !'}
            </h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {submittedMode === 'message' ? (
                <>Nous revenons vers vous très vite à <strong>{msg.email}</strong>.</>
              ) : result?.isDemo ? (
                <>Mode démo — en production, nous reviendrons vers vous sous 24h à <strong>{formData.email}</strong>.</>
              ) : (
                <>Nous revenons vers vous sous 24h à <strong>{formData.email}</strong> avec un devis personnalisé.</>
              )}
            </p>

            {submittedMode === 'devis' && (
              <div style={{ background: 'var(--bg-secondary)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', textAlign: 'left', marginBottom: '24px' }}>
                <SummaryRow label="Date envisagée" value={formatDateFR(formData.date)} border />
                {formData.eventType && <SummaryRow label="Événement" value={formData.eventType} border />}
                {formData.formula && <SummaryRow label="Formule" value={formData.formula} border={!!formData.location || !!formData.guests} />}
                {formData.guests && <SummaryRow label="Invités" value={`${formData.guests} personnes`} border={!!formData.location} />}
                {formData.location && <SummaryRow label="Lieu" value={formData.location} />}
              </div>
            )}

            <Link to="/">
              <button className="btn-primary" style={{ width: '100%' }}>Retour à l'accueil</button>
            </Link>
          </motion.div>
        </section>
      </div>
    );
  }

  // ===== Récap (pills) — rappelle les infos saisies à l'étape 1 =====
  const recapPills = [
    formData.name.trim() && { icon: CheckCircle2, text: formData.name.trim() },
    formData.email.trim() && { icon: Mail, text: formData.email.trim() },
  ].filter(Boolean);

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
      <section className="container" style={{ padding: '32px 20px 8px' }}>
        <div className="section-tag"><MessageCircle size={14} /> Devis gratuit</div>
        <EditableBlock
          label="Header Contact"
          modalTitle="Modifier le Titre"
          fields={[
            { key: 'title', label: 'Titre', type: 'text', value: content.contactPage?.title || 'Demande de devis' },
            { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: content.contactPage?.subtitle || 'Quelques infos sur votre événement et nous revenons vers vous sous 24h avec une proposition personnalisée.' },
          ]}
          onSave={(vals) => updateContent({ contactPage: { ...content.contactPage, ...vals } })}
        >
          <h1 className="section-title" style={{ fontSize: '28px' }}>{content.contactPage?.title || 'Demande de devis'}</h1>
          <p className="section-subtitle" style={{ marginBottom: '16px' }}>
            {content.contactPage?.subtitle || 'Quelques infos sur votre événement et nous revenons vers vous sous 24h avec une proposition personnalisée.'}
          </p>
        </EditableBlock>

        {/* Sélecteur de mode + appel direct */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'inline-flex', background: 'var(--bg-secondary)', borderRadius: '999px', padding: '4px', border: '1px solid var(--border-light)' }}>
            {[
              { id: 'devis', label: 'Demande de devis' },
              { id: 'message', label: 'Message rapide' },
            ].map(opt => {
              const active = mode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => { setMode(opt.id); setError(null); }}
                  style={{
                    border: 'none', cursor: 'pointer', borderRadius: '999px',
                    padding: '8px 16px', fontSize: '13px', fontWeight: active ? 700 : 600,
                    background: active ? 'var(--primary)' : 'transparent',
                    color: active ? '#fff' : 'var(--text-muted)',
                    transition: 'all 0.2s',
                  }}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          <a
            href={`tel:${phoneRaw}`}
            aria-label="Nous appeler"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '9px 16px', borderRadius: '999px', textDecoration: 'none',
              background: 'var(--bg-app)', border: '1.5px solid var(--primary)',
              color: 'var(--primary)', fontWeight: 700, fontSize: '13px',
            }}
          >
            <Phone size={15} /> Appelez-nous
          </a>
        </div>
      </section>

      {/* STEPPER (mode devis uniquement) */}
      {mode === 'devis' && (
      <section className="container" style={{ padding: '0 20px 8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', maxWidth: '460px', margin: '0 auto 4px' }}>
          {STEPS.map((s, i) => {
            const isDone = step > s.n;
            const isActive = step === s.n;
            return (
              <div key={s.n} style={{ display: 'flex', alignItems: 'center', flex: i < STEPS.length - 1 ? 1 : '0 0 auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                  <motion.div
                    animate={{
                      backgroundColor: isActive || isDone ? 'var(--primary)' : 'var(--bg-secondary)',
                      color: isActive || isDone ? '#fff' : 'var(--text-light)',
                      scale: isActive ? 1.1 : 1,
                    }}
                    transition={{ duration: 0.25 }}
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '13px', fontWeight: 800, flexShrink: 0,
                      boxShadow: isActive ? '0 0 0 4px var(--accent-glow)' : 'none',
                      border: isActive || isDone ? 'none' : '1px solid var(--border-light)',
                    }}
                  >
                    {isDone ? <CheckCircle2 size={16} /> : s.n}
                  </motion.div>
                  <span style={{ fontSize: '11px', fontWeight: isActive ? 700 : 500, color: isActive ? 'var(--primary)' : 'var(--text-light)', whiteSpace: 'nowrap' }}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div style={{ flex: 1, height: '2px', margin: '0 8px', background: 'var(--border-light)', position: 'relative', top: '-10px', borderRadius: '2px', overflow: 'hidden' }}>
                    <motion.div
                      initial={false}
                      animate={{ width: step > s.n ? '100%' : '0%' }}
                      transition={{ duration: 0.3 }}
                      style={{ height: '100%', background: 'var(--primary)' }}
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>
      )}

      {/* RECAP PILLS */}
      {mode === 'devis' && recapPills.length > 0 && step > 1 && (
        <section className="container" style={{ padding: '4px 20px 0' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', justifyContent: 'center' }}>
            {recapPills.map((p, i) => {
              const Icon = p.icon;
              return (
                <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '5px 11px', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)', borderRadius: '999px', fontSize: '12px', fontWeight: 600, color: 'var(--text-main)' }}>
                  <Icon size={12} style={{ color: 'var(--primary)' }} /> {p.text}
                </span>
              );
            })}
          </div>
        </section>
      )}

      {/* ============ FORMULAIRE MESSAGE RAPIDE ============ */}
      {mode === 'message' && (
        <section className="container" style={{ padding: '16px 20px 24px' }}>
          <form
            onSubmit={handleMessageSubmit}
            style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}
          >
            <div style={{ marginBottom: '16px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 4px' }}>Envoyez-nous un message</h2>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>Une simple question ? Écrivez-nous, on vous répond vite.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 18px' }}>
              <div className="form-group">
                <label className="form-label" htmlFor="msgName">Nom et prénom *</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type="text" id="msgName" placeholder="Jean Dupont" value={msg.name} onChange={(e) => setMsg({ ...msg, name: e.target.value })} required style={{ paddingRight: '38px' }} />
                  <ValidCheck show={msg.name.trim().length >= 2} />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="msgEmail">Email *</label>
                <div style={{ position: 'relative' }}>
                  <input className="form-input" type="email" id="msgEmail" placeholder="jean@exemple.com" value={msg.email} onChange={(e) => setMsg({ ...msg, email: e.target.value })} required style={{ paddingRight: '38px' }} />
                  <ValidCheck show={EMAIL_REGEX.test(msg.email)} />
                </div>
                {msg.email.length > 0 && !EMAIL_REGEX.test(msg.email) && <FieldHint>Adresse email invalide</FieldHint>}
              </div>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="msgBody">Votre message *</label>
              <div style={{ position: 'relative' }}>
                <textarea className="form-textarea" id="msgBody" rows={5} placeholder="Bonjour, j'aimerais savoir..." value={msg.message} onChange={(e) => setMsg({ ...msg, message: e.target.value })} required style={{ paddingRight: '38px' }} />
                {msg.message.trim().length >= 5 && (
                  <CheckCircle2 size={16} style={{ position: 'absolute', right: '12px', top: '14px', color: '#22c55e', pointerEvents: 'none' }} />
                )}
              </div>
            </div>

            {error && (
              <div style={{ marginTop: '4px', marginBottom: '12px', padding: '14px 18px', background: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertCircle size={16} /> {error}
              </div>
            )}

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {loading ? (
                <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Envoi en cours...</>
              ) : (
                <><Send size={18} /> Envoyer mon message</>
              )}
            </button>

            <p style={{ textAlign: 'center', marginTop: '14px', fontSize: '13px', color: 'var(--text-muted)' }}>
              Ou appelez-nous directement au{' '}
              <a href={`tel:${phoneRaw}`} style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>{phoneDisplay}</a>
            </p>
          </form>
        </section>
      )}

      {/* ============ FORMULAIRE DEVIS (3 ÉTAPES) ============ */}
      {mode === 'devis' && (
      <section className="container" style={{ padding: '16px 20px 24px' }}>
        {!isConfigured() && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '16px', fontSize: '13px', color: 'var(--primary)', lineHeight: 1.5 }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span><strong>Mode démo</strong> — Configurez l'URL Google Apps Script dans <code>src/config/emailjs.js</code> pour activer l'envoi réel.</span>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}
        >
          <AnimatePresence mode="wait" custom={direction}>
            {/* ============ STEP 1 — COORDONNÉES ============ */}
            {step === 1 && (
              <motion.div
                key="step1"
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <StepHeading n={1} title="Vos coordonnées" subtitle="Pour pouvoir vous envoyer votre devis personnalisé." />

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0 18px' }}>
                  <div className="form-group">
                    <label className="form-label" htmlFor="name">Nom et prénom *</label>
                    <div style={{ position: 'relative' }}>
                      <input className="form-input" type="text" id="name" name="name" placeholder="Jean Dupont" value={formData.name} onChange={handleChange} required style={{ paddingRight: '38px' }} />
                      <ValidCheck show={formData.name.trim().length >= 2} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Adresse email *</label>
                    <div style={{ position: 'relative' }}>
                      <input className="form-input" type="email" id="email" name="email" placeholder="jean@exemple.com" value={formData.email} onChange={handleChange} required style={{ paddingRight: '38px' }} />
                      <ValidCheck show={EMAIL_REGEX.test(formData.email)} />
                    </div>
                    {formData.email.length > 0 && !EMAIL_REGEX.test(formData.email) && <FieldHint>Adresse email invalide</FieldHint>}
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label className="form-label" htmlFor="phone">Numéro de téléphone <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optionnel)</span></label>
                    <div style={{ position: 'relative' }}>
                      <input className="form-input" type="tel" id="phone" name="phone" placeholder="06 12 34 56 78" value={formData.phone} onChange={handleChange} style={{ paddingRight: '38px' }} />
                      <ValidCheck show={formData.phone.length > 0 && PHONE_REGEX.test(formData.phone)} />
                    </div>
                    {formData.phone.length > 0 && !PHONE_REGEX.test(formData.phone) && <FieldHint>Numéro invalide</FieldHint>}
                  </div>
                </div>

                {/* Préférence de contact — chips */}
                <div className="form-group">
                  <label className="form-label">Comment préférez-vous être contacté ?</label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '4px' }}>
                    {CONTACT_PREFERENCES.map((p) => {
                      const active = formData.contactPreference === p;
                      return (
                        <button
                          type="button"
                          key={p}
                          onClick={() => setField('contactPreference', active ? '' : p)}
                          style={{
                            padding: '9px 16px', borderRadius: '999px', cursor: 'pointer', fontSize: '13px',
                            fontWeight: active ? 700 : 500,
                            background: active ? 'var(--primary)' : 'var(--bg-app)',
                            color: active ? '#fff' : 'var(--text-main)',
                            border: active ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                            transition: 'all 0.2s',
                          }}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ============ STEP 2 — ÉVÉNEMENT ============ */}
            {step === 2 && (
              <motion.div
                key="step2"
                custom={direction}
                initial={{ opacity: 0, x: direction * 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -30 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
              >
                <StepHeading n={2} title="Votre événement" subtitle="Dernière étape ! Parlez-nous de l'occasion." />

                {/* Type d'événement — chips */}
                <div className="form-group">
                  <label className="form-label">Type d'événement</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: '10px', marginTop: '4px' }}>
                    {eventTypes.map((t) => {
                      const Icon = EVENT_ICONS[t] || PartyPopper;
                      const active = formData.eventType === t;
                      return (
                        <button
                          type="button"
                          key={t}
                          onClick={() => setField('eventType', active ? '' : t)}
                          style={{
                            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px',
                            padding: '14px 8px', borderRadius: 'var(--radius-md)', cursor: 'pointer',
                            background: active ? 'var(--bg-secondary)' : 'var(--bg-app)',
                            border: active ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                            boxShadow: active ? '0 0 0 3px var(--accent-glow)' : 'none',
                            color: active ? 'var(--primary)' : 'var(--text-main)',
                            transition: 'all 0.2s', fontWeight: active ? 700 : 500, fontSize: '13px',
                          }}
                        >
                          <Icon size={22} />
                          {t}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Date avec calendrier */}
                <div className="form-group" style={{ position: 'relative' }} ref={dateFieldRef}>
                  <label className="form-label" htmlFor="date">Date de l'événement *</label>
                  <button
                    type="button"
                    id="date"
                    onClick={() => setCalendarOpen(o => !o)}
                    aria-haspopup="dialog"
                    aria-expanded={calendarOpen}
                    className="form-input"
                    style={{
                      textAlign: 'left', cursor: 'pointer', display: 'flex',
                      alignItems: 'center', justifyContent: 'space-between', gap: '8px',
                      color: formData.date ? 'var(--text-main)' : 'var(--text-light)',
                    }}
                  >
                    <span>{formData.date ? formatDateFR(formData.date) : 'Choisir une date...'}</span>
                    <Calendar size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  </button>

                  <AnimatePresence initial={false}>
                    {calendarOpen && (
                      <motion.div
                        role="dialog"
                        aria-label="Choisir une date"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.22, ease: 'easeOut' }}
                        style={{
                          position: 'relative', marginTop: '8px',
                          background: '#ffffff', borderRadius: 'var(--radius-lg)', border: '1px solid #e2e8f0',
                          boxShadow: '0 10px 30px rgba(15, 23, 42, 0.12)', overflow: 'hidden',
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderBottom: '1px solid #e2e8f0', background: '#ffffff' }}>
                          <button type="button" onClick={prevMonth} style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#0f172a' }}>
                            <ChevronLeft size={16} />
                          </button>
                          <span style={{ fontWeight: 700, fontSize: '14px', textTransform: 'capitalize', color: '#0f172a' }}>{monthLabel}</span>
                          <button type="button" onClick={nextMonth} style={{ background: '#f1f5f9', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer', color: '#0f172a' }}>
                            <ChevronRight size={16} />
                          </button>
                        </div>

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

                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '10px 10px 4px' }}>
                            {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
                              <div key={d} style={{ textAlign: 'center', fontSize: '11px', fontWeight: 700, color: '#94a3b8', padding: '4px' }}>{d}</div>
                            ))}
                          </div>

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

                {/* Lieu */}
                <div className="form-group">
                  <label className="form-label" htmlFor="location">Lieu de l'événement *</label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-light)', pointerEvents: 'none' }} />
                    <input className="form-input" type="text" id="location" name="location" placeholder="Salle des fêtes, Le Havre" value={formData.location} onChange={handleChange} style={{ paddingLeft: '38px' }} required />
                  </div>
                </div>

                {/* Formule souhaitée — nom + nombre de tirages */}
                <div className="form-group">
                  <label className="form-label">Formule souhaitée <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optionnel)</span></label>
                  <div style={{ display: 'grid', gap: '8px', marginTop: '4px' }}>
                    {formulaOptions.map((f) => {
                      const active = formData.formula === f.name;
                      return (
                        <button
                          type="button"
                          key={f.name}
                          onClick={() => setField('formula', active ? '' : f.name)}
                          style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                            padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                            background: active ? 'var(--bg-secondary)' : 'var(--bg-app)',
                            border: active ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                            boxShadow: active ? '0 0 0 3px var(--accent-glow)' : 'none',
                            transition: 'all 0.2s',
                          }}
                        >
                          <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>
                            {f.name}
                            {f.featured && (
                              <span style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', background: 'var(--bg-secondary)', border: '1px solid var(--primary)', borderRadius: '999px', padding: '2px 8px' }}>★ POPULAIRE</span>
                            )}
                          </span>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            {f.tirages && <span style={{ fontSize: '13px', fontWeight: 700, color: active ? 'var(--primary)' : 'var(--text-muted)' }}>{f.tirages}</span>}
                            <span style={{
                              width: '22px', height: '22px', borderRadius: '50%', flexShrink: 0,
                              border: active ? 'none' : '2px solid var(--border-medium)',
                              background: active ? 'var(--primary)' : 'transparent',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              {active && <CheckCircle2 size={16} color="#fff" />}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                    <button
                      type="button"
                      onClick={() => setField('formula', formData.formula === 'Je ne sais pas encore' ? '' : 'Je ne sais pas encore')}
                      style={{
                        padding: '12px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'center',
                        background: formData.formula === 'Je ne sais pas encore' ? 'var(--bg-secondary)' : 'transparent',
                        border: formData.formula === 'Je ne sais pas encore' ? '2px solid var(--primary)' : '2px dashed var(--border-medium)',
                        color: formData.formula === 'Je ne sais pas encore' ? 'var(--primary)' : 'var(--text-muted)',
                        fontWeight: 600, fontSize: '14px', transition: 'all 0.2s',
                      }}
                    >
                      Je ne sais pas encore — conseillez-moi
                    </button>
                  </div>
                </div>

                {/* Source */}
                <div className="form-group">
                  <label className="form-label" htmlFor="referralSource">Comment nous avez-vous connu ? <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optionnel)</span></label>
                  <select className="form-select" id="referralSource" name="referralSource" value={formData.referralSource} onChange={handleChange}>
                    <option value="">Sélectionnez...</option>
                    {REFERRAL_SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* ERREUR */}
          {error && (
            <div style={{ marginTop: '8px', marginBottom: '12px', padding: '14px 18px', background: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          {/* NAVIGATION */}
          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            {step > 1 && (
              <button type="button" className="btn-secondary" onClick={goBack} disabled={loading} style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                <ChevronLeft size={18} /> Retour
              </button>
            )}
            {step < 2 ? (
              <button type="button" className="btn-primary" onClick={goNext} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
                Continuer <ChevronRight size={18} />
              </button>
            ) : (
              <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                {loading ? (
                  <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Envoi en cours...</>
                ) : (
                  <><Send size={18} /> Envoyer ma demande</>
                )}
              </button>
            )}
          </div>

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
      )}

      {/* CONTACT INFO */}
      <section className="container" style={{ padding: '8px 20px 48px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <EditableBlock
            label="Contact Téléphone"
            modalTitle="Modifier le Téléphone"
            fields={[{ key: 'phone', label: 'Numéro', type: 'text', value: content.contact?.phone || '06 03 16 36 21' }]}
            onSave={(vals) => updateContent({ ...content, contact: { ...content.contact, ...vals } })}
          >
            <div className="contact-info-card">
              <div className="contact-info-icon"><Phone size={20} /></div>
              <div><h3>Téléphone</h3><p><a href={`tel:${(content.contact?.phone || '06 03 16 36 21').replace(/\s/g, '')}`} style={{ color: 'inherit', textDecoration: 'none' }}>{content.contact?.phone || '06 03 16 36 21'}</a></p></div>
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
              <div><h3>Email</h3><p><a href={`mailto:${content.contact?.email || 'contact@photoroots.fr'}`} style={{ color: 'inherit', textDecoration: 'none' }}>{content.contact?.email || 'contact@photoroots.fr'}</a></p></div>
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
              <div><h3>Zone</h3><p><a href="https://www.google.com/search?q=photoroots" target="_blank" rel="noopener noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{content.contact?.zone || 'Le Havre, Rouen, Dieppe — Seine-Maritime'}</a></p></div>
            </div>
          </EditableBlock>
        </div>
      </section>
    </div>
  );
};

// ===== Feedback de validation inline =====
// Coche verte positionnée en absolu à droite de l'input (le wrapper doit être position:relative)
const ValidCheck = ({ show, right = '12px' }) =>
  show ? (
    <CheckCircle2
      size={16}
      style={{ position: 'absolute', right, top: '50%', transform: 'translateY(-50%)', color: '#22c55e', pointerEvents: 'none' }}
    />
  ) : null;

// Petit indice rouge sous le champ
const FieldHint = ({ children }) => (
  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#b91c1c' }}>{children}</p>
);

// ===== Petits composants de présentation =====
const StepHeading = ({ n, title, subtitle }) => (
  <div style={{ marginBottom: '20px' }}>
    <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
      Étape {n} sur 3
    </span>
    <h2 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: '4px 0 4px' }}>{title}</h2>
    {subtitle && <p style={{ fontSize: '13px', color: 'var(--text-muted)', lineHeight: 1.5, margin: 0 }}>{subtitle}</p>}
  </div>
);

const SummaryRow = ({ label, value, border }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', padding: '10px 0', borderBottom: border ? '1px solid var(--border-light)' : 'none' }}>
    <span style={{ fontSize: '14px', color: 'var(--text-muted)', flexShrink: 0 }}>{label}</span>
    <span style={{ fontSize: '14px', fontWeight: 700, textAlign: 'right' }}>{value}</span>
  </div>
);

export default Contact;
