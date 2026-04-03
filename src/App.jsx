import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0c', color: '#fff', padding: '24px', textAlign: 'center' }}>
          <img src="/logo-gold.png" alt="PhotoRoots" style={{ height: '48px', marginBottom: '24px', opacity: 0.7 }} />
          <h1 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '12px' }}>Une erreur inattendue est survenue</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', marginBottom: '24px' }}>Rechargez la page pour continuer.</p>
          <button
            onClick={() => window.location.reload()}
            style={{ background: '#c5a059', color: '#fff', border: 'none', borderRadius: '12px', padding: '12px 28px', fontWeight: 700, cursor: 'pointer', fontSize: '15px' }}
          >
            Recharger la page
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}
import { ToastContainer } from './components/Toast';
import Home from './pages/Home';
import Photobooth from './pages/Photobooth';
import Tarifs from './pages/Tarifs';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import Admin from './pages/Admin';
import Legal from './pages/Legal';
import SaveTheDate from './pages/SaveTheDate';
import SaveTheDateEvent from './pages/SaveTheDateEvent';
import NotFound from './pages/NotFound';
import BottomNav from './components/BottomNav';
import Footer from './components/Footer';
import Header from './components/Header';
import ContactButton from './components/WhatsAppButton';
import CookieBanner from './components/CookieBanner';
import AdminToolbar from './components/admin/AdminToolbar';
import AdminSidebar from './components/AdminSidebar';
import DateChecker from './components/DateChecker';

import { useContent } from './context/ContentContext';
import { AdminProvider, useAdmin } from './context/AdminContext';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { 
    window.scrollTo(0, 0); 
  }, [pathname]);
  return null;
}

function PageContent() {
  const location = useLocation();
  const { content } = useContent();
  const { isAdminMode, logout } = useAdmin();
  const [activeTab, setActiveTab] = React.useState('home');
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  
  // SEO Injection
  useEffect(() => {
    const route = location.pathname;
    const pageSEO = content.seo?.pages?.[route] || content.seo?.global;
    if (pageSEO) {
      document.title = pageSEO.title;
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.name = 'description';
        document.head.appendChild(metaDesc);
      }
      metaDesc.content = pageSEO.description;
    }
  }, [location.pathname, content.seo]);
  useEffect(() => {
    if (content.theme) {
      const primaryColor = content.theme.primary || '#c5a059';
      document.documentElement.style.setProperty('--primary', primaryColor);
      document.documentElement.style.setProperty('--accent', content.theme.accent || '#e3c18c');
      document.body.style.backgroundColor = content.theme.background || '#ffffff';
      
      const hexToRgb = (hex) => {
        if (!hex) return null;
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        } : null;
      };
      
      const rgb = hexToRgb(primaryColor);
      if (rgb) {
        document.documentElement.style.setProperty('--primary-rgb', `${rgb.r}, ${rgb.g}, ${rgb.b}`);
      }
    }
  }, [content.theme]);

  // Hide global UI on /admin (login page) and /save-the-date/:slug (standalone share page)
  const isAdminLoginPage = location.pathname === '/admin';
  const isStandalonePage = isAdminLoginPage || /^\/save-the-date\/.+/.test(location.pathname);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {!isStandalonePage && <Header />}
      <main id="main-content" style={{ flexGrow: 1, position: 'relative' }}>
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
            <Route path="/save-the-date/:slug" element={<SaveTheDateEvent />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </div>
      </main>
      {!isStandalonePage && <Footer />}
      {!isStandalonePage && <BottomNav />}
      {!isStandalonePage && <ContactButton />}
      {!isStandalonePage && !isAdminMode && <DateChecker />}
      {!isStandalonePage && <AdminToolbar onOpenDashboard={() => setIsSidebarOpen(true)} />}
      
      {isAdminMode && (
        <AdminSidebar 
          isOpen={isSidebarOpen} 
          setIsOpen={setIsSidebarOpen} 
          onLogout={logout}
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
        />
      )}
      
      <CookieBanner />
      <ToastContainer />
    </div>
  );
}

function App() {
  useEffect(() => {
    let rafId;
    const handlePointerMove = (e) => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
        rafId = null;
      });
    };
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <ErrorBoundary>
      <Router>
        <AdminProvider>
          <ScrollToTop />
          <PageContent />
        </AdminProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
