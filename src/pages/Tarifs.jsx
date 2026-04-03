import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { CheckCircle2, Tag, Star, Phone, X, Sliders, Heart, Briefcase, Gift } from 'lucide-react';
import { haptic } from '../hooks/useHaptic';
import { Helmet } from 'react-helmet-async';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import EditableBlock from '../components/admin/EditableBlock';
import { useAdmin } from '../context/AdminContext';

/* ── Budget Estimator ── */
const EVENT_TYPES = [
  { id: 'mariage', label: 'Mariage', icon: Heart },
  { id: 'anniversaire', label: 'Anniversaire', icon: Gift },
  { id: 'entreprise', label: 'Entreprise', icon: Briefcase },
];

const BudgetEstimator = ({ plans }) => {
  const [eventType, setEventType] = useState('mariage');
  const [prints, setPrints] = useState(50);

  const essentiel = plans.find(p => p.id === 'essentiel');
  const premium = plans.find(p => p.id === 'premium');
  const baseEssentiel = parseInt(essentiel?.price) || 189;
  const basePremium = parseInt(premium?.price) || 289;

  // Essentiel : impressions à 0,50€/unité. Premium : illimitées incluses.
  const totalEssentiel = baseEssentiel + prints * 0.5;
  const totalPremium = basePremium;

  const recommended = totalEssentiel >= totalPremium || eventType === 'mariage' ? 'premium' : 'essentiel';

  return (
    <section className="container" style={{ padding: '0 20px 32px' }}>
      <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
          <Sliders size={18} color="var(--primary)" />
          <h2 style={{ fontSize: '17px', fontWeight: 800 }}>Estimez votre budget</h2>
        </div>

        {/* Event type */}
        <div style={{ marginBottom: '20px' }}>
          <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '10px' }}>
            Type d'événement
          </label>
          <div style={{ display: 'flex', gap: '8px' }}>
            {EVENT_TYPES.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setEventType(id)}
                style={{
                  flex: 1, padding: '10px 6px', borderRadius: '12px', border: 'none',
                  background: eventType === id ? 'var(--primary)' : 'var(--bg-secondary)',
                  color: eventType === id ? '#fff' : 'var(--text-muted)',
                  fontWeight: 700, fontSize: '12px', cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                  transition: 'all 0.2s ease',
                }}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Prints slider */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <label style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Impressions souhaitées
            </label>
            <span style={{ fontSize: '15px', fontWeight: 800, color: 'var(--primary)' }}>{prints}</span>
          </div>
          <input
            type="range" min={0} max={300} step={25} value={prints}
            onChange={e => setPrints(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--primary)', height: '4px', cursor: 'pointer' }}
          />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>
            <span>0</span><span>150</span><span>300</span>
          </div>
        </div>

        {/* Results */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {[
            { plan: essentiel, total: Math.round(totalEssentiel), id: 'essentiel', note: `${prints} impression${prints > 1 ? 's' : ''}` },
            { plan: premium, total: totalPremium, id: 'premium', note: 'impressions illimitées' },
          ].map(({ plan, total, id, note }) => (
            <div
              key={id}
              style={{
                borderRadius: '14px', padding: '16px',
                border: `2px solid ${recommended === id ? 'var(--primary)' : 'var(--border-light)'}`,
                background: recommended === id ? 'rgba(197,160,89,0.06)' : 'var(--bg-secondary)',
                position: 'relative', transition: 'all 0.3s ease',
              }}
            >
              {recommended === id && (
                <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', background: 'var(--primary)', color: '#fff', fontSize: '10px', fontWeight: 800, padding: '2px 10px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
                  Recommandé
                </div>
              )}
              <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>{plan?.name}</div>
              <div style={{ fontSize: '24px', fontWeight: 900, color: recommended === id ? 'var(--primary)' : 'var(--text-main)', lineHeight: 1 }}>
                {total}€
              </div>
              <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>{note}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '12px', textAlign: 'center' }}>
          Estimation indicative · 0,50€/impression pour Essentiel · options non incluses
        </p>
      </div>
    </section>
  );
};

/* ── Plan Comparator ── */
const PlanComparator = ({ plans, onSelect }) => {
  const essentiel = plans.find(p => p.id === 'essentiel');
  const premium = plans.find(p => p.id === 'premium');

  // Build feature rows dynamically from plan data
  const allFeatureLabels = [
    ...new Set([
      ...(essentiel?.features || []),
      ...(premium?.features || []),
      ...(essentiel?.excluded || []),
      ...(premium?.excluded || []),
    ])
  ];

  const dynamicFeatures = allFeatureLabels.map(label => ({
    label,
    essentiel: essentiel?.features?.includes(label) ?? false,
    premium: premium?.features?.includes(label) ?? false,
  }));

  return (
    <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-light)', overflow: 'hidden' }}>
      {/* Header row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderBottom: '1px solid var(--border-light)' }}>
        <div style={{ padding: '16px 14px', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>Inclus</div>
        <div style={{ padding: '16px 14px', textAlign: 'center', borderLeft: '1px solid var(--border-light)' }}>
          <div style={{ fontSize: '13px', fontWeight: 800 }}>{essentiel?.name}</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>{essentiel?.price}€</div>
        </div>
        <div style={{ padding: '16px 14px', textAlign: 'center', borderLeft: '1px solid var(--border-light)', background: 'rgba(197,160,89,0.04)' }}>
          <div style={{ fontSize: '10px', fontWeight: 800, color: 'var(--primary)', marginBottom: '2px' }}>⭐ POPULAIRE</div>
          <div style={{ fontSize: '13px', fontWeight: 800 }}>{premium?.name}</div>
          <div style={{ fontSize: '18px', fontWeight: 900, color: 'var(--primary)' }}>{premium?.price}€</div>
        </div>
      </div>

      {/* Feature rows */}
      {dynamicFeatures.map((f, i) => (
        <div
          key={i}
          style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
            borderBottom: i < dynamicFeatures.length - 1 ? '1px solid var(--border-light)' : 'none',
            background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.01)',
          }}
        >
          <div style={{ padding: '12px 14px', fontSize: '13px', color: 'var(--text-main)', display: 'flex', alignItems: 'center' }}>{f.label}</div>
          <div style={{ padding: '12px 14px', textAlign: 'center', borderLeft: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {typeof f.essentiel === 'boolean'
              ? f.essentiel
                ? <CheckCircle2 size={18} color="#22c55e" />
                : <X size={16} color="var(--text-muted)" strokeWidth={2.5} />
              : <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{f.essentiel}</span>
            }
          </div>
          <div style={{ padding: '12px 14px', textAlign: 'center', borderLeft: '1px solid var(--border-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(197,160,89,0.03)' }}>
            {typeof f.premium === 'boolean'
              ? f.premium
                ? <CheckCircle2 size={18} color="#22c55e" />
                : <X size={16} color="var(--text-muted)" strokeWidth={2.5} />
              : <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--primary)' }}>{f.premium}</span>
            }
          </div>
        </div>
      ))}

      {/* CTA row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', borderTop: '1px solid var(--border-light)', padding: '16px 14px', gap: '8px' }}>
        <div />
        <div style={{ borderLeft: '1px solid transparent', paddingLeft: '14px' }}>
          <button onClick={() => onSelect('essentiel')} className="btn-secondary" style={{ width: '100%', fontSize: '12px', padding: '10px 8px', border: '1px solid var(--border-medium)' }}>
            Choisir
          </button>
        </div>
        <div style={{ paddingLeft: '14px' }}>
          <button onClick={() => onSelect('premium')} className="btn-primary" style={{ width: '100%', fontSize: '12px', padding: '10px 8px' }}>
            Choisir
          </button>
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

  // Handle pre-selection from URL (e.g. /tarifs?pack=premium)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const pack = params.get('pack');
    if (pack) {
      // Find if valid pack
      const validPacks = ['essentiel', 'premium', 'excellence'];
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

  const options = [
    { id: 'guestbook', name: 'Livre d\'or Premium', price: 39, desc: 'Avec collages et stylos' },
    { id: 'usb', name: 'Clé USB souvenirs', price: 15, desc: 'Toutes les photos en HD' },
    { id: 'branding', name: 'Branding Écran', price: 29, desc: 'Votre logo sur l\'interface' },
  ];

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
    const planPrice = parseInt(plan.price) || 0;
    const optionsPrice = selectedOptions.reduce((total, optId) => {
      const option = options.find(o => o.id === optId);
      return total + (option ? option.price : 0);
    }, 0);
    return planPrice + optionsPrice;
  };

  const isSelected = (id) => selectedPlanId === id;

  return (
    <div className="animate-in">
      <Helmet>
        <title>{content.tarifsSeoTitle || 'Prix Location Photobooth Le Havre & Rouen | Tarifs 2026'}</title>
        <meta name="description" content={content.tarifsSeoDesc || 'Découvrez nos formules Photobooth dès 189€ en Normandie. Mariage, Entreprise, Anniversaire. Impression illimitée, accessoires et livraison inclus.'} />
        <meta name="keywords" content={content.tarifsSeoKeywords || 'prix photobooth le havre, tarif photobooth normandie, location borne photo pas cher, devis photobooth rouen'} />
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

      {/* BUDGET ESTIMATOR */}
      <BudgetEstimator plans={plans} />

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
        <div className="pricing-grid">
          {plans.map((plan, i) => {
            return (
              <div key={plan.id} className="pricing-wrapper" style={{ position: 'relative' }}>
                  {plan.featured ? (
                    <div className="animated-border-wrapper">
                      <div className={`pricing-card featured ${isSelected(plan.id) ? 'selected' : ''}`}>
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
                          {plan.isCustom ? (
                            <div className="pricing-price" style={{ fontSize: '28px' }}>{plan.price}</div>
                          ) : (
                            <div className="pricing-price">{plan.price}€</div>
                          )}
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
                          {isSelected(plan.id) ? 'Pack sélectionné ✓' : (plan.isCustom ? 'Demander un Devis' : 'Choisir ce pack')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`pricing-card ${isSelected(plan.id) ? 'selected' : ''}`}>
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
                        {plan.isCustom ? (
                          <div className="pricing-price" style={{ fontSize: '28px' }}>{plan.price}</div>
                        ) : (
                          <div className="pricing-price">{plan.price}€</div>
                        )}
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
                        {isSelected(plan.id) ? 'Pack sélectionné ✓' : (plan.isCustom ? 'Demander un Devis' : 'Choisir ce pack')}
                      </button>
                    </div>
                  )}
                </div>
            );
          })}
        </div>
      </section>}

      {/* OPTIONS ADD-ONS */}
      {selectedPlanId !== null && !plans.find(p => p.id === selectedPlanId)?.isCustom && (
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
              Réserver →
            </AnimatedButton>
          </div>
        </div>
      )}

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
