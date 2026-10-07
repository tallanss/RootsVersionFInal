import { useMemo } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Camera, ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useContent } from '../context/ContentContext';
import PremiumImage from '../components/PremiumImage';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { priceToNumber, formatEuro, machinesWithSlugs } from '../utils/galleryFormat';

// Page dédiée d'une borne : /nos-bornes/:slug. Remplace l'ancienne modale.
// Contenu 100 % piloté par le module admin « Machines ». Slug introuvable /
// borne masquée → redirection vers /nos-bornes.
export default function BorneDetail() {
  const { slug } = useParams();
  const { content } = useContent();

  const machines = useMemo(
    () => machinesWithSlugs((content.machines || []).filter((m) => m.visible !== false)),
    [content.machines]
  );
  const machine = useMemo(() => machines.find((m) => m.slug === slug) || null, [machines, slug]);

  const entryBase = useMemo(() => {
    const bases = (content.pricing_plans || [])
      .map((p) => priceToNumber(p.price))
      .filter((n) => n > 0);
    return bases.length > 0 ? Math.min(...bases) : 0;
  }, [content.pricing_plans]);

  // Borne introuvable (slug inexistant, masquée, ou données pas encore chargées
  // mais au moins une machine présente) → on renvoie vers la liste.
  if (!machine) {
    if ((content.machines || []).length === 0) return null; // en attente du contenu
    return <Navigate to="/nos-bornes" replace />;
  }

  const supp = Number(machine.supplement) || 0;
  const allIn = entryBase > 0 ? entryBase + supp : null;

  return (
    <div className="animate-in">
      <Helmet>
        <title>{`${machine.name} — Borne photo à louer | PhotoRoots`}</title>
        <meta name="description" content={(machine.description || `Louez la borne ${machine.name} pour votre événement en Seine-Maritime.`).slice(0, 160)} />
        <link rel="canonical" href={`https://photoroots.fr/nos-bornes/${machine.slug}`} />
        <meta property="og:type" content="product" />
        <meta property="og:url" content={`https://photoroots.fr/nos-bornes/${machine.slug}`} />
        <meta property="og:title" content={`${machine.name} — Borne photo à louer | PhotoRoots`} />
        <meta property="og:description" content={(machine.description || `Louez la borne ${machine.name} pour votre événement.`).slice(0, 160)} />
        {machine.image && <meta property="og:image" content={machine.image} />}
        <meta property="og:locale" content="fr_FR" />
      </Helmet>

      <FadeIn direction="up">
      <section className="container" style={{ padding: '20px 24px 40px' }}>
        <Link to="/nos-bornes" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)', fontSize: '14px', fontWeight: 700, textDecoration: 'none', marginBottom: '16px' }}>
          <ArrowLeft size={15} /> Toutes nos bornes
        </Link>

        {/* Image principale (hauteur maîtrisée pour ne pas créer un grand vide) */}
        <div style={{ position: 'relative', borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-light)', background: 'var(--bg-secondary)', height: 'clamp(220px, 42vh, 420px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {machine.image
            ? <PremiumImage src={machine.image} alt={machine.name} style={{ width: '100%', height: '100%' }} />
            : <Camera size={46} color="var(--text-light)" />}
          {supp > 0 && (
            <span style={{ position: 'absolute', top: '12px', right: '12px', background: 'var(--primary)', color: '#fff', fontSize: '12px', fontWeight: 800, padding: '5px 12px', borderRadius: '999px' }}>+{formatEuro(supp)}€</span>
          )}
        </div>

        {/* En-tête */}
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap', marginTop: '20px' }}>
          <h1 style={{ fontSize: 'clamp(26px, 5vw, 34px)', fontWeight: 900, color: 'var(--text-main)', margin: 0 }}>{machine.name}</h1>
          <span style={{ fontSize: '14px', fontWeight: 800, color: supp > 0 ? 'var(--primary)' : 'var(--text-muted)' }}>
            {supp > 0 ? `Supplément +${formatEuro(supp)}€` : 'Sans supplément'}
          </span>
        </div>

        {machine.description && (
          <p style={{ fontSize: '16px', color: 'var(--text-main)', lineHeight: 1.65, margin: '14px 0 0' }}>{machine.description}</p>
        )}
        {machine.details && (
          <p style={{ fontSize: '15px', color: 'var(--text-muted)', lineHeight: 1.7, margin: '14px 0 0', whiteSpace: 'pre-line' }}>{machine.details}</p>
        )}

        {/* Prix tout compris */}
        {allIn != null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '24px 0 0', padding: '16px 18px', borderRadius: 'var(--radius-md)', background: 'var(--bg-secondary)', border: '1px solid var(--border-light)' }}>
            <CheckCircle2 size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
            <span style={{ fontSize: '15px', color: 'var(--text-main)' }}>
              Tout compris, dès <strong style={{ color: 'var(--primary)', fontSize: '18px' }}>{formatEuro(allIn)}€</strong> <span style={{ color: 'var(--text-muted)' }}>(pack + borne)</span>
            </span>
          </div>
        )}

        {/* CTA */}
        <div style={{ marginTop: '24px', maxWidth: '380px' }}>
          <AnimatedButton
            to={`/contact?mode=devis&machine=${machine.id}`}
            className="btn-primary"
            style={{ width: '100%' }}
            aria-label={`Réserver la borne ${machine.name}`}
          >
            Réserver cette borne <ArrowRight size={16} />
          </AnimatedButton>
        </div>
      </section>
      </FadeIn>
    </div>
  );
}
