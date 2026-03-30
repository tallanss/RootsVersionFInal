import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Lock, Delete, ArrowRight } from 'lucide-react';
import { useAdmin } from '../context/AdminContext';

const Admin = () => {
  const { login, isAdminMode } = useAdmin();
  const navigate = useNavigate();
  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  // Already logged in → redirect to home
  React.useEffect(() => {
    if (isAdminMode) navigate('/');
  }, [isAdminMode, navigate]);

  const handleDigit = (digit) => {
    if (pin.length < 6) {
      const newPin = pin + digit;
      setPin(newPin);
      setError(false);
      if (newPin.length === 6) {
        const ok = login(newPin);
        if (ok) {
          navigate('/');
        } else {
          setShake(true);
          setError(true);
          setTimeout(() => {
            setPin('');
            setShake(false);
          }, 700);
        }
      }
    }
  };

  const handleDelete = () => {
    setPin(p => p.slice(0, -1));
    setError(false);
  };

  const digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del'];

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0c',
      padding: '24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      <Helmet>
        <title>Admin | PhotoRoots</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Ambient glow */}
      <div style={{
        position: 'absolute', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: '400px', height: '400px', background: 'radial-gradient(circle, rgba(197,160,89,0.12) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Logo */}
      <div style={{ marginBottom: '40px', textAlign: 'center' }}>
        <img
          src="/logo-gold.png"
          alt="PhotoRoots"
          style={{ height: '60px', width: 'auto', objectFit: 'contain', marginBottom: '16px' }}
        />
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          Espace Administrateur
        </p>
      </div>

      {/* PIN display */}
      <div
        style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '36px',
          animation: shake ? 'adminShake 0.4s ease' : 'none',
        }}
      >
        {[0, 1, 2, 3, 4, 5].map(i => (
          <div
            key={i}
            style={{
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: pin.length > i
                ? (error ? '#ef4444' : 'var(--primary)')
                : 'rgba(255,255,255,0.15)',
              border: pin.length > i ? 'none' : '2px solid rgba(255,255,255,0.15)',
              transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
              transform: pin.length === i + 1 ? 'scale(1.3)' : 'scale(1)',
              boxShadow: pin.length > i && !error ? '0 0 10px rgba(197,160,89,0.5)' : 'none',
            }}
          />
        ))}
      </div>

      {error && (
        <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: 600, marginBottom: '16px', marginTop: '-20px' }}>
          Code incorrect. Réessayez.
        </p>
      )}

      {/* PIN Pad */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: '12px',
        maxWidth: '260px',
        width: '100%',
      }}>
        {digits.map((d, i) => {
          if (d === null) return <div key={i} />;

          const isDel = d === 'del';

          return (
            <button
              key={i}
              onClick={() => isDel ? handleDelete() : handleDigit(String(d))}
              disabled={isDel && pin.length === 0}
              style={{
                height: '64px',
                borderRadius: '18px',
                border: 'none',
                background: isDel ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)',
                color: isDel ? '#ef4444' : '#ffffff',
                fontSize: isDel ? '14px' : '22px',
                fontWeight: 700,
                cursor: (isDel && pin.length === 0) ? 'not-allowed' : 'pointer',
                opacity: (isDel && pin.length === 0) ? 0.3 : 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backdropFilter: 'blur(10px)',
                transition: 'all 0.15s ease',
                fontFamily: 'var(--font-main)',
              }}
              onMouseEnter={e => {
                if (!(isDel && pin.length === 0)) {
                  e.currentTarget.style.background = isDel ? 'rgba(239,68,68,0.2)' : 'rgba(255,255,255,0.12)';
                  e.currentTarget.style.transform = 'scale(1.05)';
                }
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = isDel ? 'rgba(239,68,68,0.1)' : 'rgba(255,255,255,0.06)';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              {isDel ? <Delete size={20} /> : d}
            </button>
          );
        })}
      </div>

      {/* Footer hint */}
      <p style={{ marginTop: '40px', fontSize: '12px', color: 'rgba(255,255,255,0.2)', textAlign: 'center' }}>
        Entrez votre code PIN à 6 chiffres
      </p>

      <style>{`
        @keyframes adminShake {
          0%, 100% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-6px); }
          80% { transform: translateX(6px); }
        }
      `}</style>
    </div>
  );
};

export default Admin;
