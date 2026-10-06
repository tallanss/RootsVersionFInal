import { useState, useEffect, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { Helmet } from 'react-helmet-async';
import { Camera, X, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import PremiumImage from '../components/PremiumImage';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { priceToNumber, formatEuro } from '../utils/galleryFormat';

// Page publique « Nos bornes » : liste toutes les bornes (machines) visibles du
// CMS ; un clic ouvre une fenêtre modale dédiée (description + détails + prix).
// Tout vient du module admin « Machines » — rien n'est codé en dur ici.
export default function Bornes() {
  const { content } = useContent();
  const [selected, setSelected] = useState(null);

  const machines = useMemo(
    () => (content.machines || []).filter((m) => m.visible !== false),
    [content.machines]
  );

  // Prix « tout compris » = formule chiffrée la moins chère + supplément borne.
  const entryBase = useMemo(() => {
    const bases = (content.pricing_plans || [])
      .map((p) => priceToNumber(p.price))
      .filter((n) => n > 0);
    return bases.length > 0 ? Math.min(...bases) : 0;
  }, [content.pricing_plans]);

  const allInFor = (m) => {
    const supp = Number(m.supplement) || 0;
    return entryBase > 0 ? entryBase + supp : null;
  };

  // Fermeture de la modale avec la touche Échap + blocage du scroll de fond.
  useEffect(() => {
    if (!selected) return;
    const onKey = (e) => { if (e.key === 'Escape') setSelected(null); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [selected]);

  return (
    <div className="animate-in">
      <Helmet>
        <title>Nos bornes photo — Classique, Miroir, 360° | PhotoRoots</title>
        <meta name="description" content="Découvrez toutes nos bornes photo à louer en Seine-Maritime : borne classique, miroir photo et photobooth 360°. Détails et devis gratuit en 24h." />
        <meta name="keywords" content="bornes photo, borne classique, miroir photo, photobooth 360, location borne photo normandie, le havre, rouen, dieppe" />
        <link rel="canonical" href="https://photoroots.fr/nos-bornes" />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://photoroots.fr/nos-bornes" />
        <meta property="og:title" content="Nos bornes photo — Classique, Miroir, 360° | PhotoRoots" />
        <meta property="og:description" content="Découvrez toutes nos bornes photo à louer en Seine-Maritime. Détails et devis gratuit en 24h." />
        <meta property="og:locale" content="fr_FR" />
      </Helmet>

      <FadeIn direction="up">
      <section className="container" style={{ padding: '32px 24px' }}>
        <div className="section-tag"><Camera size={14} /> Nos bornes</div>
        <h1 className="section-title">Nos bornes photo</h1>
        <p className="section-subtitle">Choisissez la borne idéale pour votre événement. Cliquez sur un modèle pour tout savoir.</p>

        {machines.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
            Nos bornes seront bientôt présentées ici. Contactez-nous pour un devis personnalisé.
          </p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px', marginTop: '8px' }}>
            {machines.map((m) => {
              const supp = Number(m.supplement) || 0;
              const allIn = allInFor(m);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setSelected(m)}
                  aria-label={`Voir les détails de la borne ${m.name}`}
                  style={{
                    display: 'flex', flexDirection: 'column', textAlign: 'left', cursor: 'pointer', padding: 0,
                    borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)',
                    background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)', transition: 'transform 0.2s, box-shadow 0.2s',
                  }}
                >
                  <div style={{ position: 'relative', aspectRatio: '4 / 3', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {m.image
                      ? <PremiumImage src={m.image} alt={m.name} style={{ width: '100%', height: '100%' }} />
                      : <Camera size={34} color="var(--text-light)" />}
                    {supp > 0 && (
                      <span style={{ position: 'absolute', top: '10px', right: '10px', background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px' }}>+{formatEuro(supp)}€</span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, padding: '16px 18px 18px' }}>
                    <h2 style={{ fontSize: '17px', fontWeight: 800, color: 'var(--text-main)', margin: '0 0 6px' }}>{m.name}</h2>
                    {m.description && <p style={{ fontSize: '13.5px', color: 'var(--text-muted)', lineHeight: 1.5, margin: '0 0 14px' }}>{m.description}</p>}
                    <span style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontSize: '14px', fontWeight: 800 }}>
                      Voir les détails <ArrowRight size={15} />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </section>
      </FadeIn>

      {/* ===== MODALE DÉTAILS BORNE (portée dans <body> pour passer au-dessus
              du menu du bas, qui est piégé dans un autre contexte d'empilement) ===== */}
      {selected && createPortal(
        <div
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`Détails : ${selected.name}`}
          style={{
            position: 'fixed', inset: 0, zIndex: 10050, background: 'rgba(0,0,0,0.6)',
            display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: '0',
            backdropFilter: 'blur(3px)', WebkitBackdropFilter: 'blur(3px)',
          }}
          className="bornes-modal-overlay"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bornes-modal-card"
            style={{
              background: 'var(--bg-card)', width: '100%', maxWidth: '560px', maxHeight: '92vh',
              overflowY: 'auto', borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
              boxShadow: '0 -10px 40px rgba(0,0,0,0.35)', position: 'relative',
            }}
          >
            <button
              type="button"
              onClick={() => setSelected(null)}
              aria-label="Fermer"
              style={{
                position: 'absolute', top: '12px', right: '12px', zIndex: 2, width: '36px', height: '36px',
                borderRadius: '50%', border: 'none', cursor: 'pointer', background: 'rgba(0,0,0,0.5)', color: '#fff',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <X size={18} />
            </button>

            <div style={{ position: 'relative', flexShrink: 0, height: selected.image ? 'clamp(170px, 26vh, 240px)' : '110px', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {selected.image
                ? <PremiumImage src={selected.image} alt={selected.name} style={{ width: '100%', height: '100%' }} />
                : <Camera size={36} color="var(--text-light)" />}
            </div>

            <div style={{ padding: '22px 22px 26px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{selected.name}</h2>
                <span style={{ fontSize: '13px', fontWeight: 800, color: (Number(selected.supplement) || 0) > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
                  {(Number(selected.supplement) || 0) > 0 ? `Supplément +${formatEuro(Number(selected.supplement))}€` : 'Sans supplément'}
                </span>
              </div>

              {selected.description && (
                <p style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.6, margin: '14px 0 0' }}>{selected.description}</p>
              )}
              {selected.details && (
                <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: 1.65, margin: '12px 0 0', whiteSpace: 'pre-line' }}>{selected.details}</p>
              )}

              {allInFor(selected) != null && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: '18px 0 0', padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
                  <CheckCircle2 size={16} style={{ color: 'var(--primary)', flexShrink: 0 }} />
                  <span style={{ fontSize: '14px', color: 'var(--text-main)' }}>
                    Tout compris, dès <strong style={{ color: 'var(--primary)' }}>{formatEuro(allInFor(selected))}€</strong> (pack + borne)
                  </span>
                </div>
              )}

              <div style={{ marginTop: '20px' }}>
                <AnimatedButton
                  to={`/contact?mode=devis&machine=${selected.id}`}
                  className="btn-primary"
                  style={{ width: '100%' }}
                  aria-label={`Réserver la borne ${selected.name}`}
                >
                  Réserver cette borne <ArrowRight size={16} />
                </AnimatedButton>
              </div>
            </div>
          </div>
        </div>,
        document.body
      )}

      <style>{`
        @media (min-width: 640px) {
          .bornes-modal-overlay { align-items: center !important; padding: 24px !important; }
          .bornes-modal-card { border-radius: var(--radius-lg) !important; }
        }
      `}</style>
    </div>
  );
}
