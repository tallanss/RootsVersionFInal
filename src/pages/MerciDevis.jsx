import { lazy, Suspense, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, Image as ImageIcon, Home } from 'lucide-react';
import { trackEvent } from '../utils/analytics';

const Confetti = lazy(() => import('../components/Confetti'));

// Page de confirmation dédiée (#23) : atteinte après l'envoi d'une demande de
// devis. URL fixe /demande-recue pour le suivi des conversions GA4 / Google Ads.
// En noindex (ne doit pas apparaître dans Google).
export default function MerciDevis() {
  const location = useLocation();
  const email = location.state?.email;

  useEffect(() => {
    // Événement de conversion (en plus du page_view GA4 automatique).
    trackEvent('demande_recue', { page: '/demande-recue' });
    window.scrollTo({ top: 0, behavior: 'auto' });
  }, []);

  return (
    <div className="animate-in">
      <Helmet>
        <title>Demande bien reçue — PhotoRoots</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>

      <Suspense fallback={null}><Confetti active /></Suspense>

      <section className="container" style={{ padding: '48px 24px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          style={{ textAlign: 'center', padding: '40px 24px', maxWidth: '560px', margin: '0 auto', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-lg)' }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 200, damping: 14 }}
            style={{ width: '82px', height: '82px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 22px', boxShadow: '0 0 0 8px var(--accent-glow)' }}
          >
            <CheckCircle2 size={42} />
          </motion.div>

          <h1 style={{ fontSize: '26px', fontWeight: 800, marginBottom: '10px', color: 'var(--text-main)' }}>
            Merci, votre demande est bien reçue !
          </h1>
          <p style={{ fontSize: '15.5px', color: 'var(--text-muted)', lineHeight: 1.65, marginBottom: '8px' }}>
            Nous revenons vers vous <strong>sous 24h</strong>{email ? <> — par email à <strong>{email}</strong> ou par téléphone</> : null} avec votre devis personnalisé gratuit.
          </p>
          <p style={{ fontSize: '14px', color: 'var(--text-light)', lineHeight: 1.6, marginBottom: '28px' }}>
            Pensez à vérifier vos spams si vous ne recevez rien. Une question urgente ? Appelez-nous directement.
          </p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link to="/galerie" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 26px', borderRadius: 'var(--radius-full, 999px)', background: 'var(--primary)', color: '#fff', fontWeight: 800, fontSize: '14px', textDecoration: 'none' }}>
              <ImageIcon size={17} /> Voir nos réalisations
            </Link>
            <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 26px', borderRadius: 'var(--radius-full, 999px)', background: 'var(--bg-app)', color: 'var(--text-main)', border: '1px solid var(--border-light)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
              <Home size={17} /> Retour à l'accueil <ArrowRight size={15} />
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}
