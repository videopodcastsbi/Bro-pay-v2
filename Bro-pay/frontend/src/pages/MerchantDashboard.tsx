import React, { useState, useMemo } from 'react';
import { Store, DollarSign, TrendingUp, Users, CreditCard, BarChart3, Settings, Download } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import '../styles/merchant.css';

const MerchantDashboard: React.FC = () => {
  const [merchantName] = useState(() => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user).name + "'s Store" : 'My Store';
    } catch { return 'My Store'; }
  });

  const stats = [
    { label: 'Total Revenue', value: '$12,450', change: '+18.2%', icon: DollarSign, color: 'success' },
    { label: 'Transactions', value: '342', change: '+12.5%', icon: CreditCard, color: 'primary' },
    { label: 'Customers', value: '189', change: '+8.3%', icon: Users, color: 'warning' },
    { label: 'Avg. Transaction', value: '$36.40', change: '+5.1%', icon: TrendingUp, color: 'purple' },
  ];

  const qrCells = useMemo(() => Array.from({ length: 25 }, (_, i) => i % 3 === 0 || i % 5 === 0), []);

  const salesData = [
    { day: 'Mon', revenue: 1200 },
    { day: 'Tue', revenue: 1800 },
    { day: 'Wed', revenue: 1500 },
    { day: 'Thu', revenue: 2200 },
    { day: 'Fri', revenue: 2800 },
    { day: 'Sat', revenue: 3200 },
    { day: 'Sun', revenue: 2100 },
  ];

  const recentPayments = [
    { id: 1, customer: 'John Smith', amount: 45.00, method: 'QR Pay', time: '2 min ago' },
    { id: 2, customer: 'Maria Garcia', amount: 128.50, method: 'Card', time: '15 min ago' },
    { id: 3, customer: 'James Wilson', amount: 32.00, method: 'QR Pay', time: '1 hour ago' },
    { id: 4, customer: 'Emma Brown', amount: 89.99, method: 'Transfer', time: '2 hours ago' },
    { id: 5, customer: 'David Lee', amount: 15.00, method: 'QR Pay', time: '3 hours ago' },
  ];

  return (
    <div className="merchant-page">
      <div className="page-header">
        <div>
          <h1>{merchantName}</h1>
          <p>Manage your business payments and analytics</p>
        </div>
        <div className="header-actions">
          <button className="btn btn-secondary">
            <Download size={16} />
            Export Report
          </button>
          <button className="btn btn-secondary">
            <Settings size={16} />
            Settings
          </button>
        </div>
      </div>

      <div className="merchant-stats">
        {stats.map((stat, i) => (
          <div key={i} className="merchant-stat-card">
            <div className={`stat-icon ${stat.color}`}>
              <stat.icon size={20} />
            </div>
            <div className="stat-content">
              <span className="stat-label">{stat.label}</span>
              <span className="stat-value">{stat.value}</span>
              <span className="stat-change positive">{stat.change} this week</span>
            </div>
          </div>
        ))}
      </div>

      <div className="merchant-grid">
        <div className="merchant-card span-2">
          <div className="card-header">
            <h3><BarChart3 size={18} /> Revenue Overview</h3>
            <div className="period-tabs">
              <button className="active">Week</button>
              <button>Month</button>
              <button>Year</button>
            </div>
          </div>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                <XAxis dataKey="day" stroke="var(--text-muted)" fontSize={12} />
                <YAxis stroke="var(--text-muted)" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px'
                  }}
                  formatter={(value) => [`$${value}`, 'Revenue']}
                />
                <Bar dataKey="revenue" fill="#2563EB" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="merchant-card">
          <h3>Recent Payments</h3>
          <div className="payments-list">
            {recentPayments.map(payment => (
              <div key={payment.id} className="payment-item">
                <div className="payment-avatar">
                  {payment.customer.split(' ').map(n => n[0]).join('')}
                </div>
                <div className="payment-info">
                  <span className="payment-name">{payment.customer}</span>
                  <span className="payment-meta">{payment.method} · {payment.time}</span>
                </div>
                <span className="payment-amount">+${payment.amount.toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="merchant-card qr-section">
        <h3>Accept QR Payment</h3>
        <div className="qr-accept">
          <div className="qr-display">
            <div className="qr-pattern">
              {qrCells.map((filled, i) => (
                <div key={i} className={`qr-cell ${filled ? 'filled' : ''}`} />
              ))}
            </div>
          </div>
          <div className="qr-info">
            <p>Display this QR code at your store for customers to scan and pay</p>
            <button className="btn btn-primary">
              <Store size={16} />
              Regenerate QR Code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MerchantDashboard;
