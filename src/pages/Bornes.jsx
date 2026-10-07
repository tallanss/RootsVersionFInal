import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Camera, ArrowRight } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import PremiumImage from '../components/PremiumImage';
import FadeIn from '../components/FadeIn';
import { priceToNumber, formatEuro, machinesWithSlugs } from '../utils/galleryFormat';

// Page publique « Nos bornes » : liste toutes les bornes (machines) visibles du
// CMS. Chaque carte mène à la page dédiée de la borne (/nos-bornes/:slug).
// Tout vient du module admin « Machines » — rien n'est codé en dur ici.
export default function Bornes() {
  const { content } = useContent();

  const machines = useMemo(
    () => machinesWithSlugs((content.machines || []).filter((m) => m.visible !== false)),
    [content.machines]
  );

  const entryBase = useMemo(() => {
    const bases = (content.pricing_plans || [])
      .map((p) => priceToNumber(p.price))
      .filter((n) => n > 0);
    return bases.length > 0 ? Math.min(...bases) : 0;
  }, [content.pricing_plans]);

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
              return (
                <Link
                  key={m.id}
                  to={`/nos-bornes/${m.slug}`}
                  aria-label={`Voir la borne ${m.name}`}
                  style={{
                    display: 'flex', flexDirection: 'column', textAlign: 'left', textDecoration: 'none',
                    borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)',
                    background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)',
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
                </Link>
              );
            })}
          </div>
        )}
      </section>
      </FadeIn>
    </div>
  );
}
