import React from 'react';
import { motion } from 'framer-motion';
import { Camera, Calendar, Star, ChevronRight, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="container py-8 animate-in relative z-10">
      {/* Hero Section */}
      <div className="mb-12 relative mt-4">
        <div style={{ position: 'absolute', top: '-40px', left: '-20px', width: '120px', height: '120px', background: 'var(--accent)', filter: 'blur(50px)', opacity: 0.3 }} />

        <h1 style={{ fontSize: '48px', fontWeight: '900', lineHeight: '1.05', background: 'linear-gradient(to right, #ffffff, #a1a1aa)', WebkitBackgroundClip: 'text', color: 'transparent', letterSpacing: '-0.04em', marginBottom: '16px', position: 'relative' }}>
          Capturez la magie<br />de demain.
        </h1>
        <p className="section-subtitle" style={{ fontSize: '18px', color: 'var(--text-light)', position: 'relative' }}>
          L'expérience photobooth repensée pour 2030. Un studio holographique déployé en 2 heures chez vous.
        </p>

        <Link to="/booking">
          <button className="btn-primary" style={{ position: 'relative', overflow: 'hidden', marginTop: '32px' }}>
            <span className="relative z-10 flex items-center space-x-2">
              <Zap size={18} fill="currentColor" />
              <span>Initialiser la séquence</span>
            </span>
          </button>
        </Link>
      </div>

      {/* Featured Service */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold" style={{ letterSpacing: '-0.02em', color: '#fff' }}>Le Core</h2>
        <span className="text-sm font-semibold" style={{ color: 'var(--accent)' }}>Spécifications</span>
      </div>

      <div className="mb-8 relative overflow-hidden group" style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '32px', padding: '24px', border: '1px solid rgba(255, 255, 255, 0.05)', boxShadow: '0 24px 60px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)' }}>

        <div style={{ position: 'absolute', top: '24px', right: '24px', background: 'rgba(255, 255, 255, 0.1)', backdropFilter: 'blur(10px)', padding: '6px 12px', borderRadius: '99px', fontSize: '12px', fontWeight: '700', color: '#fff', border: '1px solid rgba(255, 255, 255, 0.2)', zIndex: 10 }}>
          Série X
        </div>

        {/* SEO Optimized Image with Conversion Focus */}
        <div style={{ aspectRatio: '1 / 1', background: 'rgba(0, 0, 0, 0.3)', borderRadius: '24px', marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255, 255, 255, 0.05)' }}>
          <img
            src="/photobooth-2030.png"
            alt="Photobooth miroir magique ultra-moderne location mariage avec fond futuriste neon"
            title="Location Photobooth Premium Miroir Magique"
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scale(1.05)' }}
          />
          {/* Subtle overlay for text contrast */}
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 40%)' }}></div>
        </div>

        <div className="flex justify-between items-start mb-2">
          <div>
            <h3 className="text-xl font-bold mb-1" style={{ color: '#fff' }}>Le Miroir Temporel</h3>
            <p className="text-text-muted text-sm">Réalité augmentée & filtres IA dynamiques</p>
          </div>
          <div className="flex items-center space-x-1" style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '4px 8px', borderRadius: '12px' }}>
            <Star size={14} fill="#FFD700" color="#FFD700" />
            <span className="text-sm font-semibold text-white">5.0</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-bold mb-6" style={{ letterSpacing: '-0.02em', color: '#fff' }}>Modules</h2>
      <div className="flex flex-col space-y-4">
        <Link to="/creator">
          <div className="flex items-center justify-between p-5 rounded-2xl" style={{ border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center space-x-4">
              <div style={{ background: 'rgba(255, 46, 147, 0.1)', padding: '14px', borderRadius: '18px', border: '1px solid rgba(255, 46, 147, 0.2)' }}>
                <Camera size={24} style={{ color: 'var(--accent)' }} />
              </div>
              <span className="font-semibold text-lg text-white">Laboratoire Virtuel</span>
            </div>
            <ChevronRight size={24} className="text-text-muted" />
          </div>
        </Link>
        <Link to="/booking">
          <div className="flex items-center justify-between p-5 rounded-2xl" style={{ border: '1px solid rgba(255, 255, 255, 0.08)', background: 'rgba(255, 255, 255, 0.02)', backdropFilter: 'blur(20px)' }}>
            <div className="flex items-center space-x-4">
              <div style={{ background: 'rgba(46, 147, 255, 0.1)', padding: '14px', borderRadius: '18px', border: '1px solid rgba(46, 147, 255, 0.2)' }}>
                <Calendar size={24} style={{ color: '#2E93FF' }} />
              </div>
              <span className="font-semibold text-lg text-white">Créneaux Spatiaux</span>
            </div>
            <ChevronRight size={24} className="text-text-muted" />
          </div>
        </Link>
      </div>

    </div>
  );
};

export default Home;
