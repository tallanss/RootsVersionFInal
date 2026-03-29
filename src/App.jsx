import React, { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import Photobooth from './pages/Photobooth';
import Tarifs from './pages/Tarifs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Legal from './pages/Legal';
import BottomNav from './components/BottomNav';
import Header from './components/Header';
import WhatsAppButton from './components/WhatsAppButton';
import CookieBanner from './components/CookieBanner';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo(0, 0); 
    AOS.refresh();
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
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    AOS.init({ duration: 800, once: true });
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
        <main style={{ flexGrow: 1, position: 'relative', paddingBottom: '100px' }}>
          <AnimatedRoutes />
        </main>
        <BottomNav />
        <WhatsAppButton />
        <CookieBanner />
      </div>
    </Router>
  );
}

export default App;
