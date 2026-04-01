import { useState, useEffect } from 'react';
import { CheckCircle2, Info, AlertCircle, X } from 'lucide-react';

const STYLES = {
  success: { bg: '#f0fdf4', border: '#86efac', color: '#15803d' },
  info:    { bg: '#eff6ff', border: '#93c5fd', color: '#1d4ed8' },
  error:   { bg: '#fef2f2', border: '#fca5a5', color: '#dc2626' },
};

const ICONS = {
  success: CheckCircle2,
  info:    Info,
  error:   AlertCircle,
};

const ToastItem = ({ message, type = 'success', onDismiss }) => {
  const s = STYLES[type] || STYLES.success;
  const Icon = ICONS[type] || CheckCircle2;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '10px',
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: '12px', padding: '12px 16px',
      boxShadow: '0 4px 24px rgba(0,0,0,0.12)',
      animation: 'toastIn 0.3s cubic-bezier(0.16,1,0.3,1)',
      maxWidth: '320px', width: '100%',
    }}>
      <Icon size={18} color={s.color} style={{ flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: '14px', fontWeight: 600, color: s.color, lineHeight: 1.3 }}>
        {message}
      </span>
      <button
        onClick={onDismiss}
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: s.color, opacity: 0.5, padding: '2px', display: 'flex', alignItems: 'center' }}
      >
        <X size={14} />
      </button>
    </div>
  );
};

export const ToastContainer = () => {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (e) => {
      const id = Date.now() + Math.random();
      setToasts(prev => [...prev, { id, ...e.detail }]);
      setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
    };
    window.addEventListener('photo-roots-toast', handler);
    return () => window.removeEventListener('photo-roots-toast', handler);
  }, []);

  if (toasts.length === 0) return null;

  return (
    <>
      <style>{`
        @keyframes toastIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
      <div style={{
        position: 'fixed', bottom: 'calc(80px + env(safe-area-inset-bottom))', left: '50%', transform: 'translateX(-50%)',
        zIndex: 999999, display: 'flex', flexDirection: 'column-reverse', gap: '8px',
        alignItems: 'center', width: '100%', maxWidth: '360px', padding: '0 16px',
        pointerEvents: 'none',
      }}>
        {toasts.map(t => (
          <div key={t.id} style={{ pointerEvents: 'auto', width: '100%' }}>
            <ToastItem
              message={t.message}
              type={t.type}
              onDismiss={() => setToasts(prev => prev.filter(x => x.id !== t.id))}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export const showToast = (message, type = 'success') => {
  window.dispatchEvent(new CustomEvent('photo-roots-toast', { detail: { message, type } }));
};
