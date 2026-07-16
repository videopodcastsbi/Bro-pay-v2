import React, { useState } from 'react';
import { Sun, Moon, Bell, Globe, Lock, Monitor, ChevronRight, Check } from 'lucide-react';
import '../styles/settings.css';

const Settings: React.FC = () => {
  const [theme, setTheme] = useState<'light' | 'dark' | 'system'>('system');
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    transactions: true,
    marketing: false,
  });
  const [language, setLanguage] = useState('en');

  const handleThemeChange = (newTheme: 'light' | 'dark' | 'system') => {
    setTheme(newTheme);
  };

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div className="settings-page">
      <div className="page-header">
        <h1>Settings</h1>
      </div>

      <div className="settings-layout">
        <div className="settings-section">
          <h3>Appearance</h3>
          <div className="settings-card">
            <div className="theme-options">
              <button 
                className={`theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => handleThemeChange('light')}
              >
                <Sun size={20} />
                <span>Light</span>
                {theme === 'light' && <div className="check-icon"><Check size={14} /></div>}
              </button>
              <button 
                className={`theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => handleThemeChange('dark')}
              >
                <Moon size={20} />
                <span>Dark</span>
                {theme === 'dark' && <div className="check-icon"><Check size={14} /></div>}
              </button>
              <button 
                className={`theme-btn ${theme === 'system' ? 'active' : ''}`}
                onClick={() => handleThemeChange('system')}
              >
                <Monitor size={20} />
                <span>System</span>
                {theme === 'system' && <div className="check-icon"><Check size={14} /></div>}
              </button>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>Notifications</h3>
          <div className="settings-card">
            <div className="setting-item">
              <div className="item-info">
                <Bell size={20} />
                <div>
                  <h4>Push Notifications</h4>
                  <p>Receive push notifications on your devices</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={notifications.push} onChange={() => toggleNotification('push')} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="item-info">
                <Bell size={20} />
                <div>
                  <h4>Email Notifications</h4>
                  <p>Receive email updates about your account</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={notifications.email} onChange={() => toggleNotification('email')} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="item-info">
                <Bell size={20} />
                <div>
                  <h4>Transaction Alerts</h4>
                  <p>Get notified for every transaction</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={notifications.transactions} onChange={() => toggleNotification('transactions')} />
                <span className="slider round"></span>
              </label>
            </div>
            <div className="setting-item">
              <div className="item-info">
                <Bell size={20} />
                <div>
                  <h4>Marketing</h4>
                  <p>Receive tips, tricks, and product updates</p>
                </div>
              </div>
              <label className="toggle-switch">
                <input type="checkbox" checked={notifications.marketing} onChange={() => toggleNotification('marketing')} />
                <span className="slider round"></span>
              </label>
            </div>
          </div>
        </div>

        <div className="settings-section">
          <h3>General</h3>
          <div className="settings-card list-card">
            <button className="list-item">
              <div className="item-info">
                <Globe size={20} />
                <div>
                  <h4>Language</h4>
                  <p>English (US)</p>
                </div>
              </div>
              <ChevronRight size={20} className="chevron" />
            </button>
            <button className="list-item">
              <div className="item-info">
                <Lock size={20} />
                <div>
                  <h4>Privacy & Security</h4>
                  <p>Manage your privacy settings</p>
                </div>
              </div>
              <ChevronRight size={20} className="chevron" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
