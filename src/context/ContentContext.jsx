import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

const DEFAULT_CONTENT = {
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
  pricing: {
    essentiel: { price: "189", subtitle: "Parfait pour les petits événements et les fêtes entre amis." },
    premium: { price: "289", subtitle: "Notre formule la plus populaire pour les mariages et grands événements." },
    custom: { price: "Sur devis", subtitle: "Pour les événements d'exception qui méritent une prestation unique." }
  },
  theme: {
    primary: "#16a34a",
    accent: "#22c55e",
    background: "#f7f9f8"
  },
  seo: {
    title: "PhotoRoots | Location Photobooth Miroir Luxe Le Havre & Rouen",
    description: "Sublimez vos événements avec notre borne photo miroir haut de gamme. Mariage, Corporate, Anniversaire en Normandie.",
  },
  messages: [],
  formOptions: {
    eventTypes: ['Mariage', 'Anniversaire', 'Entreprise', 'Baptême', 'Autre']
  },
  analytics: {
    monthlyBookings: [],
    totalInquiries: 0,
    estimatedRevenue: 0
  }
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('photo_roots_content');
    const parsed = saved ? JSON.parse(saved) : DEFAULT_CONTENT;
    
    // Auto-sync new default hero subtitle if it matches the old one
    if (parsed.hero && (parsed.hero.subtitle === "Location Photobooth Premium" || parsed.hero.subtitle === "location photobooth, a partir de 189 euros")) {
      parsed.hero.subtitle = DEFAULT_CONTENT.hero.subtitle;
    }

    // Migration for pricing if missing
    if (!parsed.pricing) {
      parsed.pricing = DEFAULT_CONTENT.pricing;
    }

    // Migration for new pro features
    if (!parsed.theme) parsed.theme = DEFAULT_CONTENT.theme;
    if (!parsed.seo) parsed.seo = DEFAULT_CONTENT.seo;
    if (!parsed.messages) parsed.messages = DEFAULT_CONTENT.messages;
    if (!parsed.formOptions) parsed.formOptions = DEFAULT_CONTENT.formOptions;
    if (!parsed.analytics) parsed.analytics = DEFAULT_CONTENT.analytics;
    
    return parsed;
  });

  const updateContent = (newContent) => {
    setContent(newContent);
    localStorage.setItem('photo_roots_content', JSON.stringify(newContent));
  };

  const resetToDefault = () => {
    updateContent(DEFAULT_CONTENT);
  };

  return (
    <ContentContext.Provider value={{ content, updateContent, resetToDefault }}>
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
