import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Calendar, Camera, User } from 'lucide-react';

const BottomNav = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 ios-nav z-50 px-4 pt-3 pb-safe-area">
      <div className="flex justify-around items-center h-56px max-w-md mx-auto relative">

        <NavLink
          to="/"
          className={({ isActive }) => `flex flex-col items-center justify-center space-y-1 w-16 transition-colors ${isActive ? 'text-accent' : 'text-text-muted hover:text-white'}`}
          style={({ isActive }) => isActive ? { filter: 'drop-shadow(0 0 8px rgba(255,46,147,0.6))' } : {}}
        >
          <Home size={24} strokeWidth={2.5} />
          <span className="text-xs font-semibold" style={{ fontSize: '10px' }}>Accueil</span>
        </NavLink>

        <NavLink
          to="/booking"
          className={({ isActive }) => `flex flex-col items-center justify-center space-y-1 w-16 transition-colors ${isActive ? 'text-accent' : 'text-text-muted hover:text-white'}`}
          style={({ isActive }) => isActive ? { filter: 'drop-shadow(0 0 8px rgba(255,46,147,0.6))' } : {}}
        >
          <Calendar size={24} strokeWidth={2.5} />
          <span className="text-xs font-semibold" style={{ fontSize: '10px' }}>Réservation</span>
        </NavLink>

        <NavLink
          to="/creator"
          className={({ isActive }) => `flex flex-col items-center justify-center space-y-1 w-16 transition-colors ${isActive ? 'text-accent' : 'text-text-muted hover:text-white'}`}
          style={({ isActive }) => isActive ? { filter: 'drop-shadow(0 0 8px rgba(255,46,147,0.6))' } : {}}
        >
          <Camera size={24} strokeWidth={2.5} />
          <span className="text-xs font-semibold" style={{ fontSize: '10px' }}>Laboratoire</span>
        </NavLink>

        <NavLink
          to="/profile"
          className={({ isActive }) => `flex flex-col items-center justify-center space-y-1 w-16 transition-colors ${isActive ? 'text-accent' : 'text-text-muted hover:text-white'}`}
          style={({ isActive }) => isActive ? { filter: 'drop-shadow(0 0 8px rgba(255,46,147,0.6))' } : {}}
        >
          <User size={24} strokeWidth={2.5} />
          <span className="text-xs font-semibold" style={{ fontSize: '10px' }}>Mon ID</span>
        </NavLink>

      </div>
      <div style={{ height: 'var(--safe-area-bottom)' }} />
    </nav>
  );
};

export default BottomNav;
