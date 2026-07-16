import React, { useState, useEffect } from 'react';
import { Bell, Check, CheckCheck, Settings, Trash2 } from 'lucide-react';
import EmptyState from '../components/ui/EmptyState';
import '../styles/notifications.css';

interface Notification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'transaction' | 'security' | 'system';
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    // TODO: Fetch notifications from backend when endpoint is available
    // For now, use dummy data
    setTimeout(() => {
      setNotifications([
        { id: '1', title: 'Transaction Successful', message: 'You sent $50.00 to John Doe', time: '2 minutes ago', read: false, type: 'transaction' },
        { id: '2', title: 'Security Alert', message: 'New login detected from Chrome on Windows', time: '1 hour ago', read: false, type: 'security' },
        { id: '3', title: 'Top Up Successful', message: 'Your account has been credited with $500.00', time: 'Yesterday', read: true, type: 'transaction' },
        { id: '4', title: 'System Update', message: 'Bro Pay will undergo maintenance tonight', time: '2 days ago', read: true, type: 'system' },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const markAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="notifications-page">
      <div className="page-header">
        <div className="header-title">
          <h1>Notifications</h1>
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </div>
        {unreadCount > 0 && (
          <button className="btn-text" onClick={markAllAsRead}>
            <CheckCheck size={18} /> Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-list">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="notification-item skeleton">
              <div className="skeleton-avatar-box" style={{ width: 48, height: 48 }}></div>
              <div className="notification-content">
                <div className="skeleton-text-box" style={{ width: '40%' }}></div>
                <div className="skeleton-text-box" style={{ width: '80%' }}></div>
              </div>
            </div>
          ))
        ) : notifications.length === 0 ? (
          <EmptyState 
            icon={<Bell size={32} />}
            title="No notifications"
            description="You're all caught up! We'll let you know when there's something new."
          />
        ) : (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`notification-item ${!notification.read ? 'unread' : ''}`}
            >
              <div className={`notification-icon ${notification.type}`}>
                {notification.type === 'transaction' && <Check size={20} />}
                {notification.type === 'security' && <Bell size={20} />}
                {notification.type === 'system' && <Settings size={20} />}
              </div>
              <div className="notification-content">
                <h4>{notification.title}</h4>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
              <div className="notification-actions">
                {!notification.read && (
                  <button className="icon-btn-small" onClick={() => markAsRead(notification.id)} title="Mark as read">
                    <Check size={16} />
                  </button>
                )}
                <button className="icon-btn-small delete" onClick={() => deleteNotification(notification.id)} title="Delete">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notifications;
