import React from 'react';
import { Link } from 'react-router-dom';
import { Camera as CameraIcon, Monitor, Printer, Palette, Image, Tv, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Helmet } from 'react-helmet-async';
import PremiumImage from '../components/PremiumImage';

const Photobooth = () => {
  return (
    <div className="animate-in">
      <Helmet>
        <title>Équipement Photobooth Premium | Location Seine-Maritime</title>
        <meta name="description" content="Découvrez la technologie derrière notre photobooth miroir : Appareil photo Reflex, impression instantanée, écran tactile. Intervention au Havre et Rouen." />
        <meta name="keywords" content="borne photo le havre, location photobooth rouen, matériel photobooth seine-maritime, miroir photo dieppe" />
      </Helmet>

      {/* HERO */}
      <section className="container" style={{ padding: '32px 20px 24px' }}>
        <div className="section-tag"><CameraIcon size={14} /> Notre Photobooth</div>
        <h1 className="section-title" style={{ fontSize: '32px' }}>Technologie de Qualité</h1>
        <p className="section-subtitle">
          Découvrez l'excellence de notre borne Photobooth, conçue pour capturer vos moments les plus précieux avec une qualité incomparable.
        </p>
        <div style={{ borderRadius: 'var(--radius-xl)', overflow: 'hidden', boxShadow: 'var(--shadow-xl)', marginBottom: '32px' }}>
          <PremiumImage
            src="/mirror-premium.png"
            alt="Photobooth miroir premium PhotoRoots avec éclairage LED"
            style={{ width: '100%', height: '280px', objectFit: 'cover' }}
          />
        </div>
      </section>

      {/* SPECS */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <h2 className="section-title">Équipement Professionnel</h2>
        <p className="section-subtitle">Chaque composant est sélectionné pour garantir des résultats exceptionnels.</p>

        <div className="spec-card">
          <div className="spec-icon"><CameraIcon size={22} /></div>
          <div className="spec-content">
            <h3>Canon EOS 6D</h3>
            <p>Appareil photo full-frame professionnel avec objectif ultra-performant pour des clichés d'une netteté exceptionnelle et des couleurs vibrantes.</p>
          </div>
        </div>

        <div className="spec-card">
          <div className="spec-icon"><Monitor size={22} /></div>
          <div className="spec-content">
            <h3>Écran Tactile ASUS 1080p</h3>
            <p>Naviguez facilement à travers les options et personnalisez vos photos grâce à l'interface tactile intuitive haute définition.</p>
          </div>
        </div>

        <div className="spec-card">
          <div className="spec-icon"><Printer size={22} /></div>
          <div className="spec-content">
            <h3>Imprimante Hilti Ultra-Rapide</h3>
            <p>Vos photos prennent vie instantanément avec une qualité d'impression professionnelle. Fini les temps d'attente !</p>
          </div>
        </div>

        <div className="spec-card">
          <div className="spec-icon"><Tv size={22} /></div>
          <div className="spec-content">
            <h3>Écran de Diffusion</h3>
            <p>Écran intégré dans le pied pour diffuser vos vidéos, diaporamas, messages personnalisés ou revivre les photos de l'événement en direct.</p>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <h2 className="section-title">Tout est inclus</h2>
        <p className="section-subtitle">Une expérience complète, sans surprise.</p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrap"><Image size={22} /></div>
            <h3>Photos Illimitées</h3>
            <p>Prenez autant de photos que vous le souhaitez.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap"><Palette size={22} /></div>
            <h3>Personnalisation</h3>
            <p>Fonds, cadres et textes à votre image.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap"><Printer size={22} /></div>
            <h3>Impression Instant</h3>
            <p>Repartez avec vos souvenirs en main.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon-wrap"><CheckCircle2 size={22} /></div>
            <h3>Clé en Main</h3>
            <p>Livraison et installation incluses.</p>
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="container" style={{ padding: '0 20px 32px' }}>
        <h2 className="section-title">En action</h2>
        <p className="section-subtitle">Notre photobooth en situation lors d'événements réels.</p>
        <div className="gallery-grid">
          <div className="gallery-item">
            <PremiumImage src="/gallery-1.png" alt="Photobooth en action lors d'un mariage" />
          </div>
          <div className="gallery-item">
            <PremiumImage src="/gallery-2.png" alt="Photobooth lors d'un événement corporate" />
          </div>
          <div className="gallery-item">
            <PremiumImage src="/gallery-3.png" alt="Anniversaire avec photobooth PhotoRoots" />
          </div>
          <div className="gallery-item">
            <PremiumImage src="/hero-premium.png" alt="Vue du miroir photobooth premium" />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container" style={{ padding: '0 20px 48px' }}>
        <div className="cta-section">
          <h2>Envie de le voir en vrai ?</h2>
          <p>Demandez une démonstration gratuite ou réservez pour votre événement.</p>
          <Link to="/contact">
            <button className="btn-primary" style={{ background: '#fff', color: 'var(--bg-dark)', width: 'auto', padding: '16px 36px', fontWeight: 800 }}>
              Nous Contacter <ArrowRight size={18} />
            </button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Photobooth;
