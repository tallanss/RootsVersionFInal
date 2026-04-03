import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../config/supabase';

const ContentContext = createContext();

const DEFAULT_CONTENT = {
  heroBadge: "N°1 en Seine-Maritime",
  heroImg: "/hero-premium.png",
  heroBtn: "Réserver maintenant",
  ctaTitle: "Prêt à créer des souvenirs ?",
  ctaDesc: "Réservez votre date en ligne et recevez une confirmation instantanée.",
  footerDesc: "L'excellence du photobooth premium en Normandie. Sublimez vos événements avec nos bornes photos innovantes et élégantes.",
  services: [
    { title: 'Mariage', desc: 'Offrez à vos invités des souvenirs inoubliables pour le plus beau jour de votre vie.' },
    { title: 'Entreprise', desc: 'Cohésion et dynamisme.' },
    { title: 'Anniversaire', desc: 'Rires garantis avec vos proches.' },
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
  pricing: {
    essentiel: { price: "189", subtitle: "Parfait pour les petits événements et les fêtes entre amis." },
    premium: { price: "289", subtitle: "Notre formule la plus populaire pour les mariages et grands événements." },
    excellence: { price: "389", subtitle: "La formule complète pour les mariages et événements d'entreprise haut de gamme." },
    custom: { price: "Sur devis", subtitle: "Pour les événements d'exception qui méritent une prestation unique." }
  },
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
    { id: 'photobooth', label: 'Photobooth', path: '/photobooth' },
    { id: 'tarifs', label: 'Tarifs', path: '/tarifs' },
    { id: 'galerie', label: 'Galerie', path: '/galerie' },
    { id: 'invite', label: 'Invite', path: '/save-the-date' },
    { id: 'contact', label: 'Contact', path: '/contact' }
  ],
  contact: {
    phone: '+33 6 12 34 56 78',
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
      title: "PhotoRoots | Location Photobooth Miroir Luxe Le Havre & Rouen",
      description: "Sublimez vos événements avec notre borne photo miroir haut de gamme. Mariage, Corporate, Anniversaire en Normandie.",
    },
    pages: {
      '/': { title: 'PhotoRoots - Accueil', description: 'Photobooth premium Normandie' },
      '/photobooth': { title: 'Notre Borne Miroir - PhotoRoots', description: 'Technologie et élégance' },
      '/tarifs': { title: 'Tarifs & Formules - PhotoRoots', description: 'À partir de 189€' },
      '/galerie': { title: 'Galerie Événements - PhotoRoots', description: 'Nos réalisations' },
      '/contact': { title: 'Réserver - PhotoRoots', description: 'Contactez-nous' },
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
  saveTheDate: {
    title: 'Save The Date',
    subtitle: "Personnalisez et téléchargez votre carte 'Save the Date' gratuitement."
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
    navigation: parsed.navigation || DEFAULT_CONTENT.navigation,
    socials: { ...DEFAULT_CONTENT.socials, ...(parsed.socials || {}) },
    contact: { ...DEFAULT_CONTENT.contact, ...(parsed.contact || {}) },
    seo: {
      ...DEFAULT_CONTENT.seo,
      ...(parsed.seo || {}),
      pages: { ...DEFAULT_CONTENT.seo.pages, ...(parsed.seo?.pages || {}) }
    },
    pricing: {
      essentiel: { ...DEFAULT_CONTENT.pricing.essentiel, ...(parsed.pricing?.essentiel || {}) },
      premium: { ...DEFAULT_CONTENT.pricing.premium, ...(parsed.pricing?.premium || {}) },
      custom: { ...DEFAULT_CONTENT.pricing.custom, ...(parsed.pricing?.custom || {}) },
    },
    formOptions: { ...DEFAULT_CONTENT.formOptions, ...(parsed.formOptions || {}) },
    analytics: { ...DEFAULT_CONTENT.analytics, ...(parsed.analytics || {}) },
    stats: parsed.stats || DEFAULT_CONTENT.stats,
    services: parsed.services || DEFAULT_CONTENT.services,
    pricing_plans: parsed.pricing_plans || DEFAULT_CONTENT.pricing_plans,
    testimonials: parsed.testimonials || DEFAULT_CONTENT.testimonials,
    faqs: parsed.faqs || DEFAULT_CONTENT.faqs,
    saveTheDateEvents: parsed.saveTheDateEvents || DEFAULT_CONTENT.saveTheDateEvents,
    blockedDates: parsed.blockedDates || DEFAULT_CONTENT.blockedDates,
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

    fetchFromSupabase();
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
    <ContentContext.Provider value={{ content, updateContent, resetToDefault, downloadLeadsCSV, saveStatus }}>
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
