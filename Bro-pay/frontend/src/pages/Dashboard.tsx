import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Wallet, Send, ArrowDownLeft, ArrowUpRight, Plus, Sparkles,
  Target, TrendingUp, Eye, EyeOff, CreditCard, ArrowRight,
  PiggyBank, Zap
} from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis } from 'recharts';
import { api } from '../services/api';
import '../styles/dashboard.css';

interface Transaction {
  id: number;
  name: string;
  type: string;
  amount: number;
  date: string;
}

const miniChartData = [
  { d: '1', v: 2400 },
  { d: '2', v: 1398 },
  { d: '3', v: 3800 },
  { d: '4', v: 4900 },
  { d: '5', v: 3200 },
  { d: '6', v: 5200 },
  { d: '7', v: 4100 },
];

const aiInsights = [
  { icon: '💡', title: 'Spending Alert', desc: 'You spent 23% more on dining this week. Consider cooking at home.', type: 'warning' },
  { icon: '🎯', title: 'Savings Goal', desc: "You're 65% towards your Emergency Fund goal. Keep going!", type: 'success' },
  { icon: '📊', title: 'Budget Tip', desc: 'Switching to annual subscriptions could save you $180/year.', type: 'info' },
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState<number>(0);
  const [income, setIncome] = useState<number>(0);
  const [expense, setExpense] = useState<number>(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [userName, setUserName] = useState<string>('John Doe');
  const [loading, setLoading] = useState<boolean>(true);
  const [balanceHidden, setBalanceHidden] = useState(false);

  const fetchDashboardData = async () => {
    try {
      const data = await api.dashboard.get();
      setBalance(data.balance);
      setIncome(data.income);
      setExpense(data.expense);
      setTransactions(data.transactions);
    } catch (_err) {
      console.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        if (parsed && parsed.name) setUserName(parsed.name);
      } catch (_err) { /* use default */ }
    }
    fetchDashboardData();
  }, []);

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const formatMoney = (n: number) =>
    balanceHidden ? '••••••' : `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const savings = income - expense;

  if (loading) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-hero skeleton-hero">
          <div className="skeleton-line w60"></div>
          <div className="skeleton-line w40 h40"></div>
          <div className="skeleton-line w80"></div>
        </div>
        <div className="stats-row">
          {[1, 2, 3].map(i => (
            <div key={i} className="stat-card skeleton-card">
              <div className="skeleton-line w50"></div>
              <div className="skeleton-line w30 h24"></div>
              <div className="skeleton-line w40"></div>
            </div>
          ))}
        </div>
        <div className="dashboard-grid">
          <div className="skeleton-card h300"></div>
          <div className="skeleton-card h300"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {/* Hero Balance Card */}
      <div className="dashboard-hero">
        <div className="hero-top">
          <div className="hero-greeting">
            <h1>{getGreeting()}, {userName.split(' ')[0]}!</h1>
            <p>Here's your financial overview</p>
          </div>
          <button className="btn btn-secondary btn-sm" onClick={() => navigate('/notifications')}>
            View All Activity
          </button>
        </div>

        <div className="balance-card">
          <div className="balance-header">
            <div className="balance-label">
              <Wallet size={20} />
              <span>Total Balance</span>
            </div>
            <button className="visibility-toggle" onClick={() => setBalanceHidden(!balanceHidden)}>
              {balanceHidden ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <div className="balance-amount">{formatMoney(balance)}</div>
          <div className="balance-trend">
            <TrendingUp size={16} />
            <span>+2.5% from last month</span>
          </div>
          <div className="balance-chart">
            <ResponsiveContainer width="100%" height={80}>
              <AreaChart data={miniChartData}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0)" />
                  </linearGradient>
                </defs>
                <XAxis dataKey="d" hide />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '8px' }}
                  formatter={(value) => [`$${value}`, 'Balance']}
                />
                <Area type="monotone" dataKey="v" stroke="rgba(255,255,255,0.8)" fill="url(#balanceGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="quick-actions">
            <button className="quick-action" onClick={() => navigate('/transfer')}>
              <div className="qa-icon"><Send size={20} /></div>
              <span>Send</span>
            </button>
            <button className="quick-action" onClick={() => navigate('/request-money')}>
              <div className="qa-icon"><ArrowDownLeft size={20} /></div>
              <span>Request</span>
            </button>
            <button className="quick-action" onClick={() => navigate('/wallet')}>
              <div className="qa-icon"><Plus size={20} /></div>
              <span>Top Up</span>
            </button>
            <button className="quick-action" onClick={() => navigate('/qr-payment')}>
              <div className="qr-icon-wrapper"><CreditCard size={20} /></div>
              <span>QR Pay</span>
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="stats-row">
        <div className="stat-card income-card">
          <div className="stat-icon-wrap income">
            <ArrowDownLeft size={20} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Income</span>
            <span className="stat-value">{formatMoney(income)}</span>
            <span className="stat-trend positive">+12.5%</span>
          </div>
        </div>
        <div className="stat-card expense-card">
          <div className="stat-icon-wrap expense">
            <ArrowUpRight size={20} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Expenses</span>
            <span className="stat-value">{formatMoney(expense)}</span>
            <span className="stat-trend negative">+4.2%</span>
          </div>
        </div>
        <div className="stat-card savings-card">
          <div className="stat-icon-wrap savings">
            <PiggyBank size={20} />
          </div>
          <div className="stat-body">
            <span className="stat-label">Savings</span>
            <span className="stat-value">{formatMoney(savings)}</span>
            <span className="stat-trend positive">+8.3%</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        {/* Recent Transactions */}
        <div className="dashboard-card transactions-card">
          <div className="card-header">
            <h3>Recent Transactions</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/transactions')}>
              View All <ArrowRight size={14} />
            </button>
          </div>
          {transactions.length === 0 ? (
            <div className="empty-state-mini">
              <CreditCard size={40} />
              <p>No transactions yet</p>
              <button className="btn btn-primary btn-sm" onClick={() => navigate('/transfer')}>Make your first transfer</button>
            </div>
          ) : (
            <div className="transactions-list">
              {transactions.slice(0, 5).map(tx => (
                <div key={tx.id} className="transaction-item" onClick={() => navigate(`/transactions/${tx.id}`)}>
                  <div className={`tx-icon ${tx.type}`}>
                    {tx.type === 'income' ? <ArrowDownLeft size={18} /> : <ArrowUpRight size={18} />}
                  </div>
                  <div className="tx-details">
                    <span className="tx-name">{tx.name}</span>
                    <span className="tx-date">{tx.date}</span>
                  </div>
                  <span className={`tx-amount ${tx.type}`}>
                    {tx.type === 'income' ? '+' : '-'}${tx.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="dashboard-card ai-card">
          <div className="card-header">
            <h3><Sparkles size={18} className="sparkle-icon" /> AI Insights</h3>
            <span className="ai-badge">Beta</span>
          </div>
          <div className="insights-list">
            {aiInsights.map((insight, i) => (
              <div key={i} className={`insight-item ${insight.type}`}>
                <span className="insight-icon">{insight.icon}</span>
                <div className="insight-content">
                  <h4>{insight.title}</h4>
                  <p>{insight.desc}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="btn btn-ghost btn-sm full-width">
            <Zap size={14} />
            Get more insights
          </button>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="dashboard-grid">
        {/* Goal Progress */}
        <div className="dashboard-card goal-preview">
          <div className="card-header">
            <h3><Target size={18} /> Savings Goals</h3>
            <button className="btn btn-ghost btn-sm" onClick={() => navigate('/goals')}>View All</button>
          </div>
          <div className="goal-items">
            {[
              { name: 'Emergency Fund', current: 6500, target: 10000, color: '#2563EB' },
              { name: 'Vacation Trip', current: 1200, target: 3000, color: '#10B981' },
              { name: 'New Laptop', current: 1800, target: 2000, color: '#8B5CF6' },
            ].map((goal, i) => (
              <div key={i} className="goal-item">
                <div className="goal-info">
                  <span className="goal-name">{goal.name}</span>
                  <span className="goal-pct">{((goal.current / goal.target) * 100).toFixed(0)}%</span>
                </div>
                <div className="goal-bar">
                  <div className="goal-fill" style={{ width: `${(goal.current / goal.target) * 100}%`, background: goal.color }}></div>
                </div>
                <div className="goal-amounts">
                  <span>${goal.current.toLocaleString()}</span>
                  <span>${goal.target.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="dashboard-card quick-links">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="links-grid">
            {[
              { label: 'Analytics', icon: TrendingUp, path: '/analytics', color: '#2563EB' },
              { label: 'Budget', icon: Target, path: '/budget', color: '#10B981' },
              { label: 'Split Bill', icon: CreditCard, path: '/split-bill', color: '#F59E0B' },
              { label: 'Merchant', icon: Wallet, path: '/merchant', color: '#8B5CF6' },
            ].map((link, i) => (
              <button key={i} className="link-item" onClick={() => navigate(link.path)}>
                <div className="link-icon" style={{ background: `${link.color}15`, color: link.color }}>
                  <link.icon size={20} />
                </div>
                <span>{link.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
