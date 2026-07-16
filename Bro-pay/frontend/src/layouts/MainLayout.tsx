import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Wallet, Send, PieChart, Target, CreditCard,
  QrCode, Users, UserPlus, Store, User, Settings, LogOut, Search,
  Bell, Moon, Sun, Menu, X
} from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import '../styles/layout.css';

const navItems = [
  { path: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { path: '/wallet', label: 'Wallet', icon: Wallet },
  { path: '/transfer', label: 'Transfer', icon: Send },
  { path: '/analytics', label: 'Analytics', icon: PieChart },
  { path: '/budget', label: 'Smart Budget', icon: Target },
  { path: '/goals', label: 'Goal Saving', icon: Target },
  { path: '/qr-payment', label: 'QR Payment', icon: QrCode },
  { path: '/split-bill', label: 'Split Bill', icon: Users },
  { path: '/request-money', label: 'Request Money', icon: UserPlus },
  { path: '/merchant', label: 'Merchant', icon: Store },
  { path: '/profile', label: 'Profile', icon: User },
  { path: '/settings', label: 'Settings', icon: Settings },
];

const MainLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userName, setUserName] = useState<string>(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).name : 'User';
    } catch { return 'User'; }
  });

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className={`app-layout ${mobileMenuOpen ? 'sidebar-open' : ''}`}>
      {/* Sidebar Overlay for Mobile */}
      {mobileMenuOpen && <div className="sidebar-overlay" onClick={() => setMobileMenuOpen(false)} />}

      {/* Sidebar */}
      <aside className={`sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">BP</div>
            <span className="logo-text">Bro Pay</span>
          </div>
          <button className="mobile-close" onClick={() => setMobileMenuOpen(false)}>
            <X size={24} />
          </button>
        </div>
        
        <nav className="sidebar-nav">
          {navItems.map((item) => (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`nav-item ${location.pathname === item.path ? 'active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="sidebar-footer">
          <button className="nav-item logout-btn" onClick={handleLogout}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="main-content-wrapper">
        {/* Topbar */}
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="search-container">
              <Search size={18} className="search-icon" />
              <input type="text" placeholder="Search anything..." className="search-input" />
            </div>
          </div>
          
          <div className="topbar-right">
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
            </button>
            <button className="icon-btn notification-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="user-profile">
              <div className="user-avatar">
                {userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div className="user-info">
                <span className="user-name">{userName}</span>
                <span className="user-role">Premium Member</span>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
