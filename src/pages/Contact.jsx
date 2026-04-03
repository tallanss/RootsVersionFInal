import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, CheckCircle2, Send, ChevronRight, ChevronLeft, Calendar, CalendarCheck, Loader2, Sun, Moon, AlertCircle, Lock } from 'lucide-react';
import { processBooking, formatDateFR, fetchBusySlots, invalidateBusySlotsCache } from '../services/emailService';
import { isConfigured } from '../config/emailjs';
import Confetti from '../components/Confetti';
import { Helmet } from 'react-helmet-async';
import EditableBlock from '../components/admin/EditableBlock';

import { useContent } from '../context/ContentContext';

const SLOT_LABELS = {
  afternoon: { label: 'Après-midi', time: '14h — 18h', icon: Sun },
  evening: { label: 'Soirée', time: '19h — 23h', icon: Moon },
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_REGEX = /^[+\d\s()./-]{7,20}$/;

const Contact = () => {
  const { content, updateContent } = useContent();

  const FORMULAS = useMemo(() => {
    if (content.pricing_plans?.length > 0) {
      return content.pricing_plans.map(p => ({
        id: p.id,
        name: p.name,
        price: p.isCustom ? p.price : `${p.price}€`,
        desc: p.desc
      }));
    }
    return [
      { id: 'essentiel', name: 'Essentiel', price: '189€', desc: 'Photos illimitées' },
      { id: 'premium', name: 'Premium', price: '289€', desc: 'Impressions illimitées incluses' },
      { id: 'excellence', name: 'Excellence', price: '389€', desc: 'Branding & technicien dédié' },
      { id: 'sur-mesure', name: 'Sur-Mesure', price: 'Sur devis', desc: 'Prestation sur mesure' },
    ];
  }, [content.pricing_plans]);

  const eventTypes = content.formOptions?.eventTypes || ['Mariage', 'Anniversaire', 'Entreprise', 'Baptême', 'Autre'];
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedFormula, setSelectedFormula] = useState('premium');
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(true);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);
  const [busySlots, setBusySlots] = useState([]);
  const [formData, setFormData] = useState({
    name: '', email: '', phone: '', eventType: '', message: ''
  });

  // Charger les dates occupées au montage + fusionner avec blockedDates du CMS
  useEffect(() => {
    const loadBusySlots = async () => {
      setLoadingSlots(true);
      const slots = await fetchBusySlots();
      // Convertir les dates bloquées CMS en slots (bloquer les deux créneaux)
      const cmsBlocked = (content.blockedDates || []).flatMap(d => [
        `${d}_afternoon`,
        `${d}_evening`,
      ]);
      setBusySlots([...new Set([...slots, ...cmsBlocked])]);
      setLoadingSlots(false);
    };
    loadBusySlots();
  }, [content.blockedDates]);

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

      // Vérifier si les deux créneaux sont occupés
      const afternoonBusy = busySlots.includes(`${dateStr}_afternoon`);
      const eveningBusy = busySlots.includes(`${dateStr}_evening`);
      const isFullyBooked = afternoonBusy && eveningBusy;

      days.push({ day: d, date, isPast, dateStr, isFullyBooked, afternoonBusy, eveningBusy });
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

  // Quand une date est sélectionnée, vérifier les créneaux dispo
  const selectedDayInfo = useMemo(() => {
    if (!selectedDate) return null;
    return calendarDays.find(d => d && d.dateStr === selectedDate);
  }, [selectedDate, calendarDays]);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    // Validation explicite
    if (!formData.name.trim()) { setError('Veuillez saisir votre nom.'); return; }
    if (!EMAIL_REGEX.test(formData.email)) { setError('Veuillez saisir une adresse email valide.'); return; }
    if (formData.phone && !PHONE_REGEX.test(formData.phone)) { setError('Numéro de téléphone invalide.'); return; }

    // Rate limiting: 1 soumission par 30s
    const lastSubmit = sessionStorage.getItem('pr_last_submit');
    if (lastSubmit && Date.now() - Number(lastSubmit) < 30000) {
      setError('Veuillez patienter quelques secondes avant de renvoyer.');
      return;
    }
    sessionStorage.setItem('pr_last_submit', String(Date.now()));
    setLoading(true);
    setError(null);

    const booking = {
      date: selectedDate,
      slot: selectedSlot,
      formula: FORMULAS.find(f => f.id === selectedFormula)?.name || selectedFormula,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      eventType: formData.eventType,
      message: formData.message,
    };

    const res = await processBooking(booking);

    setLoading(false);
    if (res.success) {
      invalidateBusySlotsCache();
      // Sync with CMS Messages Center
      const newMessage = {
        id: Date.now(),
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        date: formatDateFR(selectedDate),
        subject: `${formData.eventType} (${SLOT_LABELS[selectedSlot]?.label})`,
        formula: booking.formula,
        fullMessage: formData.message,
        status: "Nouveau",
        createdAt: new Date().toISOString()
      };
      
      const newMessages = [newMessage, ...(content.messages || [])];
      updateContent({ messages: newMessages });
      
      setResult(res);
      setStep(4);
    } else {
      setError(res.error || 'Une erreur est survenue. Veuillez réessayer.');
    }
  };

  const canProceedStep1 = selectedDate && selectedSlot;
  const canProceedStep2 = formData.name.trim() && EMAIL_REGEX.test(formData.email) && formData.eventType;

  // ===== STEP 4: SUCCESS =====
  if (step === 4) {
    return (
      <div className="animate-in">
        <Confetti active={step === 4} />
        <section className="container" style={{ padding: '32px 24px' }}>
          <div style={{ textAlign: 'center', padding: '24px 24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}>
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px' }}>
              <CalendarCheck size={36} />
            </div>
            <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '8px', color: 'var(--text-main)' }}>Réservation confirmée !</h1>
            <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '24px' }}>
              {result?.isDemo ? (
                <>Mode démo — en production, un email de confirmation sera envoyé à <strong>{formData.email}</strong> et l'événement sera ajouté automatiquement à notre calendrier.</>
              ) : (
                <>Un email de confirmation a été envoyé à <strong>{formData.email}</strong>. L'événement a été ajouté à notre calendrier.</>
              )}
            </p>

            {/* Récap */}
            <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '20px', border: '1px solid var(--border-light)', textAlign: 'left', marginBottom: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Date</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{formatDateFR(selectedDate)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Créneau</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{SLOT_LABELS[selectedSlot]?.label} ({SLOT_LABELS[selectedSlot]?.time})</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Formule</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{FORMULAS.find(f => f.id === selectedFormula)?.name}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>Événement</span>
                <span style={{ fontSize: '14px', fontWeight: 700 }}>{formData.eventType}</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '14px', color: 'var(--primary)', fontWeight: 600 }}>
              <CalendarCheck size={16} />
              Événement ajouté automatiquement à notre calendrier
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
        <title>Réserver un Photobooth | Devis gratuit Le Havre, Rouen</title>
        <meta name="description" content="Réservez votre borne photo pour votre événement en Seine-Maritime. Vérifiez nos disponibilités et obtenez un devis gratuit en 24h." />
        <meta name="keywords" content="réservation photobooth normandie, louer borne photo le havre, calendrier photobooth rouen" />
      </Helmet>

      {/* HEADER */}
      <section className="container" style={{ padding: '32px 20px 16px' }}>
        <div className="section-tag"><Calendar size={14} /> Réservation</div>
        <EditableBlock
          label="Header Contact"
          modalTitle="Modifier le Titre"
          fields={[
            { key: 'title', label: 'Titre', type: 'text', value: content.contactPage?.title || "Réservez votre photobooth" },
            { key: 'subtitle', label: 'Sous-titre', type: 'textarea', value: content.contactPage?.subtitle || "Choisissez votre date, votre créneau et recevez une confirmation instantanée par email." },
          ]}
          onSave={(vals) => updateContent({ contactPage: { ...content.contactPage, ...vals } })}
        >
          <h1 className="section-title" style={{ fontSize: '28px' }}>{content.contactPage?.title || "Réservez votre photobooth"}</h1>
          <p className="section-subtitle" style={{ marginBottom: '20px' }}>
            {content.contactPage?.subtitle || "Choisissez votre date, votre créneau et recevez une confirmation instantanée par email."}
          </p>
        </EditableBlock>

        {/* Progress bar */}
        <div style={{ display: 'flex', gap: '4px', marginBottom: step > 1 ? '16px' : '28px' }}>
          {[1, 2, 3].map(s => (
            <div key={s} style={{
              flex: 1, height: '4px', borderRadius: '2px',
              background: s <= step ? 'var(--primary)' : 'var(--border-light)',
              transition: 'background 0.3s'
            }} />
          ))}
        </div>

        {/* Récapitulatif de la sélection — visible dès l'étape 2 */}
        {step > 1 && step < 4 && (
          <div style={{
            display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '6px',
            padding: '12px 16px', marginBottom: '20px',
            background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-light)',
            fontSize: '13px', fontWeight: 600,
          }}>
            <span style={{ color: 'var(--primary)', fontWeight: 800 }}>
              {formatDateFR(selectedDate)}
            </span>
            <span style={{ color: 'var(--border-medium)' }}>·</span>
            <span style={{ color: 'var(--text-main)' }}>
              {SLOT_LABELS[selectedSlot]?.label} — {SLOT_LABELS[selectedSlot]?.time}
            </span>
            <span style={{ color: 'var(--border-medium)' }}>·</span>
            <span style={{ color: 'var(--primary)' }}>
              {FORMULAS.find(f => f.id === selectedFormula)?.name}{' '}
              <span style={{ fontWeight: 700 }}>
                {FORMULAS.find(f => f.id === selectedFormula)?.price}
              </span>
            </span>
            <button
              onClick={() => setStep(1)}
              style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', fontSize: '12px', color: 'var(--text-muted)', textDecoration: 'underline', padding: 0 }}
            >
              Modifier
            </button>
          </div>
        )}

        {!isConfigured() && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '12px 16px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-light)', marginBottom: '20px', fontSize: '13px', color: 'var(--primary)', lineHeight: 1.5 }}>
            <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
            <span><strong>Mode démo</strong> — Configurez l'URL Google Apps Script dans <code>src/config/emailjs.js</code> pour activer la réservation réelle avec Google Calendar.</span>
          </div>
        )}
      </section>

      {/* ===== STEP 1: DATE & SLOT ===== */}
      {step === 1 && (
        <section className="container" style={{ padding: '0 20px 32px' }}>
          {/* Calendar */}
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)', overflow: 'hidden', marginBottom: '20px' }}>
            {/* Month nav */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 24px', borderBottom: '1px solid var(--border-light)' }}>
              <button onClick={prevMonth} style={{ background: 'var(--bg-secondary)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                <ChevronLeft size={18} />
              </button>
              <span style={{ fontWeight: 700, fontSize: '16px', textTransform: 'capitalize' }}>{monthLabel}</span>
              <button onClick={nextMonth} style={{ background: 'var(--bg-secondary)', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer' }}>
                <ChevronRight size={18} />
              </button>
            </div>

            {/* Legend */}
            <div style={{ display: 'flex', gap: '16px', padding: '12px 20px', fontSize: '12px', color: 'var(--text-muted)', borderBottom: '1px solid var(--border-light)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', display: 'inline-block' }} /> Disponible
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#fee2e2', border: '1px solid #fca5a5', display: 'inline-block' }} /> Complet
              </span>
            </div>

            {/* Loading Overlay */}
            <div style={{ position: 'relative', minHeight: '300px' }}>
              <AnimatePresence>
                {loadingSlots && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    style={{ 
                      position: 'absolute', 
                      inset: 0, 
                      background: 'rgba(255, 255, 255, 0.7)', 
                      backdropFilter: 'blur(8px)', 
                      zIndex: 20, 
                      display: 'flex', 
                      flexDirection: 'column', 
                      padding: '44px 12px 16px',
                      borderRadius: 'var(--radius-lg)',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Scanner Line Effect */}
                    <div className="scanner-line" />
                    
                    {/* Skeleton Grid matching the real one */}
                    <div style={{ 
                      display: 'grid', 
                      gridTemplateColumns: 'repeat(7, 1fr)', 
                      gap: '4px'
                    }}>
                      {[...Array(28)].map((_, i) => (
                        <motion.div 
                          key={i}
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: i * 0.01 }}
                          className="skeleton" 
                          style={{
                            width: '100%',
                            aspectRatio: '1',
                            borderRadius: '50%',
                            opacity: 0.35
                          }}
                        />
                      ))}
                    </div>

                    <div style={{ 
                      position: 'absolute', 
                      top: '50%', 
                      left: '50%', 
                      transform: 'translate(-50%, -50%)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '12px',
                      zIndex: 30
                    }}>
                      <Loader2 size={32} className="shimmer-spinner" style={{ color: 'var(--primary)' }} />
                      <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '2px', textTransform: 'uppercase' }}>
                        Initialisation...
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            {/* Day headers */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '12px 12px 4px' }}>
              {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => (
                <div key={d} style={{ textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-light)', padding: '4px' }}>{d}</div>
              ))}
            </div>

            {/* Days grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', padding: '4px 12px 16px', gap: '4px' }}>
              {calendarDays.map((day, i) => {
                if (!day) return <div key={`empty-${i}`} />;
                const isSelected = selectedDate === day.dateStr;
                const isDisabled = day.isPast || day.isFullyBooked;
                return (
                  <button
                    key={day.dateStr}
                    disabled={isDisabled}
                    onClick={() => { setSelectedDate(day.dateStr); setSelectedSlot(null); }}
                    style={{
                      width: '100%', aspectRatio: '1', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '14px', fontWeight: isSelected ? 700 : 500, position: 'relative',
                      background: isSelected ? 'var(--primary)' : day.isFullyBooked ? '#fee2e2' : 'transparent',
                      color: isSelected ? '#fff' : day.isFullyBooked ? '#ef4444' : day.isPast ? 'var(--text-light)' : 'var(--text-main)',
                      opacity: day.isPast ? 0.3 : 1,
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
          </div>

          {/* Selected date summary */}
          {selectedDate && (
            <div style={{ padding: '14px 18px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)', marginBottom: '20px', fontSize: '14px', fontWeight: 600, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <CheckCircle2 size={16} />
              {formatDateFR(selectedDate)}
            </div>
          )}

          {/* Slot selection */}
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Choisissez votre créneau</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
            {Object.entries(SLOT_LABELS).map(([key, val]) => {
              const Icon = val.icon;
              const isActive = selectedSlot === key;
              const isBusy = selectedDayInfo && selectedDayInfo[key === 'afternoon' ? 'afternoonBusy' : 'eveningBusy'];
              return (
                <button key={key} onClick={() => !isBusy && setSelectedSlot(key)} disabled={isBusy} style={{
                  padding: '20px 16px', borderRadius: 'var(--radius-lg)', textAlign: 'center',
                  background: isBusy ? '#fee2e2' : isActive ? 'var(--primary)' : 'var(--bg-app)',
                  color: isBusy ? '#b91c1c' : isActive ? '#fff' : 'var(--text-main)',
                  border: isBusy ? '2px solid #fca5a5' : isActive ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                  boxShadow: isActive ? '0 0 0 4px var(--accent-glow)' : 'var(--shadow-sm)',
                  transition: 'all 0.2s',
                  cursor: isBusy ? 'not-allowed' : 'pointer',
                  opacity: isBusy ? 0.7 : 1,
                  position: 'relative',
                }}>
                  {isBusy ? <Lock size={24} style={{ marginBottom: '8px' }} /> : <Icon size={24} style={{ marginBottom: '8px' }} />}
                  <div style={{ fontWeight: 700, fontSize: '15px' }}>{val.label}</div>
                  <div style={{ fontSize: '13px', opacity: 0.8 }}>{isBusy ? 'Réservé' : val.time}</div>
                </button>
              );
            })}
          </div>

          {/* Formula selection */}
          <h3 style={{ fontSize: '16px', fontWeight: 700, marginBottom: '12px' }}>Votre formule</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
            {FORMULAS.map(f => {
              const isActive = selectedFormula === f.id;
              return (
                <button key={f.id} onClick={() => setSelectedFormula(f.id)} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px',
                  borderRadius: 'var(--radius-md)',
                  background: isActive ? 'var(--bg-secondary)' : 'var(--bg-app)',
                  border: isActive ? '2px solid var(--primary)' : '1.5px solid var(--border-light)',
                  transition: 'all 0.2s', textAlign: 'left', cursor: 'pointer',
                }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '15px', color: 'var(--text-main)' }}>{f.name}</div>
                    <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{f.desc}</div>
                  </div>
                  <div style={{ fontWeight: 800, fontSize: '17px', color: isActive ? 'var(--primary)' : 'var(--text-main)' }}>{f.price}</div>
                </button>
              );
            })}
          </div>

          <button className="btn-primary" disabled={!canProceedStep1} onClick={() => setStep(2)}
            style={{ width: '100%', opacity: canProceedStep1 ? 1 : 0.5, cursor: canProceedStep1 ? 'pointer' : 'not-allowed' }}>
            Continuer
          </button>
        </section>
      )}

      {/* ===== STEP 2: CONTACT INFO ===== */}
      {step === 2 && (
        <section className="container" style={{ padding: '0 20px 32px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Vos coordonnées</h3>

            <div className="form-group">
              <label className="form-label" htmlFor="name">Nom complet *</label>
              <input className="form-input" type="text" id="name" name="name" placeholder="Jean Dupont" value={formData.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email *</label>
              <input className="form-input" type="email" id="email" name="email" placeholder="jean@exemple.com" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="phone">Téléphone</label>
              <input className="form-input" type="tel" id="phone" name="phone" placeholder="06 12 34 56 78" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="eventType">Type d'événement *</label>
              <select className="form-select" id="eventType" name="eventType" value={formData.eventType} onChange={handleChange} required>
                <option value="">Sélectionnez...</option>
                {eventTypes.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="message">Message (optionnel)</label>
              <textarea className="form-textarea" id="message" name="message" placeholder="Précisions sur votre événement..." value={formData.message} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="btn-secondary" onClick={() => setStep(1)} style={{ flex: 1 }}>Retour</button>
            <button className="btn-primary" disabled={!canProceedStep2} onClick={() => setStep(3)}
              style={{ flex: 2, opacity: canProceedStep2 ? 1 : 0.5, cursor: canProceedStep2 ? 'pointer' : 'not-allowed' }}>
              Vérifier & Réserver
            </button>
          </div>
        </section>
      )}

      {/* ===== STEP 3: RECAP ===== */}
      {step === 3 && (
        <section className="container" style={{ padding: '0 20px 32px' }}>
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-md)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, marginBottom: '20px' }}>Récapitulatif</h3>

            {[
              ['Date', formatDateFR(selectedDate)],
              ['Créneau', `${SLOT_LABELS[selectedSlot]?.label} (${SLOT_LABELS[selectedSlot]?.time})`],
              ['Formule', `${FORMULAS.find(f => f.id === selectedFormula)?.name} — ${FORMULAS.find(f => f.id === selectedFormula)?.price}`],
              ['Nom', formData.name],
              ['Email', formData.email],
              ['Téléphone', formData.phone || '—'],
              ['Événement', formData.eventType],
            ].map(([label, value], i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 6 ? '1px solid var(--border-light)' : 'none' }}>
                <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>{label}</span>
                <span style={{ fontSize: '14px', fontWeight: 600, textAlign: 'right', maxWidth: '60%' }}>{value}</span>
              </div>
            ))}

            {formData.message && (
              <div style={{ marginTop: '12px', padding: '12px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)', fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.5 }}>
                <strong>Message :</strong> {formData.message}
              </div>
            )}
          </div>

          {error && (
            <div style={{ marginTop: '16px', padding: '14px 18px', background: '#fef2f2', borderRadius: 'var(--radius-md)', border: '1px solid #fecaca', color: '#b91c1c', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: '12px', marginTop: '20px' }}>
            <button className="btn-secondary" onClick={() => setStep(2)} style={{ flex: 1 }} disabled={loading}>Modifier</button>
            <button className="btn-primary" onClick={handleSubmit} style={{ flex: 2 }} disabled={loading}>
              {loading ? <><Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} /> Envoi en cours...</> : <><Send size={18} /> Confirmer la réservation</>}
            </button>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '16px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CheckCircle2 size={12} /> Confirmation par email
            </span>
            <span style={{ fontSize: '12px', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <CalendarCheck size={12} /> Ajout auto au calendrier
            </span>
          </div>
        </section>
      )}

      {/* CONTACT INFO */}
      {step < 4 && (
        <section className="container" style={{ padding: '16px 20px 48px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <EditableBlock
              label="Contact Téléphone"
              modalTitle="Modifier le Téléphone"
              fields={[{ key: 'phone', label: 'Numéro', type: 'text', value: content.contact?.phone || '+33 6 12 34 56 78' }]}
              onSave={(vals) => updateContent({ ...content, contact: { ...content.contact, ...vals } })}
            >
              <div className="contact-info-card">
                <div className="contact-info-icon"><Phone size={20} /></div>
                <div><h3>Téléphone</h3><p>{content.contact?.phone || '+33 6 12 34 56 78'}</p></div>
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
      )}
    </div>
  );
};

export default Contact;
