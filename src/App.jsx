import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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
import AdminToolbar from './components/admin/AdminToolbar';
import AdminSidebar from './components/AdminSidebar';

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
  const [activeTab, setActiveTab] = React.useState('dashboard');
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

  // Hide global UI only on /admin (login page)
  const isAdminLoginPage = location.pathname === '/admin';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', position: 'relative' }}>
      {!isAdminLoginPage && <Header />}
      <main style={{ flexGrow: 1, position: 'relative' }}>
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
      </main>
      {!isAdminLoginPage && <Footer />}
      {!isAdminLoginPage && <BottomNav />}
      {!isAdminLoginPage && <ContactButton />}
      {!isAdminLoginPage && <AdminToolbar onOpenDashboard={() => setIsSidebarOpen(true)} />}
      
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
      <AdminProvider>
        <ScrollToTop />
        <PageContent />
      </AdminProvider>
    </Router>
  );
}

export default App;
