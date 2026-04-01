import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { haptic } from '../hooks/useHaptic';
import { Calendar, X, Check, AlertCircle, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useContent } from '../context/ContentContext';
import { fetchBusySlots } from '../services/emailService';

const DateChecker = () => {
  const { content } = useContent();
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState('');
  const [result, setResult] = useState(null); // null | 'available' | 'unavailable' | 'loading'
  const busySlotsRef = useRef([]);

  const blockedDates = content.blockedDates || [];

  // Charger les créneaux occupés depuis Google Calendar au montage
  useEffect(() => {
    fetchBusySlots().then(slots => {
      const cmsBlocked = blockedDates.flatMap(d => [`${d}_afternoon`, `${d}_evening`]);
      busySlotsRef.current = [...new Set([...slots, ...cmsBlocked])];
    }).catch(() => {
      // Fallback sur les dates bloquées manuellement uniquement
      busySlotsRef.current = blockedDates.flatMap(d => [`${d}_afternoon`, `${d}_evening`]);
    });
  }, [blockedDates]);

  const checkDate = () => {
    if (!date) return;
    haptic(12);
    // Une date est complète si les deux créneaux (matin et soir) sont occupés
    const afternoonBusy = busySlotsRef.current.includes(`${date}_afternoon`);
    const eveningBusy = busySlotsRef.current.includes(`${date}_evening`);
    setResult(afternoonBusy && eveningBusy ? 'unavailable' : 'available');
  };

  const reset = () => { setDate(''); setResult(null); };
  const open = () => { setIsOpen(true); reset(); };
  const close = () => { setIsOpen(false); reset(); };

  const today = new Date().toISOString().split('T')[0];

  return (
    <>
      {/* Floating pill */}
      <button
        onClick={open}
        aria-label="Vérifier une date de disponibilité"
        className="date-checker-pill"
        style={{
          position: 'fixed',
          bottom: 'calc(72px + env(safe-area-inset-bottom))',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 8500,
          background: 'var(--bg-dark)',
          color: '#fff',
          border: '1px solid rgba(197,160,89,0.5)',
          borderRadius: '50px',
          padding: '10px 20px',
          fontSize: '13px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.35)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          whiteSpace: 'nowrap',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => { e.currentTarget.style.transform = 'translateX(-50%) scale(1.04)'; e.currentTarget.style.boxShadow = '0 6px 28px rgba(197,160,89,0.3)'; }}
        onMouseLeave={e => { e.currentTarget.style.transform = 'translateX(-50%) scale(1)'; e.currentTarget.style.boxShadow = '0 4px 24px rgba(0,0,0,0.35)'; }}
      >
        <Calendar size={14} color="var(--primary)" />
        Ma date est libre ?
      </button>

      {/* Bottom sheet portal */}
      {isOpen && createPortal(
        <div
          onClick={(e) => { if (e.target === e.currentTarget) close(); }}
          style={{
            position: 'fixed', inset: 0, zIndex: 200001,
            background: 'rgba(0,0,0,0.6)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center',
          }}
        >
          <div style={{
            background: '#fff',
            width: '100%', maxWidth: '480px',
            borderRadius: '28px 28px 0 0',
            padding: '28px 24px calc(40px + env(safe-area-inset-bottom))',
            boxShadow: '0 -20px 60px rgba(0,0,0,0.2)',
            animation: 'slideUpModal 0.35s cubic-bezier(0.16,1,0.3,1)',
          }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px' }}>
              <div>
                <div style={{ fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--primary)', marginBottom: '4px' }}>
                  Disponibilité
                </div>
                <h3 style={{ fontSize: '20px', fontWeight: 800, color: 'var(--text-main)', margin: 0 }}>
                  Vérifier une date
                </h3>
              </div>
              <button
                onClick={close}
                style={{ background: '#f4f4f5', border: 'none', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}
              >
                <X size={18} />
              </button>
            </div>

            {/* Step 1: picker */}
            {result === null && (
              <>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '16px', lineHeight: 1.5 }}>
                  Sélectionnez votre date pour vérifier instantanément notre disponibilité.
                </p>
                <input
                  type="date"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  min={today}
                  style={{
                    width: '100%', padding: '14px 16px', fontSize: '16px',
                    border: '2px solid var(--border-light)', borderRadius: '16px',
                    background: '#fafafa', color: 'var(--text-main)',
                    marginBottom: '16px', boxSizing: 'border-box',
                    colorScheme: 'light', outline: 'none', fontFamily: 'inherit',
                  }}
                  onFocus={e => e.target.style.borderColor = 'var(--primary)'}
                  onBlur={e => e.target.style.borderColor = 'var(--border-light)'}
                />
                <button
                  onClick={checkDate}
                  disabled={!date}
                  className="btn-primary"
                  style={{ width: '100%', padding: '15px', fontSize: '15px', opacity: date ? 1 : 0.45, transition: 'opacity 0.2s' }}
                >
                  Vérifier la disponibilité
                </button>
              </>
            )}

            {/* Step 2a: available */}
            {result === 'available' && (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{
                  width: '72px', height: '72px',
                  background: 'rgba(34,197,94,0.1)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <Check size={32} color="#22c55e" strokeWidth={2.5} />
                </div>
                <h4 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#22c55e' }}>
                  Disponible !
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
                  Cette date est libre. Réservez avant qu'elle ne parte !
                </p>
                <Link
                  to="/contact"
                  onClick={close}
                  className="btn-primary"
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '14px 20px', textDecoration: 'none', borderRadius: 'var(--radius-full)', fontSize: '15px', fontWeight: 700 }}
                >
                  Réserver cette date <ChevronRight size={16} />
                </Link>
                <button
                  onClick={reset}
                  style={{ marginTop: '14px', background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '13px', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Vérifier une autre date
                </button>
              </div>
            )}

            {/* Step 2b: unavailable */}
            {result === 'unavailable' && (
              <div style={{ textAlign: 'center', padding: '8px 0' }}>
                <div style={{
                  width: '72px', height: '72px',
                  background: 'rgba(239,68,68,0.1)', borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <AlertCircle size={32} color="#ef4444" />
                </div>
                <h4 style={{ fontSize: '22px', fontWeight: 800, marginBottom: '8px', color: '#ef4444' }}>
                  Déjà réservée
                </h4>
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '28px', lineHeight: 1.6 }}>
                  Cette date n'est plus disponible. Essayez une date voisine ou contactez-nous pour trouver une solution.
                </p>
                <button
                  onClick={reset}
                  className="btn-primary"
                  style={{ width: '100%', padding: '14px', fontSize: '15px' }}
                >
                  Choisir une autre date
                </button>
                <Link
                  to="/contact"
                  onClick={close}
                  style={{ display: 'block', marginTop: '12px', fontSize: '13px', color: 'var(--text-muted)', textDecoration: 'underline', textAlign: 'center' }}
                >
                  Nous contacter quand même
                </Link>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};

export default DateChecker;
