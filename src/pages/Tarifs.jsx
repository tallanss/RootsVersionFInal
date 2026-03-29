import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, ArrowRight, Tag, Star, Phone, X } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import AnimatedButton from '../components/AnimatedButton';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';

const Tarifs = () => {
  const { content } = useContent();
  const [selectedPlanId, setSelectedPlanId] = useState(null); // id: 0 (Essentiel), 1 (Premium)
  const [selectedOptions, setSelectedOptions] = useState([]);

  React.useEffect(() => {
    if (selectedPlanId !== null) {
      document.body.classList.add('has-price-bar');
    } else {
      document.body.classList.remove('has-price-bar');
    }
    return () => document.body.classList.remove('has-price-bar');
  }, [selectedPlanId]);

  const plans = [
    {
      name: 'Essentiel',
      price: content.pricing.essentiel.price,
      desc: content.pricing.essentiel.subtitle,
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
      name: 'Premium',
      price: content.pricing.premium.price,
      desc: content.pricing.premium.subtitle,
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
      name: 'Sur-Mesure',
      price: content.pricing.custom.price,
      isCustom: true,
      desc: content.pricing.custom.subtitle,
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
    const planPrice = parseInt(plans[selectedPlanId].price) || 0;
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
        <title>Prix Location Photobooth Le Havre & Rouen | Tarifs 2026</title>
        <meta name="description" content="Découvrez nos formules Photobooth dès 189€ en Normandie. Mariage, Entreprise, Anniversaire. Impression illimitée, accessoires et livraison inclus." />
        <meta name="keywords" content="prix photobooth le havre, tarif photobooth normandie, location borne photo pas cher, devis photobooth rouen" />
      </Helmet>

      {/* HEADER */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <FadeIn direction="down" duration={0.8}>
        <div className="section-tag"><Tag size={14} /> Tarifs</div>
        </FadeIn>
        <FadeIn direction="right" duration={0.8} delay={0.1}>
        <h1 className="section-title" style={{ fontSize: '32px' }}>Qualité parfaite, budget aussi !</h1>
        </FadeIn>
        <FadeIn direction="up" delay={0.2} duration={0.8}>
        <p className="section-subtitle">
          Les meilleures offres de photobooth du marché. Haut de gamme, service professionnel, prix imbattable.
        </p>
        </FadeIn>
      </section>

      {/* PRICING CARDS */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <div className="pricing-grid">
          {plans.map((plan, i) => {
            const cardContent = (
              <>
                <div className="pricing-name">{plan.name}</div>
                {plan.isCustom ? (
                  <div className="pricing-price" style={{ fontSize: '28px' }}>{plan.price}</div>
                ) : (
                  <div className="pricing-price">{plan.price}€</div>
                )}
                <div className="pricing-desc">{plan.desc}</div>
                <ul className="pricing-features">
                  {plan.features.map((f, j) => (
                    <li key={j}>
                      <span className="pricing-check"><CheckCircle2 size={14} /></span>
                      {f}
                    </li>
                  ))}
                  {plan.excluded.map((f, j) => (
                    <li key={`ex-${j}`} style={{ color: 'var(--text-light)', textDecoration: 'line-through' }}>
                      <span className="pricing-check" style={{ background: 'var(--bg-card)', color: 'var(--text-light)' }}><X size={14} /></span>
                      {f}
                    </li>
                  ))}
                </ul>
                <button 
                  onClick={() => setSelectedPlanId(isSelected(i) ? null : i)}
                  className={isSelected(i) ? 'btn-primary' : 'btn-secondary'} 
                  style={{ 
                    width: '100%', 
                    background: isSelected(i) ? 'var(--bg-dark)' : '',
                    color: isSelected(i) ? '#fff' : '',
                    border: isSelected(i) ? 'none' : '1px solid var(--border-medium)'
                  }}
                >
                  {isSelected(i) ? 'Pack sélectionné ✓' : (plan.isCustom ? 'Demander un Devis' : 'Choisir ce pack')}
                </button>
              </>
            );

            return (
              <FadeIn direction="up" delay={i * 0.15} key={i}>
                {plan.featured ? (
                  <div className="animated-border-wrapper">
                    <div className={`pricing-card featured ${isSelected(i) ? 'selected' : ''}`}>{cardContent}</div>
                  </div>
                ) : (
                  <div className={`pricing-card ${isSelected(i) ? 'selected' : ''}`}>{cardContent}</div>
                )}
              </FadeIn>
            );
          })}
        </div>
      </section>

      {/* OPTIONS SECTION */}
      {selectedPlanId !== null && plans[selectedPlanId].isCustom !== true && (
        <FadeIn direction="up">
        <section className="container" style={{ padding: '0 20px 40px' }}>
          <div style={{ padding: '24px', background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)', border: '1px solid var(--border-light)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '8px', textAlign: 'center' }}>2. Personnalisez votre expérience</h2>
            <p style={{ fontSize: '14px', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '24px' }}>Ajoutez des extras pour rendre votre fête encore plus mémorable.</p>
            
            <div style={{ display: 'grid', gap: '12px' }}>
              {options.map((opt) => (
                <div 
                  key={opt.id}
                  onClick={() => toggleOption(opt.id)}
                  style={{ 
                    padding: '16px', 
                    borderRadius: 'var(--radius-md)', 
                    border: '1.5px solid',
                    borderColor: selectedOptions.includes(opt.id) ? 'var(--primary)' : 'var(--border-light)',
                    background: selectedOptions.includes(opt.id) ? 'var(--bg-secondary)' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    transform: selectedOptions.includes(opt.id) ? 'scale(1.02)' : 'scale(1)'
                  }}
                >
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{ 
                      width: '24px', 
                      height: '24px', 
                      borderRadius: '6px', 
                      border: '1px solid var(--border-medium)',
                      background: selectedOptions.includes(opt.id) ? 'var(--primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {selectedOptions.includes(opt.id) && <CheckCircle2 size={16} color="white" />}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '15px' }}>{opt.name}</div>
                      <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{opt.desc}</div>
                    </div>
                  </div>
                  <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '15px' }}>+{opt.price}€</div>
                </div>
              ))}
            </div>
          </div>
        </section>
        </FadeIn>
      )}

      {/* STICKY SUMMARY BAR */}
      {selectedPlanId !== null && (
        <div className="sticky-price-bar">
          <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '100%', gap: '16px' }}>
            <div>
               <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Total estimé</div>
               <div style={{ fontSize: '24px', fontWeight: 900, color: 'var(--text-main)', display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                 {calculateTotal()}
                 <span style={{ fontSize: '14px', fontWeight: 700 }}>€</span>
               </div>
            </div>
            <AnimatedButton to="/contact" className="btn-primary" style={{ width: 'auto', padding: '12px 24px', fontSize: '15px' }}>
               Réserver <ArrowRight size={16} />
            </AnimatedButton>
          </div>
        </div>
      )}

      {/* TRUST */}
      <FadeIn direction="up" delay={0.4}>
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <div style={{ background: 'var(--bg-card)', borderRadius: 'var(--radius-lg)', padding: '24px', border: '1px solid var(--border-light)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <Star size={18} fill="#fbbf24" color="#fbbf24" />
            <span style={{ fontWeight: 700, fontSize: '15px' }}>Garantie satisfaction</span>
          </div>
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            Nous ne trouverez pas de meilleur rapport qualité-prix ! Plus de 100 événements réussis avec une note de 5/5. Si vous n'êtes pas satisfait, nous trouvons une solution.
          </p>
        </div>
      </section>
      </FadeIn>

      {/* CTA */}
      <FadeIn direction="up" delay={0.6}>
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div className="cta-section">
          <h2>Besoin d'un devis personnalisé ?</h2>
          <p>Décrivez votre événement et recevez une proposition adaptée sous 24h.</p>
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
