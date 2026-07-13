import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';

const ContentContext = createContext();

const DEFAULT_CONTENT = {
  heroBadge: "N°1 en Seine-Maritime",
  heroImg: "/hero-premium.png",
  heroBtn: "Obtenir un devis",
  ctaTitle: "Prêt à créer des souvenirs ?",
  ctaDesc: "Réservez votre date en ligne et recevez une confirmation instantanée.",
  footerDesc: "L'excellence du photobooth premium en Normandie. Sublimez vos événements avec nos bornes photos innovantes et élégantes.",
  services: [
    { id: 'wedding',   icon: 'wedding',   title: 'Mariage',            desc: 'Des souvenirs inoubliables pour le plus beau jour.' },
    { id: 'corporate', icon: 'corporate', title: 'Entreprise',         desc: "Soirées d'entreprise, inaugurations, salons." },
    { id: 'birthday',  icon: 'birthday',  title: 'Anniversaire',       desc: 'Petits et grands, rires garantis en famille.' },
    { id: 'baptism',   icon: 'baptism',   title: 'Baptême',            desc: 'Un souvenir tendre pour les plus beaux moments.' },
    { id: 'hen',       icon: 'hen',       title: 'EVJF / EVG',         desc: "L'ambiance idéale pour célébrer entre amis." },
    { id: 'seminar',   icon: 'seminar',   title: 'Séminaire',          desc: "Cohésion d'équipe et team-building animés." },
    { id: 'prom',      icon: 'prom',      title: 'Bal de promo',       desc: 'Immortalisez la fin de vos études en beauté.' },
    { id: 'xmas',      icon: 'xmas',      title: "Noël d'entreprise",  desc: 'Ambiance festive garantie pour vos collaborateurs.' },
  ],
  stats: [
    { num: '150+', label: 'Événements' },
    { num: '500+', label: 'Clients' },
    { num: '1000+', label: 'Sourires' },
  ],
  hero: {
    title: "Vivez l'instant",
    subtitle: "Location Photobooth à partir de 189 euros",
    desc: "Sublimez vos événements au Havre, Rouen et Dieppe avec notre borne photo miroir haut de gamme."
  },
  scrolly: {
    step1: { title: "Réservez en ligne", desc: "Choisissez votre date et votre formule sur notre calendrier interactif. Confirmation instantanée." },
    step2: { title: "On s'occupe de tout", desc: "Livraison, installation discrète et gestion de la lumière. Notre technicien configure le photobooth clé en main." },
    step3: { title: "Vivez l'instant !", desc: "Lumières, sourires, poses improbables et impressions glacées instantanées en qualité studio professionnel." }
  },
  gallery: [],
  testimonials: [
    { id: 1, name: 'Clément Robert', role: 'Anniversaire au Havre', text: 'Location pour notre anniversaire. Les photos sont de très bonnes qualités et tous nos amis se sont bien amusés. Je recommande. Merci PhotoRoots !', avatar: 'C' },
    { id: 2, name: 'Jordan Racine', role: 'Fête privée à Rouen', text: 'Bien organisé du début à la fin. Jimmy est très arrangeant et a répondu à nos demandes de dernière minute. On se revoit pour mes 40 ans ;)', avatar: 'J' },
    { id: 3, name: 'Sophie & Marc', role: 'Mariage à Dieppe', text: 'Super prestation pour notre mariage ! Tous les invités ont adoré le photobooth. Les impressions sont de qualité pro. Une vraie valeur ajoutée à notre soirée.', avatar: 'S' }
  ],
  faqs: [
    { q: "Comment réserver le photobooth ?", a: "C'est très simple ! Remplissez notre formulaire de contact avec la date et le type de votre événement. Nous vous répondons sous 24h avec un devis personnalisé gratuit." },
    { q: "Quelle est la zone d'intervention ?", a: "Nous intervenons principalement en Seine-Maritime : Le Havre, Rouen, Dieppe et leurs alentours. Pour les événements plus éloignés, contactez-nous pour un devis." },
    { q: "Le photobooth est-il livré et installé ?", a: "Oui ! Nous nous occupons de tout : livraison, installation, assistance technique pendant l'événement et reprise du matériel. Vous n'avez rien à faire." },
    { q: "Peut-on personnaliser les photos ?", a: "Absolument ! Le format, le fond, les cadres et les textes sont entièrement personnalisables. L'écran de diffusion intégré dans le pied permet aussi d'afficher vos propres contenus." },
    { q: "Les photos sont-elles imprimées sur place ?", a: "Oui, grâce à notre imprimante professionnelle ultra-rapide. Chaque invité repart avec un souvenir physique de qualité en quelques secondes." },
  ],
  pricing_plans: [
    {
      id: 'essentiel',
      name: 'Essentiel',
      price: '189',
      desc: 'Parfait pour les petits événements et les fêtes entre amis.',
      features: ['Photos illimitées', 'Accessoires & props fun', 'Livraison & installation', 'Galerie en ligne'],
      excluded: ['Impressions sur place', 'Personnalisation complète', 'Écran de diffusion'],
      featured: false
    },
    {
      id: 'premium',
      name: 'Premium',
      price: '289',
      desc: 'Notre formule la plus populaire pour les mariages et grands événements.',
      features: ['Photos illimitées', 'Impressions illimitées sur place', 'Personnalisation totale (cadres, fonds)', 'Accessoires premium', 'Écran de diffusion', 'Livraison & installation', 'Galerie en ligne HD'],
      excluded: [],
      featured: true
    },
    {
      id: 'excellence',
      name: 'Excellence',
      price: '389',
      desc: 'La formule complète pour les mariages et événements d\'entreprise haut de gamme.',
      features: ['Photos illimitées', 'Impressions illimitées sur place', 'Personnalisation totale (cadres, fonds)', 'Accessoires premium', 'Écran de diffusion', 'Livre d\'or Premium offert', 'Branding personnalisé complet', 'Technicien dédié', 'Livraison & installation', 'Galerie en ligne HD'],
      excluded: [],
      featured: false
    },
    {
      id: 'custom',
      name: 'Sur-Mesure',
      price: 'Sur devis',
      isCustom: true,
      desc: 'Pour les événements d\'exception qui méritent une prestation unique.',
      features: ['Tout le Premium inclus', 'Branding personnalisé complet', 'Animations vidéo sur mesure', 'Technicien dédié', 'Multi-impressions (formats spéciaux)', 'Livraison France entière'],
      excluded: [],
      featured: false
    }
  ],
  addons: [
    { id: 'guestbook', name: "Livre d'or Premium", price: 39, desc: 'Avec collages et stylos', enabled: true },
    { id: 'usb',       name: 'Clé USB souvenirs',  price: 15, desc: 'Toutes les photos en HD', enabled: true },
    { id: 'branding',  name: 'Branding Écran',     price: 29, desc: "Votre logo sur l'interface", enabled: true },
  ],
  // « Prestations » = les machines/produits proposés à la location (au-delà du
  // photobooth classique). Gérées en self-service via le dashboard → Prestations.
  // Le 360 ci-dessous est un EXEMPLE pré-rempli : à modifier ou supprimer.
  products: [
    {
      id: 'prod-360',
      slug: 'photobooth-360',
      name: 'Photobooth 360',
      tagline: 'La vidéo qui tourne autour de vos invités',
      priceFrom: 290,
      description: "La sensation du moment : une plateforme sur laquelle vos invités montent pendant qu'une caméra tourne à 360° pour créer des vidéos ralenties spectaculaires, prêtes à partager sur les réseaux. Effet garanti sur tous vos événements.",
      image: '',
      features: [
        'Vidéos 360° ralenties, effet « waouh »',
        'Plateau lumineux jusqu\'à 3 personnes',
        'Partage instantané par QR code',
        'Technicien présent tout l\'événement',
        'Musique, effets et logo personnalisables',
      ],
      badge: 'Nouveau',
      visible: true,
      indexable: true,
      seoTitle: 'Location Photobooth 360 en Normandie — Le Havre, Rouen | PhotoRoots',
      seoDesc: 'Louez un photobooth 360 pour vos événements en Seine-Maritime : vidéos 360° ralenties à partager, installation et technicien inclus. Devis gratuit en 24h.',
      createdAt: '2026-07-12T00:00:00.000Z',
      updatedAt: '2026-07-12T00:00:00.000Z',
    },
  ],
  theme: {
    primary: "#c5a059",
    accent: "#e3c18c",
    background: "#ffffff",
    logoUrl: "/logo-gold.png",
    faviconUrl: "/favicon.ico",
    radius: "24px"
  },
  navigation: [
    { id: 'home', label: 'Accueil', path: '/' },
    { id: 'tarifs', label: 'Tarifs', path: '/tarifs' },
    { id: 'prestations', label: 'Prestations', path: '/prestations', icon: 'prestations' },
    { id: 'galerie', label: 'Galerie', path: '/galerie' },
    { id: 'invite', label: 'Invite', path: '/save-the-date' },
    { id: 'contact', label: 'Contact', path: '/contact' }
  ],
  contact: {
    phone: '06 03 16 36 21',
    email: 'contact@photoroots.fr',
    zone: 'Le Havre, Rouen, Dieppe — Seine-Maritime'
  },
  socials: {
    instagram: '#',
    facebook: '#',
    whatsapp: 'https://wa.me/33612345678'
  },
  seo: {
    global: {
      title: "PhotoRoots | Location Photobooth à partir de 99€ — Le Havre & Rouen",
      description: "Location photobooth à partir de 99€ — Bornes photo pour mariages, anniversaires et événements d'entreprise en Seine-Maritime. Devis gratuit en 24h.",
    },
    pages: {
      '/': { title: 'PhotoRoots | Location Photobooth à partir de 99€', description: "Location photobooth à partir de 99€ — Bornes photo pour mariages, anniversaires et événements d'entreprise en Seine-Maritime. Devis gratuit en 24h." },
      '/photobooth': { title: 'Notre Borne Miroir - PhotoRoots', description: 'Location photobooth à partir de 99€ — Borne miroir haut de gamme pour tous vos événements en Seine-Maritime.' },
      '/tarifs': { title: 'Tarifs & Formules - PhotoRoots', description: 'Location photobooth à partir de 99€ — Découvrez nos formules pour mariages, anniversaires et entreprises.' },
      '/galerie': { title: 'Galerie Événements - PhotoRoots', description: 'Location photobooth à partir de 99€ — Découvrez nos réalisations en Seine-Maritime.' },
      '/contact': { title: 'Contact & devis - PhotoRoots', description: 'Location photobooth à partir de 99€ — Faites votre demande de devis gratuit, réponse sous 24h.' },
      '/options-a-louer': { title: 'Options à louer pour votre photobooth — PhotoRoots', description: "Livre d'or premium, accessoires, clé USB, branding personnalisé… Ajoutez des options à la carte à votre location de photobooth en Normandie. Devis gratuit en 24h." },
    }
  },
  messages: [],
  formOptions: {
    eventTypes: ['Mariage', 'Anniversaire', 'Entreprise', 'Baptême', 'Autre']
  },
  analytics: {
    monthlyBookings: [],
    totalInquiries: 0,
    estimatedRevenue: 0
  },
  saveTheDateEvents: [],
  blockedDates: [],
  customPages: [],
  saveTheDate: {
    title: 'Save The Date',
    subtitle: "Personnalisez et téléchargez votre carte 'Save the Date' gratuitement."
  },
  // Page Options à louer (héros + CTA)
  rentalOptionsTitle: 'Personnalisez votre photobooth',
  rentalOptionsSubtitle: "Complétez votre formule avec nos options à la carte. Ajoutez celles qui vous font envie au moment de votre demande de devis — sans engagement.",
  rentalOptionsCtaTitle: "Envie d'ajouter ces options ?",
  rentalOptionsCtaDesc: "Sélectionnez vos options directement dans votre demande de devis et recevez une proposition personnalisée gratuite sous 24 h.",
  // Page Blog (héros + CTA)
  blogTitle: 'Conseils & inspirations pour vos événements',
  blogSubtitle: "Tarifs, mariages, soirées d'entreprise, idées d'accessoires et guides locaux en Normandie : retrouvez nos articles pour préparer sereinement votre animation photobooth.",
  blogCtaTitle: 'Une question sur votre événement ?',
  blogCtaDesc: "Mariage, anniversaire ou soirée d'entreprise : parlons de votre projet et obtenez un devis gratuit sous 24 h.",
  // Mentions légales & CGV (sections éditables)
  legal: {
    title: 'Mentions Légales & CGV',
    mentionsTitle: 'Mentions Légales',
    cgvTitle: 'Conditions Générales de Vente',
    lastUpdated: 'Mars 2026',
    mentions: [
      { title: '1. Éditeur du site', body: "PhotoRoots\nMicro-entreprise — SIRET : [À compléter]\nSiège social : Le Havre, Seine-Maritime (76)\nEmail : contact@photoroots.fr\nTéléphone : 06 03 16 36 21" },
      { title: '2. Hébergement', body: 'Ce site est hébergé par Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis.' },
      { title: '3. Propriété intellectuelle', body: "L'ensemble des contenus (textes, images, photos, vidéos, logos) présents sur ce site sont protégés par le droit d'auteur. Toute reproduction, même partielle, est interdite sans autorisation préalable." },
      { title: '4. Données personnelles (RGPD)', body: "Les informations collectées via le formulaire de réservation sont destinées exclusivement à PhotoRoots pour le traitement de votre demande. Conformément au RGPD, vous disposez d'un droit d'accès, de rectification et de suppression de vos données. Pour exercer ce droit, contactez-nous à : contact@photoroots.fr\nAucune donnée n'est transmise à des tiers. Les données sont conservées pendant une durée maximale de 36 mois après votre dernière interaction." },
      { title: '5. Cookies', body: "Ce site utilise des cookies strictement nécessaires au fonctionnement (mémorisation des préférences). Aucun cookie publicitaire ou de tracking n'est utilisé sans votre consentement explicite." },
    ],
    cgv: [
      { title: 'Article 1 — Objet', body: "Les présentes conditions régissent les prestations de location de photobooth proposées par PhotoRoots pour tout type d'événement (mariage, anniversaire, événement d'entreprise, etc.)." },
      { title: 'Article 2 — Réservation', body: 'Toute réservation effectuée via le site internet est confirmée par email. Un acompte de 30% du montant total est demandé pour valider la réservation. Le solde est dû le jour de l\'événement.' },
      { title: 'Article 3 — Annulation', body: "Par le client :\n• Plus de 30 jours avant : remboursement intégral de l'acompte\n• Entre 15 et 30 jours : remboursement de 50% de l'acompte\n• Moins de 15 jours : l'acompte est conservé\nPar PhotoRoots : En cas de force majeure, PhotoRoots s'engage à proposer une date de report ou un remboursement intégral." },
      { title: 'Article 4 — Prestations', body: "Les formules proposées incluent la mise à disposition du matériel, l'installation et la désinstallation, ainsi que l'accompagnement pendant l'événement selon la formule choisie." },
      { title: 'Article 5 — Responsabilité', body: "Le client s'engage à utiliser le matériel mis à disposition de manière raisonnable. Tout dommage causé au matériel durant l'événement sera facturé au client selon le coût de réparation ou de remplacement." },
      { title: 'Article 6 — Droit à l\'image', body: "Sauf mention contraire expresse, PhotoRoots se réserve le droit d'utiliser les photos prises lors de l'événement à des fins de communication et de portfolio. Les photos ne seront jamais utilisées à des fins commerciales tierces." },
      { title: 'Article 7 — Litiges', body: "En cas de litige, les parties s'engagent à rechercher une solution amiable. À défaut, les tribunaux compétents du ressort du Havre seront seuls compétents." },
    ],
  },
};

// Deep merge depuis le localStorage/Supabase vers les defaults
const buildMergedContent = (parsed = {}) => {
  const merged = {
    ...DEFAULT_CONTENT,
    ...parsed,
    hero: { ...DEFAULT_CONTENT.hero, ...(parsed.hero || {}) },
    scrolly: { ...DEFAULT_CONTENT.scrolly, ...(parsed.scrolly || {}) },
    theme: { ...DEFAULT_CONTENT.theme, ...(parsed.theme || {}) },
    // Garde : une navigation vide (ou invalide) retombe sur le défaut — sinon
    // le site n'aurait plus AUCUN menu (la barre du bas est la seule navigation).
    navigation: (() => {
      let base = (Array.isArray(parsed.navigation) && parsed.navigation.length > 0)
        ? parsed.navigation
        : DEFAULT_CONTENT.navigation;
      // Retrait de l'onglet « Photobooth » du menu (le photobooth reste accessible
      // via la page « Prestations », le lien du pied de page et la home).
      base = base.filter((n) => n.id !== 'photobooth' && n.path !== '/photobooth');
      // Migration : garantir l'onglet « Prestations » (ajouté après coup), inséré
      // juste après « Tarifs ». Le propriétaire peut le renommer/déplacer via le CMS.
      if (!base.some((n) => n.id === 'prestations' || n.path === '/prestations')) {
        const item = { id: 'prestations', label: 'Prestations', path: '/prestations', icon: 'prestations' };
        const idx = base.findIndex((n) => n.id === 'tarifs' || n.path === '/tarifs');
        base = idx >= 0 ? [...base.slice(0, idx + 1), item, ...base.slice(idx + 1)] : [...base, item];
      }
      return base;
    })(),
    legal: {
      ...DEFAULT_CONTENT.legal,
      ...(parsed.legal || {}),
      mentions: parsed.legal?.mentions?.length ? parsed.legal.mentions : DEFAULT_CONTENT.legal.mentions,
      cgv: parsed.legal?.cgv?.length ? parsed.legal.cgv : DEFAULT_CONTENT.legal.cgv,
    },
    socials: { ...DEFAULT_CONTENT.socials, ...(parsed.socials || {}) },
    contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) },
    seo: {
      ...DEFAULT_CONTENT.seo,
      ...(parsed.seo || {}),
      pages: { ...DEFAULT_CONTENT.seo.pages, ...(parsed.seo?.pages || {}) }
    },
    formOptions: { ...DEFAULT_CONTENT.formOptions, ...(parsed.formOptions || {}) },
    analytics: { ...DEFAULT_CONTENT.analytics, ...(parsed.analytics || {}) },
    stats: parsed.stats || DEFAULT_CONTENT.stats,
    // Migration : l'ancien format de services (sans `icon`) est remplacé par le
    // nouveau défaut enrichi. Une liste éditée via le CMS (avec `icon`) est conservée.
    services: (() => {
      const stored = parsed.services;
      if (!Array.isArray(stored) || stored.length === 0 || !stored[0].icon) {
        return DEFAULT_CONTENT.services;
      }
      return stored;
    })(),
    addons: parsed.addons || DEFAULT_CONTENT.addons,
    products: parsed.products || DEFAULT_CONTENT.products,
    pricing_plans: (() => {
      const stored = parsed.pricing_plans;
      if (!stored) return DEFAULT_CONTENT.pricing_plans;
      const storedIds = new Set(stored.map(p => p.id));
      const missing = DEFAULT_CONTENT.pricing_plans.filter(p => !storedIds.has(p.id));
      return [...stored, ...missing];
    })(),
    testimonials: parsed.testimonials || DEFAULT_CONTENT.testimonials,
    faqs: parsed.faqs || DEFAULT_CONTENT.faqs,
    saveTheDateEvents: parsed.saveTheDateEvents || DEFAULT_CONTENT.saveTheDateEvents,
    blockedDates: parsed.blockedDates || DEFAULT_CONTENT.blockedDates,
    customPages: parsed.customPages || DEFAULT_CONTENT.customPages,
    saveTheDate: { ...DEFAULT_CONTENT.saveTheDate, ...(parsed.saveTheDate || {}) },
  };

  if (
    merged.hero.subtitle === "Location Photobooth Premium" ||
    merged.hero.subtitle === "location photobooth, a partir de 189 euros"
  ) {
    merged.hero.subtitle = DEFAULT_CONTENT.hero.subtitle;
  }

  return merged;
};

// Sauvegarde en arrière-plan vers Supabase
const saveToSupabase = async (mergedContent) => {
  if (!supabase) return; // mode offline / prerender
  try {
    const { error } = await supabase
      .from('site_content')
      .upsert(
        { id: 1, content: mergedContent, updated_at: new Date().toISOString() },
        { onConflict: 'id' }
      );
    if (error) throw error;
  } catch (err) {
    console.error('[Supabase] Erreur de sauvegarde:', err.message);
  }
};

export const ContentProvider = ({ children }) => {
  const [saveStatus, setSaveStatus] = useState(null); // null | 'saving' | 'saved'
  // true quand le chargement Supabase initial est terminé (succès ou échec).
  // Permet aux pages dynamiques (/p/:slug) de distinguer « pas encore chargé »
  // de « page introuvable » (sinon faux 404 pendant le fetch).
  const [remoteLoaded, setRemoteLoaded] = useState(false);

  const [content, setContent] = useState(() => {
    try {
      const cached = localStorage.getItem('photo_roots_content');
      return buildMergedContent(cached ? JSON.parse(cached) : {});
    } catch {
      return buildMergedContent({});
    }
  });

  // Ref toujours à jour sur le contenu courant — évite les closures stale
  const contentRef = useRef(content);

  // Chargement depuis Supabase au montage (source de vérité)
  useEffect(() => {
    if (!supabase) { setRemoteLoaded(true); return; } // mode offline / prerender
    const fetchFromSupabase = async () => {
      try {
        const { data, error } = await supabase
          .from('site_content')
          .select('content, updated_at')
          .eq('id', 1)
          .maybeSingle();

        if (error) throw error;

        if (data?.content) {
          // Vérifier si le localStorage est plus récent (modif locale non encore synchro)
          const localRaw = localStorage.getItem('photo_roots_content');
          const localSavedAt = localRaw ? (JSON.parse(localRaw)._savedAt || 0) : 0;
          const supabaseSavedAt = data.updated_at ? new Date(data.updated_at).getTime() : 0;

          // Si local a été sauvegardé après Supabase → priorité au local, re-sync vers Supabase
          if (localSavedAt > supabaseSavedAt) {
            const localParsed = JSON.parse(localRaw);
            await saveToSupabase(localParsed);
            return;
          }

          const merged = buildMergedContent(data.content);
          const mergedStr = JSON.stringify(merged);
          const isAdmin = sessionStorage.getItem('pr_admin') === '1';
          if (localRaw && localRaw !== mergedStr && isAdmin) {
            window.dispatchEvent(new CustomEvent('photo-roots-toast', {
              detail: { message: 'Contenu mis à jour depuis le serveur ✓', type: 'info' }
            }));
          }
          contentRef.current = merged;
          setContent(merged);
          localStorage.setItem('photo_roots_content', mergedStr);
        } else {
          // Première fois : migrer le localStorage vers Supabase
          const cached = localStorage.getItem('photo_roots_content');
          if (cached) {
            await saveToSupabase(JSON.parse(cached));
          } else {
            await saveToSupabase(DEFAULT_CONTENT);
          }
        }
      } catch (err) {
        console.warn('[Supabase] Connexion impossible, mode cache actif:', err.message);
      }
    };

    fetchFromSupabase().finally(() => setRemoteLoaded(true));
  }, []);

  const saveTimerRef = useRef(null);

  const updateContent = useCallback((newContent) => {
    setSaveStatus('saving');

    // Calcul fiable via ref (pas de closure stale ni d'updater async)
    const merged = { ...contentRef.current, ...newContent, _savedAt: Date.now() };
    contentRef.current = merged;
    setContent(merged);
    localStorage.setItem('photo_roots_content', JSON.stringify(merged));
    saveToSupabase(merged);

    clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus(null), 2200);
    }, 600);
  }, []);

  const resetToDefault = useCallback(async () => {
    localStorage.removeItem('photo_roots_content');
    contentRef.current = DEFAULT_CONTENT;
    setContent(DEFAULT_CONTENT);
    await saveToSupabase(DEFAULT_CONTENT);
  }, []);

  const downloadLeadsCSV = useCallback(() => {
    const messages = content.messages || [];
    if (messages.length === 0) {
      alert("Aucun lead à exporter.");
      return;
    }

    const headers = ["ID", "Date", "Nom", "Email", "Téléphone", "Sujet/Événement", "Formule", "Message", "Statut"];
    const rows = messages.map(m => [
      m.id,
      m.date || m.createdAt || "",
      `"${m.name || ""}"`,
      m.email || "",
      m.phone || "",
      `"${m.subject || m.eventType || ""}"`,
      m.formula || "",
      `"${(m.fullMessage || m.message || "").replace(/"/g, '""')}"`,
      m.status || "Nouveau"
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob(["\ufeff" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `photo-roots-leads-${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, [content.messages]);

  return (
    <ContentContext.Provider value={{ content, updateContent, resetToDefault, downloadLeadsCSV, saveStatus, remoteLoaded }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (!context) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
