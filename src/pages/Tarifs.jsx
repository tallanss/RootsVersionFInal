import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Tag, Star, Phone, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';
import EditableBlock from '../components/admin/EditableBlock';

const Tarifs = () => {
  const { content, updateContent } = useContent();
  const [selectedPlanId, setSelectedPlanId] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  React.useEffect(() => {
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
        '2 heures d\'animation',
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
        '3 heures d\'animation',
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
      id: 'custom',
      name: 'Sur-Mesure',
      price: 'Sur devis',
      isCustom: true,
      desc: 'Pour les événements d\'exception qui méritent une prestation unique.',
      features: [
        'Durée illimitée',
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
    { id: 'extra_hour', name: 'Heure supplémentaire', price: 49, desc: 'Au-delà de la durée incluse' },
    { id: 'guestbook', name: 'Livre d\'or Premium', price: 39, desc: 'Avec collages et stylos' },
    { id: 'usb', name: 'Clé USB souvenirs', price: 15, desc: 'Toutes les photos en HD' },
    { id: 'branding', name: 'Branding Écran', price: 29, desc: 'Votre logo sur l\'interface' },
  ];

  const toggleOption = (id) => {
    setSelectedOptions(prev => 
      prev.includes(id) ? prev.filter(opt => opt !== id) : [...prev, id]
    );
  };

  const calculateTotal = () => {
    if (selectedPlanId === null) return 0;
    const plan = plans[selectedPlanId];
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

      {/* PRICING CARDS */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <div className="pricing-grid">
          {plans.map((plan, i) => {
            return (
              <FadeIn direction="up" delay={i * 0.15} key={plan.id}>
                <div className="pricing-wrapper" style={{ position: 'relative' }}>
                  {plan.featured ? (
                    <div className="animated-border-wrapper">
                      <div className={`pricing-card featured ${isSelected(i) ? 'selected' : ''}`}>
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
                        </ul>

                        <button 
                          onClick={() => setSelectedPlanId(isSelected(i) ? null : i)}
                          className={isSelected(i) ? 'btn-primary' : 'btn-secondary'} 
                          style={{ 
                            width: '100%', 
                            background: isSelected(i) ? 'var(--bg-dark)' : '',
                            color: isSelected(i) ? '#fff' : '',
                            border: isSelected(i) ? 'none' : '1px solid var(--border-medium)',
                            marginTop: '16px'
                          }}
                        >
                          {isSelected(i) ? 'Pack sélectionné ✓' : (plan.isCustom ? 'Demander un Devis' : 'Choisir ce pack')}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className={`pricing-card ${isSelected(i) ? 'selected' : ''}`}>
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
                      </ul>

                      <button 
                        onClick={() => setSelectedPlanId(isSelected(i) ? null : i)}
                        className={isSelected(i) ? 'btn-primary' : 'btn-secondary'} 
                        style={{ 
                          width: '100%', 
                          background: isSelected(i) ? 'var(--bg-dark)' : '',
                          color: isSelected(i) ? '#fff' : '',
                          border: isSelected(i) ? 'none' : '1px solid var(--border-medium)',
                          marginTop: '16px'
                        }}
                      >
                        {isSelected(i) ? 'Pack sélectionné ✓' : (plan.isCustom ? 'Demander un Devis' : 'Choisir ce pack')}
                      </button>
                    </div>
                  )}
                </div>
              </FadeIn>
            );
          })}
        </div>
      </section>

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
