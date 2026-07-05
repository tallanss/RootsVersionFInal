import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { EyeOff, Lock } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import { useAdmin } from '../context/AdminContext';
import SectionRenderer from '../components/sections/SectionRenderer';
import { sha256hex } from '../utils/hash';
import NotFound from './NotFound';

/* ── Barrière (douce) de mot de passe pour une galerie protégée ── */
function GalleryGate({ page, onUnlock }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState(false);
  const [checking, setChecking] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(false);
    setChecking(true);
    const h = await sha256hex(pw);
    setChecking(false);
    if (h === page.galleryPasswordHash) {
      try { sessionStorage.setItem('pr_gal_' + page.slug, '1'); } catch (_) { /* ignore */ }
      onUnlock();
    } else {
      setError(true);
    }
  };

  return (
    <section className="container" style={{ padding: '48px 24px', display: 'flex', justifyContent: 'center' }}>
      <div style={{ maxWidth: '420px', width: '100%', textAlign: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', padding: '36px 28px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--bg-secondary)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
          <Lock size={28} />
        </div>
        <h1 style={{ fontSize: '22px', fontWeight: 800, color: 'var(--text-main)', marginBottom: '6px' }}>
          {page.galleryClientName || page.title}
        </h1>
        <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '22px' }}>
          Cette galerie est protégée. Saisissez le mot de passe qui vous a été communiqué.
        </p>
        <form onSubmit={submit}>
          <input
            type="password"
            value={pw}
            onChange={(e) => { setPw(e.target.value); setError(false); }}
            placeholder="Mot de passe"
            autoFocus
            className="form-input"
            style={{ width: '100%', textAlign: 'center', marginBottom: '12px' }}
          />
          {error && (
            <p style={{ color: '#dc2626', fontSize: '13px', marginBottom: '12px' }}>Mot de passe incorrect.</p>
          )}
          <button type="submit" className="btn-primary" disabled={checking || !pw} style={{ width: '100%' }}>
            {checking ? 'Vérification…' : 'Accéder aux photos'}
          </button>
        </form>
      </div>
    </section>
  );
}

/**
 * Page libre / galerie créée via le CMS.
 * Rendue 100% côté client : non prérendue, noindex par défaut.
 */
export default function CustomPage() {
  const { slug } = useParams();
  const { content, remoteLoaded } = useContent();
  const { isAdminMode } = useAdmin();
  const [unlockTick, setUnlockTick] = useState(0);

  const page = (content.customPages || []).find((p) => p.slug === slug);

  // Pas encore trouvée mais contenu distant non chargé → patienter (anti faux 404).
  if (!page && !remoteLoaded) {
    return <div style={{ minHeight: '50vh' }} />;
  }
  if (!page) return <NotFound />;

  // Brouillon : invisible pour le public, prévisualisable en mode admin.
  if (page.visible === false && !isAdminMode) return <NotFound />;

  const seoTitle = page.seoTitle || `${page.title} — PhotoRoots`;
  const canonical = `https://photoroots.fr/p/${page.slug}`;

  // Galerie protégée : sections masquées tant que le mot de passe n'est pas
  // saisi (déverrouillage mémorisé pour la session). L'admin passe outre.
  const isLockedGallery =
    page.kind === 'gallery' &&
    !!page.galleryPasswordHash &&
    !isAdminMode &&
    (typeof window === 'undefined' || sessionStorage.getItem('pr_gal_' + page.slug) !== '1');
  void unlockTick; // force le recalcul de isLockedGallery après déverrouillage

  return (
    <div className="animate-in">
      <Helmet>
        <title>{seoTitle}</title>
        {page.seoDesc && <meta name="description" content={page.seoDesc} />}
        <link rel="canonical" href={canonical} />
        {!page.indexable && <meta name="robots" content="noindex, nofollow" />}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={canonical} />
        <meta property="og:title" content={seoTitle} />
        {page.seoDesc && <meta property="og:description" content={page.seoDesc} />}
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
      </Helmet>

      {page.visible === false && isAdminMode && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          background: 'rgba(197,160,89,0.12)', border: '1px solid rgba(197,160,89,0.35)',
          color: 'var(--primary)', fontWeight: 700, fontSize: '13px',
          padding: '10px 16px', margin: '12px 20px', borderRadius: '12px',
        }}>
          <EyeOff size={15} /> Page masquée — seul le mode admin peut la voir. Activez « Page visible » pour la publier.
        </div>
      )}

      {isLockedGallery
        ? <GalleryGate page={page} onUnlock={() => setUnlockTick((t) => t + 1)} />
        : <SectionRenderer sections={page.sections} />}
    </div>
  );
}
