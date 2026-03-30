import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import { LogOut, Layout } from 'lucide-react';

const AdminToolbar = ({ onOpenDashboard }) => {
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
      bottom: '100px', // Above the BottomNav
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 99998,
      background: 'rgba(26, 26, 26, 0.95)',
      backdropFilter: 'blur(20px)',
      WebkitBackdropFilter: 'blur(20px)',
      border: '1px solid rgba(197, 160, 89, 0.4)',
      borderRadius: '50px',
      padding: '8px 12px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      boxShadow: '0 12px 40px rgba(0,0,0,0.5)',
      animation: 'slideUpToolbar 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      pointerEvents: 'auto',
    }}>
      {/* CMS DASHBOARD BUTTON */}
      <button
        onClick={onOpenDashboard}
        style={{
          background: 'var(--primary)',
          color: '#fff',
          border: 'none',
          borderRadius: '50px',
          padding: '8px 16px',
          fontSize: '13px',
          fontWeight: 800,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          boxShadow: '0 4px 15px rgba(197, 160, 89, 0.3)',
        }}
      >
        <Layout size={14} /> Dashboard
      </button>

      {/* Divider */}
      <div style={{ width: '1px', height: '20px', background: 'rgba(255,255,255,0.1)' }} />

      {/* Logout */}
      <button
        onClick={handleLogout}
        style={{
          background: 'rgba(255, 255, 255, 0.05)',
          color: '#ef4444',
          border: 'none',
          borderRadius: '50px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: 700,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
        }}
      >
        <LogOut size={13} />
      </button>

      <style>{`
        @keyframes slideUpToolbar {
          from { transform: translate(-50%, 100%); opacity: 0; }
          to { transform: translate(-50%, 0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default AdminToolbar;
