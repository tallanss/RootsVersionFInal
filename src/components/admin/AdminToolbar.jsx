import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { LogOut, Eye } from 'lucide-react';

const AdminToolbar = () => {
  const { isAdminMode, logout } = useAdmin();
  const navigate = useNavigate();

  if (!isAdminMode) return null;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div style={{
      position: 'fixed',
      bottom: '90px', // Above the BottomNav
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99998,
      background: 'rgba(26, 26, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(197, 160, 89, 0.4)',
      borderRadius: '50px',
      padding: '10px 16px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      animation: 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'auto',
      whiteSpace: 'nowrap',
    }}>
      {/* Badge */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '6px',
        background: 'rgba(197, 160, 89, 0.15)',
        padding: '4px 10px', borderRadius: '20px',
        border: '1px solid rgba(197, 160, 89, 0.3)',
      }}>
        <span style={{ width: '7px', height: '7px', background: 'var(--primary)', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 8px var(--primary)' }} />
        <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--primary)', letterSpacing: '0.05em' }}>
          MODE ADMIN
        </span>
      </div>

      {/* Hint */}
      <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', display: 'none' }} className="admin-toolbar-hint">
        Survolez un bloc pour le modifier
      </span>

      {/* Divider */}
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          background: 'rgba(239, 68, 68, 0.15)',
          color: '#ef4444',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '20px',
          padding: '6px 12px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <LogOut size={13} /> Déconnexion
      </button>

      <style>{`
        @media (min-width: 640px) {
          .admin-toolbar-hint { display: inline !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminToolbar;
