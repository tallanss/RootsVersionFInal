import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Booking from './pages/Booking';
import Creator from './pages/Creator';
import Profile from './pages/Profile';
import BottomNav from './components/BottomNav';
import Header from './components/Header';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen relative overflow-x-hidden bg-bg-app">

        {/* 2030 Spatial Aurora Background */}
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 fixed">
          <div style={{ position: 'absolute', top: '-25%', right: '-25%', width: '80vw', height: '80vw', maxWidth: '600px', maxHeight: '600px', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.25, transform: 'translate(-40px, 40px)', background: 'var(--accent)' }} />
          <div style={{ position: 'absolute', top: '33%', left: '-25%', width: '60vw', height: '60vw', maxWidth: '500px', maxHeight: '500px', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, transform: 'translate(80px, 0) rotate(45deg)', background: '#2E93FF' }} />
          <div style={{ position: 'absolute', bottom: '-25%', right: '25%', width: '70vw', height: '70vw', maxWidth: '550px', maxHeight: '550px', borderRadius: '50%', filter: 'blur(100px)', opacity: 0.15, background: '#A12EFF' }} />
        </div>

        <Header className="z-50 relative" />

        {/* Main Content Area */}
        <main className="flex-grow animate-in relative z-10 text-text-main pb-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/creator" element={<Creator />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </main>

        {/* Bottom Navigation */}
        <BottomNav className="z-50 relative" />
      </div>
    </Router>
  );
}

export default App;
