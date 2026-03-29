import React, { createContext, useContext, useState, useEffect } from 'react';

const ContentContext = createContext();

const DEFAULT_CONTENT = {
  hero: {
    title: "Vivez l'instant",
    subtitle: "Location Photobooth Premium",
    desc: "Sublimez vos événements au Havre, Rouen et Dieppe avec notre borne photo miroir haut de gamme."
  },
  scrolly: {
    step1: { title: "Réservez en ligne", desc: "Choisissez votre date et votre formule sur notre calendrier interactif. Confirmation instantanée." },
    step2: { title: "On s'occupe de tout", desc: "Livraison, installation discrète et gestion de la lumière. Notre technicien configure le photobooth clé en main." },
    step3: { title: "Vivez l'instant !", desc: "Lumières, sourires, poses improbables et impressions glacées instantanées en qualité studio professionnel." }
  },
  gallery: [
    {
      id: 1,
      title: "Mariage de Sarah & Tom",
      location: "Château de Galleville",
      category: "Mariage",
      image: "/events/wedding-1.png",
      date: "Juin 2025"
    },
    {
      id: 2,
      title: "Gala Annuel CCI Rouen",
      location: "Palais des Consuls",
      category: "Corporate",
      image: "/events/corporate-1.png",
      date: "Septembre 2025"
    },
    {
      id: 3,
      title: "10 ans de Léa",
      location: "Le Havre",
      category: "Anniversaire",
      image: "/events/birthday-1.png",
      date: "Octobre 2025"
    },
    {
      id: 4,
      title: "Soirée Black Tie",
      location: "Casino de Dieppe",
      category: "Gala",
      image: "/events/gala-1.png",
      date: "Décembre 2025"
    },
    {
      id: 5,
      title: "Mariage Bohème",
      location: "Étretat",
      category: "Mariage",
      image: "/events/boho-1.png",
      date: "Juillet 2025"
    },
    {
      id: 6,
      title: "Lancement de Marque",
      location: "Concept Store Rouen",
      category: "Corporate",
      image: "/events/party-1.png",
      date: "Novembre 2025"
    }
  ]
};

export const ContentProvider = ({ children }) => {
  const [content, setContent] = useState(() => {
    const saved = localStorage.getItem('photo_roots_content');
    return saved ? JSON.parse(saved) : DEFAULT_CONTENT;
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
