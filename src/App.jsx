import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Photobooth from './pages/Photobooth';
import Tarifs from './pages/Tarifs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Legal from './pages/Legal';
import SaveTheDate from './pages/SaveTheDate';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Header from './components/Header';
import ContactButton from './components/WhatsAppButton';
import CookieBanner from './components/CookieBanner';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [pathname]);
  return null;
}

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/photobooth" element={<Photobooth />} />
        <Route path="/tarifs" element={<Tarifs />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/galerie" element={<Gallery />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/mentions-legales" element={<Legal />} />
        <Route path="/save-the-date" element={<SaveTheDate />} />
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    const handlePointerMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('pointermove', handlePointerMove);
    return () => window.removeEventListener('pointermove', handlePointerMove);
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <div className="ambient-orbs"></div>
      <div className="mouse-glow"></div>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative', background: 'var(--bg-app)' }}>
        <Header />
        <main style={{ flexGrow: 1, position: 'relative' }}>
          <AnimatedRoutes />
        </main>
        <Footer />
        <BottomNav />
        <ContactButton />
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
