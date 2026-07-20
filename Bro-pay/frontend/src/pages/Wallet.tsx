import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ArrowDownLeft, ArrowUpRight, Send, CreditCard, Wallet as WalletIcon } from 'lucide-react';
import { api } from '../services/api';
import '../styles/wallet.css';

interface WalletData {
  id: string;
  name: string;
  currency: string;
  balance: number;
  color: string;
}

const Wallet: React.FC = () => {
  const navigate = useNavigate();
  const [wallets, setWallets] = useState<WalletData[]>([
    { id: '1', name: 'Main Balance', currency: 'USD', balance: 12450.00, color: 'var(--accent)' },
    { id: '2', name: 'Savings', currency: 'USD', balance: 5420.50, color: 'var(--success)' },
    { id: '3', name: 'Travel Fund', currency: 'EUR', balance: 1200.00, color: 'var(--warning)' }
  ]);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeWallet, setActiveWallet] = useState<string>('1');

  useEffect(() => {
    const fetchBalance = async () => {
      try {
        const res = await api.wallets.balance();
        setWallets(prev => prev.map((w, i) => i === 0 ? { ...w, balance: res.data.balance, currency: res.data.currency } : w));
      } catch (_err) {
        console.error('Failed to fetch wallet data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchBalance();
  }, []);

  return (
    <div className="wallet-page">
      <div className="page-header">
        <h1>My Wallets</h1>
        <button className="btn-primary-wallet">
          <Plus size={18} />
          <span>Add Wallet</span>
        </button>
      </div>

      {loading ? (
        <div className="wallet-cards-grid">
          {[1, 2].map(i => (
            <div key={i} className="wallet-card skeleton-card"></div>
          ))}
        </div>
      ) : (
        <>
          <div className="wallet-cards-grid">
            {wallets.map(wallet => (
              <div 
                key={wallet.id} 
                className={`wallet-card ${activeWallet === wallet.id ? 'active' : ''}`}
                style={{ '--wallet-color': wallet.color } as React.CSSProperties}
                onClick={() => setActiveWallet(wallet.id)}
              >
                <div className="wallet-card-header">
                  <div className="wallet-icon">
                    <WalletIcon size={24} />
                  </div>
                  <span className="wallet-currency">{wallet.currency}</span>
                </div>
                <div className="wallet-card-body">
                  <p className="wallet-label">{wallet.name}</p>
                  <h2 className="wallet-balance">
                    ${wallet.balance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                  </h2>
                </div>
                <div className="wallet-card-footer">
                  <span className="wallet-type">Digital Account</span>
                  <div className="wallet-dots">
                    <span></span><span></span><span></span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="wallet-actions">
            <button className="action-btn" onClick={() => navigate('/transfer')}>
              <div className="action-icon income"><ArrowDownLeft size={24} /></div>
              <span>Top Up</span>
            </button>
            <button className="action-btn">
              <div className="action-icon expense"><ArrowUpRight size={24} /></div>
              <span>Withdraw</span>
            </button>
            <button className="action-btn" onClick={() => navigate('/transfer')}>
              <div className="action-icon transfer"><Send size={24} /></div>
              <span>Transfer</span>
            </button>
            <button className="action-btn">
              <div className="action-icon card"><CreditCard size={24} /></div>
              <span>Card</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Wallet;
