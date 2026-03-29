import React, { useState } from 'react';
import { Camera, Filter, X, Calendar, MapPin } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PremiumImage from '../components/PremiumImage';
import Lightbox from '../components/Lightbox';
import FadeIn from '../components/FadeIn';
import { useContent } from '../context/ContentContext';

const CATEGORIES = ["Tous", "Mariage", "Corporate", "Anniversaire", "Gala"];

const Gallery = () => {
  const { content } = useContent();
  const [filter, setFilter] = useState("Tous");
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const filteredData = filter === "Tous" 
    ? content.gallery 
    : content.gallery.filter(item => item.category === filter);

  return (
    <div className="animate-in">
      <Helmet>
        <title>Galerie Événements | PhotoRoots Photobooth Normandie</title>
        <meta name="description" content="Découvrez nos derniers événements en Normandie. Photos de mariages, soirées d'entreprise et anniversaires avec notre photobooth premium." />
      </Helmet>

      {/* HEADER */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <div className="section-tag"><Camera size={14} /> Galerie</div>
        <h1 className="section-title" style={{ fontSize: '32px' }}>Derniers Événements</h1>
        <p className="section-subtitle">
          Découvrez l'ambiance PhotoRoots à travers nos prestations récentes au Havre, Rouen et Dieppe.
        </p>

        {/* FILTERS */}
        <div className="filter-container">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${filter === cat ? 'active' : ''}`}
              onClick={() => setFilter(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* MASONRY GRID */}
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div className="gallery-masonry">
          {filteredData.map((item, index) => (
            <FadeIn direction="up" delay={index * 0.05} key={item.id}>
            <div 
              className="masonry-item"
              onClick={() => setLightboxIndex(index)}
            >
              <PremiumImage src={item.image} alt={item.title} />
              <div className="masonry-overlay">
                <span className="masonry-tag">{item.category}</span>
                <h3 className="masonry-title">{item.title}</h3>
                <div style={{ display: 'flex', gap: '12px', color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} /> {item.location}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} /> {item.date}
                  </span>
                </div>
              </div>
            </div>
            </FadeIn>
          ))}
        </div>

        {filteredData.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            Aucun événement ne correspond à cette catégorie pour le moment.
          </div>
        )}
      </section>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && (
        <Lightbox
          images={filteredData.map(d => ({ src: d.image, alt: d.title }))}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </div>
  );
};

export default Gallery;
