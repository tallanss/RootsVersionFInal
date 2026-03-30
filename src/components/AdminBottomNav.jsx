import { 
  Home, 
  MessageSquare, 
  ImageIcon, 
  Settings, 
  MoreHorizontal 
} from 'lucide-react';

const AdminBottomNav = ({ activeTab, setActiveTab, setIsSidebarOpen }) => {
  const navItems = [
    { id: 'dashboard', label: 'Board', icon: Home },
    { id: 'messages', label: 'Inbox', icon: MessageSquare },
    { id: 'gallery', label: 'Media', icon: ImageIcon },
    { id: 'pricing', label: 'Style', icon: Settings },
  ];

  return (
    <nav className="admin-bottom-nav">
      {navItems.map((item) => (
        <button 
          key={item.id}
          onClick={() => setActiveTab(item.id)}
          className={`bottom-nav-item ${activeTab === item.id ? 'active' : ''}`}
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <item.icon size={22} />
          <span>{item.label}</span>
        </button>
      ))}
      <button 
        onClick={() => setIsSidebarOpen(true)}
        className="bottom-nav-item"
        style={{ background: 'none', border: 'none', cursor: 'pointer' }}
      >
        <MoreHorizontal size={22} />
        <span>Plus</span>
      </button>
    </nav>
  );
};

export default AdminBottomNav;
