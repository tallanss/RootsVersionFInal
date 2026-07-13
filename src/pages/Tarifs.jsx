import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Tag, Star, Phone, X, ArrowRight } from 'lucide-react';
import { haptic } from '../hooks/useHaptic';
import { Helmet } from 'react-helmet-async';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import EditableBlock from '../components/admin/EditableBlock';
import { useAdmin } from '../context/AdminContext';
import { formatPrice, priceToNumber } from '../utils/galleryFormat';

/* ── Helper : formate l'affichage du prix de façon robuste ──
   - Prix numérique (ex: "249" ou 249)      → "249€" taille normale
   - Prix déjà suffixé (ex: "249€")          → "249€" taille normale
   - Prix textuel   (ex: "Sur devis")        → texte tel quel, taille réduite
   Rend l'affichage résistant aux paramétrages CMS incohérents (ex: isCustom
   activé par erreur sur un pack à prix numérique).
*/
const PriceDisplay = ({ price }) => {
  const raw = String(price ?? '').trim();
  // Prix numérique ou déjà suffixé "€" → taille normale.
  // Prix purement textuel (ex: "Sur devis") → taille réduite.
  const isNumericOrEuro = /^\d/.test(raw) || raw.includes('€');
  return (
    <div className="pricing-price" style={isNumericOrEuro ? undefined : { fontSize: '28px' }}>
      {formatPrice(price)}
    </div>
  );
};

/* ── Plan Comparator ──
   Compares ALL plans (excluding isCustom ones). The table is N+1 columns wide:
   - 1 sticky feature-label column
   - N plan columns (header + feature rows + CTA)
   The plan with featured:true gets the gold-tinted column and the "POPULAIRE" badge.
*/
const PlanComparator = ({ plans, onSelect }) => {
  // Exclude custom (quote-only) plans — they have no fixed feature grid
  // Un pack apparaît dans le comparateur dès qu'il a des fonctionnalités
  // OU un prix numérique. On n'exclut que les vrais "sur devis" (aucune
  // feature ET prix non numérique). Cela évite qu'un pack populaire marqué
  // isCustom par erreur dans le CMS disparaisse du tableau.
  const isComparable = (p) => {
    const hasFeatures = Array.isArray(p.features) && p.features.length > 0;
    const numericPrice = /^\s*\d/.test(String(p.price ?? ''));
    return hasFeatures || numericPrice;
  };
  const comparablePlans = (plans || []).filter(isComparable);

  if (comparablePlans.length === 0) return null;

  // Build the union of all feature labels across compared plans
  const allFeatureLabels = [
    ...new Set(
      comparablePlans.flatMap(p => [
        ...(p.features || []),
        ...(p.excluded || []),
      ])
    )
  ];

  const n = comparablePlans.length;
  // Sticky 180px label column + equal-width plan columns. Min plan column 130px so 4+ cols
  // overflow horizontally rather than crushing content.
  const labelColWidth = 180;
  const planColMinWidth = 130;
  const gridTemplate = `${labelColWidth}px repeat(${n}, minmax(${planColMinWidth}px, 1fr))`;

  const stickyLabelStyle = {
    position: 'sticky',
    left: 0,
    background: 'var(--bg-card)',
    zIndex: 1,
  };

  const planColBg = (plan) => plan.featured ? 'rgba(197,160,89,0.04)' : 'transparent';

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
      <div style={{ overflowX: 'auto' }}>
        <div style={{ minWidth: `${labelColWidth + n * planColMinWidth}px` }}>
          {/* Header row */}
          <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ ...stickyLabelStyle, padding: '16px 14px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Inclus</div>
            {comparablePlans.map((plan) => (
              <div
                key={plan.id}
                style={{
                  padding: '16px 14px',
                  textAlign: 'center',
                  borderLeft: '1px solid var(--border-light)',
                  background: planColBg(plan),
                }}
              >
                {plan.featured && (
                  <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', marginBottom: '2px' }}>⭐ POPULAIRE</div>
                )}
                <div style={{ fontSize: '13px', fontWeight: 800 }}>{plan.name}</div>
                <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>{formatPrice(plan.price)}</div>
              </div>
            ))}
          </div>

          {/* Feature rows */}
          {allFeatureLabels.map((label, i) => {
            const rowBg = i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)';
            return (
              <div
                key={label}
                style={{
                  display: 'grid', gridTemplateColumns: gridTemplate,
                  borderBottom: i < allFeatureLabels.length - 1 ? '1px solid var(--border-light)' : 'none',
                  background: rowBg,
                }}
              >
                <div style={{ ...stickyLabelStyle, background: rowBg === 'transparent' ? 'var(--bg-card)' : 'var(--bg-card)', padding: '12px 14px', fontSize: '13px', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>{label}</div>
                {comparablePlans.map((plan) => {
                  const has = plan.features?.includes(label) ?? false;
                  return (
                    <div
                      key={plan.id}
                      style={{
                        padding: '12px 14px',
                        textAlign: 'center',
                        borderLeft: '1px solid var(--border-light)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: plan.featured ? 'rgba(197,160,89,0.03)' : 'transparent',
                      }}
                    >
                      {has
                        ? <CheckCircle2 size={18} color="#22c55e" />
                        : <X size={16} color="var(--text-muted)" strokeWidth={2.5} />
                      }
                    </div>
                  );
                })}
              </div>
            );
          })}

          {/* CTA row */}
          <div style={{ display: 'grid', gridTemplateColumns: gridTemplate, borderTop: '1px solid var(--border-light)', padding: '16px 14px', gap: '8px' }}>
            <div style={stickyLabelStyle} />
            {comparablePlans.map((plan) => (
              <div key={plan.id} style={{ paddingLeft: '14px' }}>
                <button
                  onClick={() => onSelect(plan.id)}
                  className={plan.featured ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    width: '100%',
                    fontSize: '12px',
                    padding: '10px 8px',
                    ...(plan.featured ? {} : { border: '1px solid var(--border-medium)' }),
                  }}
                >
                  Choisir ce pack
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Tarifs = () => {
  const { content, updateContent } = useContent();
  const { isAdminMode } = useAdmin();
  const location = useLocation();
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [compareMode, setCompareMode] = useState(false);
  const [prestationView, setPrestationView] = useState('photobooth'); // 'photobooth' | slug produit

  // Handle pre-selection from URL (e.g. /tarifs?pack=premium)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pack = params.get('pack');
    if (pack) {
      // Dérive dynamiquement les packs valides depuis les plans réels
      // (CMS ou défauts) pour que tout pack défini soit deep-linkable.
      const activePlans = content.pricing_plans || defaultPlans;
      const validPacks = activePlans.map(p => String(p.id).toLowerCase());
      if (validPacks.includes(pack.toLowerCase())) {
        setSelectedPlanId(pack.toLowerCase());
        // Small delay to ensure render is complete before scrolling
        setTimeout(() => {
          const element = document.querySelector('.pricing-grid');
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 100);
      }
    }
  }, [location]);

  useEffect(() => {
    if (selectedPlanId !== null) {
      document.body.classList.add('has-price-bar');
    } else {
      document.body.classList.remove('has-price-bar');
    }
    return () => document.body.classList.remove('has-price-bar');
  }, [selectedPlanId]);

  const defaultPlans = [
    {
      id: 'essentiel',
      name: 'Essentiel',
      price: '189',
      desc: 'Parfait pour les petits événements et les fêtes entre amis.',
      features: [
        'Photos illimitées',
        'Accessoires & props fun',
        'Livraison & installation',
        'Galerie en ligne',
      ],
      excluded: ['Impressions sur place', 'Personnalisation complète', 'Écran de diffusion'],
      featured: false,
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '289',
      desc: 'Notre formule la plus populaire pour les mariages et grands événements.',
      features: [
        'Photos illimitées',
        'Impressions illimitées sur place',
        'Personnalisation totale (cadres, fonds)',
        'Accessoires premium',
        'Écran de diffusion',
        'Livraison & installation',
        'Galerie en ligne HD',
      ],
      excluded: [],
      featured: true,
    },
    {
      id: 'excellence',
      name: 'Excellence',
      price: '389',
      desc: 'La formule complète pour les mariages et événements d\'entreprise haut de gamme.',
      features: [
        'Photos illimitées',
        'Impressions illimitées sur place',
        'Personnalisation totale (cadres, fonds)',
        'Accessoires premium',
        'Écran de diffusion',
        'Livre d\'or Premium offert',
        'Branding personnalisé complet',
        'Technicien dédié',
        'Livraison & installation',
        'Galerie en ligne HD',
      ],
      excluded: [],
      featured: false,
    },
    {
      id: 'custom',
      name: 'Sur-Mesure',
      price: 'Sur devis',
      isCustom: true,
      desc: 'Pour les événements d\'exception qui méritent une prestation unique.',
      features: [
        'Tout le Premium inclus',
        'Branding personnalisé complet',
        'Animations vidéo sur mesure',
        'Technicien dédié',
        'Multi-impressions (formats spéciaux)',
        'Livraison France entière',
      ],
      excluded: [],
      featured: false,
    },
  ];

  const plans = content.pricing_plans || defaultPlans;

  // Prestations actives (produits visibles) → pour le filtre de la page Tarifs.
  const activeProducts = (content.products || []).filter((p) => p.visible !== false);

  // Options à la carte gérées via le CMS (dashboard → « Options à louer »).
  const options = (content.addons || []).filter(o => o.enabled !== false);

  const toggleOption = (id) => {
    haptic(8);
    setSelectedOptions(prev =>
      prev.includes(id) ? prev.filter(opt => opt !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    if (selectedPlanId === null) return 0;
    const plan = plans.find(p => p.id === selectedPlanId);
    if (!plan) return 0;
    const planPrice = priceToNumber(plan.price);
    const optionsPrice = selectedOptions.reduce((total, optId) => {
      const option = options.find(o => o.id === optId);
      return total + (option ? (Number(option.price) || 0) : 0);
    }, 0);
    return planPrice + optionsPrice;
  };

  const isSelected = (id) => selectedPlanId === id;

  const offerSchema = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    serviceType: 'Location de photobooth',
    name: 'Formules location photobooth PhotoRoots',
    description: "Formules de location de photobooth PhotoRoots en Seine-Maritime : Essentiel, Premium, Excellence et Sur-Mesure, pour mariages, anniversaires et événements d'entreprise.",
    provider: {
      '@type': 'LocalBusiness',
      name: 'PhotoRoots',
      url: 'https://photoroots.fr',
      telephone: '+33603163621',
    },
    areaServed: {
      '@type': 'AdministrativeArea',
      name: 'Seine-Maritime, Normandie',
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: 99,
      highPrice: 389,
      priceCurrency: 'EUR',
      offerCount: 4,
    },
  };

  return (
    <div className="animate-in">
      <Helmet>
        <title>{content.tarifsSeoTitle || 'Prix Location Photobooth Le Havre & Rouen | Tarifs 2026'}</title>
        <meta name="description" content={content.tarifsSeoDesc || 'Découvrez nos formules Photobooth dès 189€ en Normandie. Mariage, Entreprise, Anniversaire. Impression illimitée, accessoires et livraison inclus.'} />
        <meta name="keywords" content={content.tarifsSeoKeywords || 'prix photobooth le havre, tarif photobooth normandie, location borne photo pas cher, devis photobooth rouen'} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://photoroots.fr/tarifs" />
        <meta property="og:title" content={content.tarifsSeoTitle || 'Prix Location Photobooth Le Havre & Rouen | Tarifs 2026'} />
        <meta property="og:description" content={content.tarifsSeoDesc || 'Découvrez nos formules Photobooth dès 189€ en Normandie. Mariage, Entreprise, Anniversaire. Impression illimitée, accessoires et livraison inclus.'} />
        <meta property="og:image" content="https://photoroots.fr/photobooth-hero.png" />
        <meta property="og:locale" content="fr_FR" />
        <meta property="og:site_name" content="PhotoRoots" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={content.tarifsSeoTitle || 'Prix Location Photobooth Le Havre & Rouen | Tarifs 2026'} />
        <meta name="twitter:description" content={content.tarifsSeoDesc || 'Découvrez nos formules Photobooth dès 189€ en Normandie. Mariage, Entreprise, Anniversaire. Impression illimitée, accessoires et livraison inclus.'} />
        <meta name="twitter:image" content="https://photoroots.fr/photobooth-hero.png" />
        <link rel="canonical" href="https://photoroots.fr/tarifs" />
        <script type="application/ld+json">{JSON.stringify(offerSchema)}</script>
      </Helmet>

      {/* HEADER */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <FadeIn direction="down" duration={0.8}>
        <div className="section-tag"><Tag size={14} /> Tarifs</div>
        </FadeIn>
        
        <EditableBlock
          label="Titre Page"
          modalTitle="Modifier le Titre"
          fields={[{ key: 'tarifsTitle', label: 'Titre', type: 'text', value: content.tarifsTitle || 'Qualité parfaite, budget aussi !' }]}
          onSave={(vals) => updateContent({ ...content, ...vals })}
        >
          <FadeIn direction="right" duration={0.8} delay={0.1}>
            <h1 className="section-title" style={{ fontSize: '32px' }}>{content.tarifsTitle || 'Qualité parfaite, budget aussi !'}</h1>
          </FadeIn>
        </EditableBlock>

        <EditableBlock
          label="Sous-titre Page"
          modalTitle="Modifier le Sous-titre"
          fields={[{ key: 'tarifsSubtitle', label: 'Sous-titre', type: 'textarea', value: content.tarifsSubtitle || 'Les meilleures offres de photobooth du marché. Haut de gamme, service professionnel, prix imbattable.' }]}
          onSave={(vals) => updateContent({ ...content, ...vals })}
        >
          <FadeIn direction="up" delay={0.2} duration={0.8}>
            <p className="section-subtitle">
              {content.tarifsSubtitle || 'Les meilleures offres de photobooth du marché. Haut de gamme, service professionnel, prix imbattable.'}
            </p>
          </FadeIn>
        </EditableBlock>
      </section>

      {/* FILTRE PRESTATION — n'apparaît que s'il existe une autre prestation active */}
      {activeProducts.length > 0 && (
        <section className="container" style={{ padding: '0 20px 12px' }}>
          <label className="form-label" style={{ display: 'block', marginBottom: '8px' }}>Voir les tarifs de :</label>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {[{ key: 'photobooth', label: 'Photobooth' }, ...activeProducts.map((p) => ({ key: p.slug, label: p.name }))].map((t) => {
              const active = prestationView === t.key;
              return (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => { haptic(8); setPrestationView(t.key); setSelectedPlanId(null); setSelectedOptions([]); }}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: '6px',
                    padding: '10px 16px', borderRadius: '999px', cursor: 'pointer', fontSize: '14px', fontWeight: 700,
                    background: active ? 'var(--primary)' : 'var(--bg-secondary)',
                    color: active ? '#fff' : 'var(--text-muted)',
                    border: active ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                    transition: 'all 0.2s',
                  }}
                >
                  {t.label}
                </button>
              );
            })}
          </div>
        </section>
      )}

      {prestationView === 'photobooth' && (<>
      {/* LIEN VERS LES OPTIONS À LOUER */}
      <section className="container" style={{ padding: '0 20px 8px' }}>
        <Link
          to="/options-a-louer"
          style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            background: 'var(--bg-secondary)', color: 'var(--primary)',
            border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-full)',
            padding: '10px 18px', fontSize: '14px', fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          <Tag size={15} /> Voir toutes les options à louer <ArrowRight size={15} />
        </Link>
      </section>

      {/* COMPARE TOGGLE */}
      <section className="container" style={{ padding: '0 20px 16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800 }}>Nos formules</h2>
          <button
            onClick={() => { haptic(8); setCompareMode(m => !m); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              background: compareMode ? 'var(--primary)' : 'var(--bg-secondary)',
              color: compareMode ? '#fff' : 'var(--text-muted)',
              border: `1px solid ${compareMode ? 'var(--primary)' : 'var(--border-medium)'}`,
              borderRadius: '20px', padding: '8px 14px',
              fontSize: '12px', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
          >
            <CheckCircle2 size={13} /> Comparer
          </button>
        </div>
      </section>

      {/* COMPARATOR TABLE */}
      {compareMode && (
        <section className="container" style={{ padding: '0 20px 32px' }}>
          <PlanComparator
            plans={plans}
            onSelect={(id) => { setSelectedPlanId(id); setCompareMode(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
          />
        </section>
      )}

      {/* PRICING CARDS */}
      {!compareMode && <section className="container" style={{ padding: '0 0 32px' }}>
        {/* Padding vertical : laisse respirer la carte "Populaire" agrandie (scale 1.04 desktop) sans qu'elle soit rognée par ses voisines */}
        <div className="pricing-grid" style={{ paddingTop: '12px', paddingBottom: '12px' }}>
          {plans.map((plan, i) => {
            return (
              <div key={plan.id} className="pricing-wrapper" style={{ position: 'relative' }}>
                  {plan.featured ? (
                    <div className="animated-border-wrapper">
                      <div
                        className={`pricing-card featured spotlight-card ${isSelected(plan.id) ? 'selected' : ''}`}
                        onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`); }}
                      >
                        {/* Badge "Populaire" renforcé (couvre le badge CSS ::before) */}
                        <div
                          style={{
                            position: 'absolute',
                            top: '12px',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            background: 'var(--primary)',
                            color: '#fff',
                            fontSize: '12px',
                            fontWeight: 800,
                            letterSpacing: '0.06em',
                            textTransform: 'uppercase',
                            padding: '5px 16px',
                            borderRadius: 'var(--radius-full)',
                            boxShadow: '0 4px 14px rgba(197,160,89,0.45)',
                            whiteSpace: 'nowrap',
                            zIndex: 2,
                          }}
                        >
                          <Star size={13} fill="#fff" color="#fff" strokeWidth={0} />
                          Populaire
                        </div>
                        <EditableBlock
                          label="Nom"
                          modalTitle="Nom de la formule"
                          fields={[{ key: 'name', label: 'Nom', type: 'text', value: plan.name }]}
                          onSave={(vals) => {
                            const newPlans = [...plans];
                            newPlans[i] = { ...newPlans[i], ...vals };
                            updateContent({ ...content, pricing_plans: newPlans });
                          }}
                        >
                          <div className="pricing-name">{plan.name}</div>
                        </EditableBlock>

                        <EditableBlock
                          label="Prix"
                          modalTitle="Prix de la formule"
                          fields={[{ key: 'price', label: 'Prix', type: 'text', value: plan.price }]}
                          onSave={(vals) => {
                            const newPlans = [...plans];
                            newPlans[i] = { ...newPlans[i], ...vals };
                            updateContent({ ...content, pricing_plans: newPlans });
                          }}
                        >
                          <PriceDisplay price={plan.price} />
                        </EditableBlock>

                        <EditableBlock
                          label="Desc"
                          modalTitle="Description courte"
                          fields={[{ key: 'desc', label: 'Description', type: 'textarea', value: plan.desc }]}
                          onSave={(vals) => {
                            const newPlans = [...plans];
                            newPlans[i] = { ...newPlans[i], ...vals };
                            updateContent({ ...content, pricing_plans: newPlans });
                          }}
                        >
                          <div className="pricing-desc">{plan.desc}</div>
                        </EditableBlock>

                        <ul className="pricing-features">
                          {plan.features.map((f, j) => (
                            <EditableBlock
                              key={j}
                              label="Point"
                              modalTitle="Modifier l'avantage"
                              fields={[{ key: 'text', label: 'Texte', type: 'text', value: f }]}
                              onSave={(vals) => {
                                const newPlans = plans.map((p, pIdx) =>
                                  pIdx !== i ? p : { ...p, features: p.features.map((f2, fIdx) => fIdx === j ? vals.text : f2) }
                                );
                                updateContent({ ...content, pricing_plans: newPlans });
                              }}
                              onDelete={() => {
                                const newPlans = plans.map((p, pIdx) =>
                                  pIdx !== i ? p : { ...p, features: p.features.filter((_, fIdx) => fIdx !== j) }
                                );
                                updateContent({ ...content, pricing_plans: newPlans });
                              }}
                              tag="li"
                            >
                              <span className="pricing-check"><CheckCircle2 size={14} /></span>
                              {f}
                            </EditableBlock>
                          ))}
                          {plan.excluded.map((f, j) => (
                            <EditableBlock
                              key={`ex-${j}`}
                              label="Excl."
                              modalTitle="Modifier l'exclusion"
                              fields={[{ key: 'text', label: 'Texte', type: 'text', value: f }]}
                              onSave={(vals) => {
                                const newPlans = plans.map((p, pIdx) =>
                                  pIdx !== i ? p : { ...p, excluded: p.excluded.map((f2, fIdx) => fIdx === j ? vals.text : f2) }
                                );
                                updateContent({ ...content, pricing_plans: newPlans });
                              }}
                              onDelete={() => {
                                const newPlans = plans.map((p, pIdx) =>
                                  pIdx !== i ? p : { ...p, excluded: p.excluded.filter((_, fIdx) => fIdx !== j) }
                                );
                                updateContent({ ...content, pricing_plans: newPlans });
                              }}
                              tag="li"
                              style={{ color: 'var(--text-light)', textDecoration: 'line-through' }}
                            >
                              <span className="pricing-check" style={{ background: 'var(--bg-card)', color: 'var(--text-light)' }}><X size={14} /></span>
                              {f}
                            </EditableBlock>
                          ))}
                          
                          {/* Add feature buttons */}
                          {isAdminMode && (
                            <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                              <button
                                className="btn-admin-add"
                                style={{ flex: 1, fontSize: '10px', padding: '4px' }}
                                onClick={() => {
                                  const newPlans = plans.map((p, pIdx) =>
                                    pIdx !== i ? p : { ...p, features: [...p.features, 'Nouvel avantage'] }
                                  );
                                  updateContent({ ...content, pricing_plans: newPlans });
                                }}
                              >+ Avantage</button>
                              <button
                                className="btn-admin-add"
                                style={{ flex: 1, fontSize: '10px', padding: '4px' }}
                                onClick={() => {
                                  const newPlans = plans.map((p, pIdx) =>
                                    pIdx !== i ? p : { ...p, excluded: [...p.excluded, 'Nouvelle exclusion'] }
                                  );
                                  updateContent({ ...content, pricing_plans: newPlans });
                                }}
                              >+ Exclusion</button>
                            </div>
                          )}
                        </ul>

                        <button 
                          onClick={() => { haptic(12); setSelectedPlanId(isSelected(plan.id) ? null : plan.id); }}
                          className={isSelected(plan.id) ? 'btn-primary' : 'btn-secondary'} 
                          style={{ 
                            width: '100%', 
                            background: isSelected(plan.id) ? 'var(--bg-dark)' : '',
                            color: isSelected(plan.id) ? '#fff' : '',
                            border: isSelected(plan.id) ? 'none' : '1px solid var(--border-medium)',
                            marginTop: '16px'
                          }}
                        >
                          {isSelected(plan.id) ? 'Pack sélectionné ✓' : 'Choisir ce pack'}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`pricing-card spotlight-card ${isSelected(plan.id) ? 'selected' : ''}`}
                      onMouseMove={(e) => { const r = e.currentTarget.getBoundingClientRect(); e.currentTarget.style.setProperty('--spot-x', `${e.clientX - r.left}px`); e.currentTarget.style.setProperty('--spot-y', `${e.clientY - r.top}px`); }}
                    >
                      <EditableBlock
                        label="Nom"
                        modalTitle="Nom de la formule"
                        fields={[{ key: 'name', label: 'Nom', type: 'text', value: plan.name }]}
                        onSave={(vals) => {
                          const newPlans = [...plans];
                          newPlans[i] = { ...newPlans[i], ...vals };
                          updateContent({ ...content, pricing_plans: newPlans });
                        }}
                      >
                        <div className="pricing-name">{plan.name}</div>
                      </EditableBlock>

                      <EditableBlock
                        label="Prix"
                        modalTitle="Prix de la formule"
                        fields={[{ key: 'price', label: 'Prix', type: 'text', value: plan.price }]}
                        onSave={(vals) => {
                          const newPlans = [...plans];
                          newPlans[i] = { ...newPlans[i], ...vals };
                          updateContent({ ...content, pricing_plans: newPlans });
                        }}
                      >
                        <PriceDisplay price={plan.price} />
                      </EditableBlock>

                      <EditableBlock
                        label="Desc"
                        modalTitle="Description courte"
                        fields={[{ key: 'desc', label: 'Description', type: 'textarea', value: plan.desc }]}
                        onSave={(vals) => {
                          const newPlans = [...plans];
                          newPlans[i] = { ...newPlans[i], ...vals };
                          updateContent({ ...content, pricing_plans: newPlans });
                        }}
                      >
                        <div className="pricing-desc">{plan.desc}</div>
                      </EditableBlock>

                      <ul className="pricing-features">
                        {plan.features.map((f, j) => (
                          <EditableBlock
                            key={j}
                            label="Point"
                            modalTitle="Modifier l'avantage"
                            fields={[{ key: 'text', label: 'Texte', type: 'text', value: f }]}
                            onSave={(vals) => {
                              const newPlans = [...plans];
                              newPlans[i].features[j] = vals.text;
                              updateContent({ ...content, pricing_plans: newPlans });
                            }}
                            onDelete={() => {
                              const newPlans = [...plans];
                              newPlans[i].features = newPlans[i].features.filter((_, idx) => idx !== j);
                              updateContent({ ...content, pricing_plans: newPlans });
                            }}
                          >
                            <li>
                              <span className="pricing-check"><CheckCircle2 size={14} /></span>
                              {f}
                            </li>
                          </EditableBlock>
                        ))}
                        {plan.excluded.map((f, j) => (
                          <EditableBlock
                            key={`ex-${j}`}
                            label="Excl."
                            modalTitle="Modifier l'exclusion"
                            fields={[{ key: 'text', label: 'Texte', type: 'text', value: f }]}
                            onSave={(vals) => {
                              const newPlans = [...plans];
                              newPlans[i].excluded[j] = vals.text;
                              updateContent({ ...content, pricing_plans: newPlans });
                            }}
                            onDelete={() => {
                              const newPlans = [...plans];
                              newPlans[i].excluded = newPlans[i].excluded.filter((_, idx) => idx !== j);
                              updateContent({ ...content, pricing_plans: newPlans });
                            }}
                          >
                            <li style={{ color: 'var(--text-light)', textDecoration: 'line-through' }}>
                              <span className="pricing-check" style={{ background: 'var(--bg-card)', color: 'var(--text-light)' }}><X size={14} /></span>
                              {f}
                            </li>
                          </EditableBlock>
                        ))}

                        {/* Add feature buttons */}
                        {isAdminMode && (
                          <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                            <button
                              className="btn-admin-add"
                              style={{ flex: 1, fontSize: '10px', padding: '4px' }}
                              onClick={() => {
                                const newPlans = [...plans];
                                newPlans[i].features.push('Nouvel avantage');
                                updateContent({ ...content, pricing_plans: newPlans });
                              }}
                            >+ Avantage</button>
                            <button
                              className="btn-admin-add"
                              style={{ flex: 1, fontSize: '10px', padding: '4px' }}
                              onClick={() => {
                                const newPlans = [...plans];
                                newPlans[i].excluded.push('Nouvelle exclusion');
                                updateContent({ ...content, pricing_plans: newPlans });
                              }}
                            >+ Exclusion</button>
                          </div>
                        )}
                      </ul>

                      <button 
                        onClick={() => { haptic(12); setSelectedPlanId(isSelected(plan.id) ? null : plan.id); }}
                        className={isSelected(plan.id) ? 'btn-primary' : 'btn-secondary'} 
                        style={{ 
                          width: '100%', 
                          background: isSelected(plan.id) ? 'var(--bg-dark)' : '',
                          color: isSelected(plan.id) ? '#fff' : '',
                          border: isSelected(plan.id) ? 'none' : '1px solid var(--border-medium)',
                          marginTop: '16px'
                        }}
                      >
                        {isSelected(plan.id) ? 'Pack sélectionné ✓' : 'Choisir ce pack'}
                      </button>
                    </div>
                  )}
                </div>
            );
          })}
        </div>
      </section>}

      {/* OPTIONS ADD-ONS */}
      {selectedPlanId !== null && options.length > 0 && !plans.find(p => p.id === selectedPlanId)?.isCustom && (
        <section className="container" style={{ padding: '0 20px 24px' }}>
          <div style={{
            background: 'var(--bg-card)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-light)',
            overflow: 'hidden',
          }}>
            <div style={{ padding: '20px 20px 16px', borderBottom: '1px solid var(--border-light)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 800, marginBottom: '4px' }}>Personnalisez votre pack</h3>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Ajoutez des options à la carte pour compléter votre expérience.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {options.map((opt, i) => {
                const active = selectedOptions.includes(opt.id);
                return (
                  <div
                    key={opt.id}
                    onClick={() => toggleOption(opt.id)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      padding: '16px 20px',
                      borderBottom: i < options.length - 1 ? '1px solid var(--border-light)' : 'none',
                      cursor: 'pointer',
                      background: active ? 'rgba(197,160,89,0.05)' : 'transparent',
                      transition: 'background 0.2s',
                    }}
                  >
                    <div style={{
                      width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                      border: `2px solid ${active ? 'var(--primary)' : 'var(--border-medium)'}`,
                      background: active ? 'var(--primary)' : 'transparent',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}>
                      {active && <CheckCircle2 size={13} color="#fff" strokeWidth={3} />}
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{opt.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                    <div style={{ fontWeight: 800, fontSize: '15px', color: active ? 'var(--primary)' : 'var(--text-main)', flexShrink: 0 }}>
                      +{opt.price}€
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* STICKY PRICE BAR */}
      {selectedPlanId !== null && (
        <div className="sticky-price-bar">
          <div style={{ flexGrow: 1 }}>
            <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '2px' }}>
              {plans.find(p => p.id === selectedPlanId)?.name}{selectedOptions.length > 0 ? ` + ${selectedOptions.length} option${selectedOptions.length > 1 ? 's' : ''}` : ''}
            </div>
            <div style={{ fontSize: '22px', fontWeight: 900, color: 'var(--primary)', lineHeight: 1 }}>
              {plans.find(p => p.id === selectedPlanId)?.isCustom ? 'Sur devis' : `${calculateTotal()}€`}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button
              onClick={() => { setSelectedPlanId(null); setSelectedOptions([]); }}
              style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', padding: '8px', cursor: 'pointer', display: 'flex' }}
            >
              <X size={18} />
            </button>
            <AnimatedButton to="/contact" className="btn-primary" style={{ width: 'auto', padding: '10px 20px', fontSize: '14px', borderRadius: 'var(--radius-full)' }}>
              Obtenir un devis →
            </AnimatedButton>
          </div>
        </div>
      )}
      </>)}

      {/* VUE PRESTATION (produit sélectionné) — détail du prix */}
      {prestationView !== 'photobooth' && (() => {
        const prod = activeProducts.find((p) => p.slug === prestationView);
        if (!prod) return null;
        return (
          <section className="container" style={{ padding: '0 20px 32px' }}>
            <div style={{ borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', background: 'var(--bg-card)', boxShadow: 'var(--shadow-md)', overflow: 'hidden' }}>
              {prod.image && (
                <div style={{ aspectRatio: '16 / 9', overflow: 'hidden', background: 'var(--bg-secondary)' }}>
                  <img src={prod.image} alt={prod.name} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                </div>
              )}
              <div style={{ padding: '24px' }}>
                {prod.badge && (
                  <span style={{ display: 'inline-block', background: 'var(--primary)', color: '#fff', fontSize: '11px', fontWeight: 800, padding: '4px 10px', borderRadius: '999px', marginBottom: '8px' }}>{prod.badge}</span>
                )}
                <h2 style={{ fontSize: '22px', fontWeight: 900, margin: '0 0 2px', color: 'var(--text-main)' }}>{prod.name}</h2>
                {prod.tagline && <p style={{ color: 'var(--text-muted)', fontSize: '14px', margin: 0 }}>{prod.tagline}</p>}
                <div style={{ fontSize: '34px', fontWeight: 900, color: 'var(--primary)', margin: '14px 0 2px', lineHeight: 1 }}>
                  {prod.priceFrom != null ? `À partir de ${prod.priceFrom}€` : 'Sur devis'}
                </div>
                {prod.description && <p style={{ fontSize: '15px', lineHeight: 1.6, color: 'var(--text-main)', whiteSpace: 'pre-line', margin: '10px 0 0' }}>{prod.description}</p>}

                {prod.features?.length > 0 && (
                  <div style={{ margin: '20px 0 0', display: 'grid', gap: '10px' }}>
                    <p style={{ fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em', color: 'var(--text-light)', margin: 0 }}>Ce qui est inclus</p>
                    {prod.features.map((f, i) => (
                      <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                        <span style={{ flexShrink: 0, width: '22px', height: '22px', borderRadius: '50%', background: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '1px' }}>
                          <CheckCircle2 size={13} color="var(--primary)" />
                        </span>
                        <span style={{ fontSize: '15px', color: 'var(--text-main)', lineHeight: 1.5 }}>{f}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', marginTop: '22px' }}>
                  <AnimatedButton
                    to={`/contact?mode=devis&prestation=${encodeURIComponent(prod.slug)}`}
                    className="btn-primary"
                    style={{ width: 'auto', padding: '14px 28px', fontWeight: 800 }}
                  >
                    Demander un devis <ArrowRight size={18} />
                  </AnimatedButton>
                  <Link to={`/prestations/${prod.slug}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', fontWeight: 700, fontSize: '14px', textDecoration: 'none' }}>
                    Voir la page complète <ArrowRight size={15} />
                  </Link>
                </div>
              </div>
            </div>
          </section>
        );
      })()}

      {/* TRUST */}
      <FadeIn direction="up" delay={0.4}>
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <EditableBlock
          label="Garantie"
          modalTitle="Modifier la Garantie"
          fields={[
            { key: 'trustTitle', label: 'Titre', type: 'text', value: content.trustTitle || 'Garantie satisfaction' },
            { key: 'trustText', label: 'Texte', type: 'textarea', value: content.trustText || "Nous ne trouverez pas de meilleur rapport qualité-prix ! Plus de 100 événements réussis avec une note de 5/5. Si vous n'êtes pas satisfait, nous trouvons une solution." }
          ]}
          onSave={(vals) => updateContent({ ...content, ...vals })}
        >
          <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <Star size={18} fill="#fbbf24" color="#fbbf24" />
              <span style={{ fontWeight: 700, fontSize: '15px' }}>{content.trustTitle || 'Garantie satisfaction'}</span>
            </div>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              {content.trustText || "Nous ne trouverez pas de meilleur rapport qualité-prix ! Plus de 100 événements réussis avec une note de 5/5. Si vous n'êtes pas satisfait, nous trouvons une solution."}
            </p>
          </div>
        </EditableBlock>
      </section>
      </FadeIn>

      {/* CTA */}
      <FadeIn direction="up" delay={0.6}>
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div className="cta-section">
          <EditableBlock
            label="Titre CTA"
            modalTitle="Modifier le Titre CTA"
            fields={[{ key: 'tarifsCtaTitle', label: 'Titre', type: 'text', value: content.tarifsCtaTitle || "Besoin d'un devis personnalisé ?" }]}
            onSave={(vals) => updateContent({ ...content, ...vals })}
          >
            <h2>{content.tarifsCtaTitle || "Besoin d'un devis personnalisé ?"}</h2>
          </EditableBlock>

          <EditableBlock
            label="Texte CTA"
            modalTitle="Modifier le Texte CTA"
            fields={[{ key: 'tarifsCtaDesc', label: 'Texte', type: 'text', value: content.tarifsCtaDesc || 'Décrivez votre événement et recevez une proposition adaptée sous 24h.' }]}
            onSave={(vals) => updateContent({ ...content, ...vals })}
          >
            <p>{content.tarifsCtaDesc || 'Décrivez votre événement et recevez une proposition adaptée sous 24h.'}</p>
          </EditableBlock>

          <AnimatedButton to="/contact" className="btn-primary" style={{ background: '#fff', color: 'var(--bg-dark)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
            <Phone size={18} />
            Contactez-nous
          </AnimatedButton>
        </div>
      </section>
      </FadeIn>
    </div>
  );
};

export default Tarifs;
