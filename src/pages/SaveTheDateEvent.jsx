import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { MapPin, Heart, Copy, Check } from 'lucide-react';
import { useContent } from '../context/ContentContext';

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(null);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calc = () => {
      const diff = new Date(targetDate) - new Date();
      if (diff <= 0) {
        setIsPast(true);
        return { days: 0, hours: 0, minutes: 0, seconds: 0 };
      }
      return {
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      };
    };
    setTimeLeft(calc());
    const id = setInterval(() => setTimeLeft(calc()), 1000);
    return () => clearInterval(id);
  }, [targetDate]);

  if (!timeLeft) return null;

  if (isPast) {
    return (
      <p style={{ color: 'rgba(255,255,255,0.55)', fontStyle: 'italic', fontSize: '16px' }}>
        Le grand jour est passé ✨
      </p>
    );
  }

  const units = [
    { label: 'Jours', value: timeLeft.days },
    { label: 'Heures', value: timeLeft.hours },
    { label: 'Min', value: timeLeft.minutes },
    { label: 'Sec', value: timeLeft.seconds },
  ];

  return (
    <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
      {units.map(({ label, value }) => (
        <div key={label} style={{ textAlign: 'center' }}>
          <div style={{
            background: 'rgba(255,255,255,0.07)',
            backdropFilter: 'blur(16px)',
            border: '1px solid rgba(255,255,255,0.12)',
            borderRadius: '16px',
            padding: '18px 22px',
            minWidth: '72px',
          }}>
            <div style={{
              fontSize: '38px', fontWeight: 700, color: '#fff',
              lineHeight: 1, fontVariantNumeric: 'tabular-nums',
            }}>
              {String(value).padStart(2, '0')}
            </div>
          </div>
          <div style={{
            fontSize: '10px', color: 'rgba(255,255,255,0.4)',
            marginTop: '8px', letterSpacing: '1.5px', textTransform: 'uppercase',
          }}>
            {label}
          </div>
        </div>
      ))}
    </div>
  );
};

const SaveTheDateEvent = () => {
  const { slug } = useParams();
  const { content } = useContent();
  const [copied, setCopied] = useState(false);

  const events = content.saveTheDateEvents || [];
  const event = events.find(e => e.slug === slug);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('fr-FR', {
      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (!event) {
    return (
      <div style={{
        minHeight: '80vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '40px',
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>💌</div>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '12px' }}>Événement introuvable</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '28px', maxWidth: '320px', lineHeight: 1.6 }}>
          Ce lien n'est plus valide ou n'existe pas encore.
        </p>
        <Link to="/" className="btn-primary">Retour à l'accueil</Link>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#0a0a0c' }}>
      <Helmet>
        <title>Save The Date — {event.name1} & {event.name2}</title>
        <meta name="description" content={`Save The Date pour ${event.name1} & ${event.name2} — ${formatDate(event.date)}`} />
        <meta name="robots" content="noindex, nofollow" />
        {event.bgImage && <meta property="og:image" content={event.bgImage} />}
        <meta property="og:title" content={`Save The Date — ${event.name1} & ${event.name2}`} />
        <meta property="og:description" content={`${formatDate(event.date)}${event.location ? ` · ${event.location}` : ''}`} />
        <meta property="og:type" content="website" />
      </Helmet>

      {/* Background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 0 }}>
        {event.bgImage && (
          <img
            src={event.bgImage}
            alt=""
            style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.45 }}
          />
        )}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, rgba(10,10,12,0.65) 0%, rgba(10,10,12,0.45) 35%, rgba(10,10,12,0.92) 100%)',
        }} />
      </div>

      {/* Content */}
      <div style={{
        position: 'relative', zIndex: 10,
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        padding: '80px 24px 60px',
        textAlign: 'center', color: '#fff',
      }}>

        <div style={{
          fontSize: '11px', letterSpacing: '5px', textTransform: 'uppercase',
          opacity: 0.5, marginBottom: '40px', fontWeight: 600,
        }}>
          Save The Date
        </div>

        {/* Names */}
        <h1 style={{
          fontFamily: '"Cinzel", "Playfair Display", Georgia, serif',
          fontSize: 'clamp(44px, 10vw, 88px)',
          fontWeight: 600, lineHeight: 1.1,
          textShadow: '0 6px 40px rgba(0,0,0,0.9)',
          marginBottom: '8px',
        }}>
          {event.name1}
        </h1>

        <Heart
          size={22}
          fill="var(--primary)"
          color="var(--primary)"
          style={{ margin: '16px 0', opacity: 0.9 }}
        />

        <h1 style={{
          fontFamily: '"Cinzel", "Playfair Display", Georgia, serif',
          fontSize: 'clamp(44px, 10vw, 88px)',
          fontWeight: 600, lineHeight: 1.1,
          textShadow: '0 6px 40px rgba(0,0,0,0.9)',
          marginBottom: '32px',
        }}>
          {event.name2}
        </h1>

        <div style={{ width: '48px', height: '1px', background: 'var(--primary)', opacity: 0.5, marginBottom: '32px' }} />

        {/* Date */}
        <p style={{
          fontSize: '20px', fontWeight: 500, letterSpacing: '0.5px',
          textTransform: 'capitalize', marginBottom: '10px',
          textShadow: '0 2px 10px rgba(0,0,0,0.6)',
        }}>
          {formatDate(event.date)}
        </p>

        {/* Location */}
        {event.location && (
          <p style={{
            fontSize: '14px', opacity: 0.55, marginBottom: '48px',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
          }}>
            <MapPin size={13} /> {event.location}
          </p>
        )}

        {/* Countdown */}
        <div style={{ marginBottom: event.message ? '40px' : '52px' }}>
          <Countdown targetDate={event.date} />
        </div>

        {/* Message */}
        {event.message && (
          <p style={{
            fontSize: '16px', fontStyle: 'italic', opacity: 0.75,
            maxWidth: '500px', lineHeight: 1.8, marginBottom: '52px',
          }}>
            "{event.message}"
          </p>
        )}

        {/* Copy link */}
        <button
          onClick={handleCopy}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(255,255,255,0.18)',
            backdropFilter: 'blur(16px)',
            color: '#fff', borderRadius: '50px',
            padding: '13px 26px',
            fontSize: '14px', fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
        >
          {copied ? <Check size={16} color="var(--primary)" /> : <Copy size={16} />}
          {copied ? 'Lien copié !' : 'Partager ce lien'}
        </button>

        {/* Branding */}
        <div style={{ marginTop: '64px', opacity: 0.25 }}>
          <img src="/logo-gold.png" alt="PhotoRoots" style={{ height: '22px' }} />
        </div>
      </div>
    </div>
  );
};

export default SaveTheDateEvent;
