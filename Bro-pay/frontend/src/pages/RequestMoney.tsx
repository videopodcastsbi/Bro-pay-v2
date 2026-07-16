import React, { useState } from 'react';
import { UserPlus, DollarSign, Send, Clock, CheckCircle, XCircle, Plus } from 'lucide-react';
import '../styles/request-money.css';

interface MoneyRequest {
  id: number;
  from: string;
  amount: number;
  reason: string;
  date: string;
  status: 'pending' | 'accepted' | 'declined';
  avatar: string;
}

const RequestMoney: React.FC = () => {
  const [requests] = useState<MoneyRequest[]>([
    { id: 1, from: 'Alex Johnson', amount: 125.00, reason: 'Concert tickets', date: 'Jul 14, 2026', status: 'pending', avatar: 'AJ' },
    { id: 2, from: 'Sarah Wilson', amount: 45.50, reason: 'Lunch split', date: 'Jul 13, 2026', status: 'accepted', avatar: 'SW' },
    { id: 3, from: 'Mike Chen', amount: 200.00, reason: 'Birthday gift collection', date: 'Jul 10, 2026', status: 'pending', avatar: 'MC' },
    { id: 4, from: 'Emily Davis', amount: 30.00, reason: 'Book purchase', date: 'Jul 8, 2026', status: 'declined', avatar: 'ED' },
    { id: 5, from: 'Lisa Park', amount: 75.00, reason: 'Gym membership split', date: 'Jul 5, 2026', status: 'accepted', avatar: 'LP' },
  ]);
  const [showNewRequest, setShowNewRequest] = useState(false);
  const [newReq, setNewReq] = useState({ to: '', amount: '', reason: '' });

  const pendingRequests = requests.filter(r => r.status === 'pending');
  const totalPending = pendingRequests.reduce((s, r) => s + r.amount, 0);

  const createRequest = () => {
    if (newReq.to && newReq.amount) {
      setShowNewRequest(false);
      setNewReq({ to: '', amount: '', reason: '' });
    }
  };

  return (
    <div className="request-page">
      <div className="page-header">
        <div>
          <h1>Request Money</h1>
          <p>Send payment requests to friends and track status</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowNewRequest(true)}>
          <Plus size={18} />
          New Request
        </button>
      </div>

      <div className="request-stats">
        <div className="stat-card">
          <div className="stat-icon pending"><Clock size={20} /></div>
          <div>
            <span className="stat-label">Pending Requests</span>
            <span className="stat-value">{pendingRequests.length}</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amount"><DollarSign size={20} /></div>
          <div>
            <span className="stat-label">Total Pending</span>
            <span className="stat-value">${totalPending.toFixed(2)}</span>
          </div>
        </div>
      </div>

      <div className="requests-list">
        {requests.map(req => (
          <div key={req.id} className={`request-card ${req.status}`}>
            <div className="request-avatar">{req.avatar}</div>
            <div className="request-info">
              <h4>{req.from}</h4>
              <p>{req.reason}</p>
              <span className="request-date">{req.date}</span>
            </div>
            <div className="request-right">
              <span className="request-amount">${req.amount.toFixed(2)}</span>
              <span className={`status-badge ${req.status}`}>
                {req.status === 'pending' && <Clock size={12} />}
                {req.status === 'accepted' && <CheckCircle size={12} />}
                {req.status === 'declined' && <XCircle size={12} />}
                {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {showNewRequest && (
        <div className="modal-overlay" onClick={() => setShowNewRequest(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Request Money</h2>
            <div className="input-group">
              <label>To (Name or Email)</label>
              <input type="text" className="input-field" placeholder="name@example.com" value={newReq.to} onChange={(e) => setNewReq({ ...newReq, to: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Amount ($)</label>
              <input type="number" className="input-field" placeholder="0.00" value={newReq.amount} onChange={(e) => setNewReq({ ...newReq, amount: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Reason</label>
              <input type="text" className="input-field" placeholder="What's this for?" value={newReq.reason} onChange={(e) => setNewReq({ ...newReq, reason: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowNewRequest(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={createRequest}>
                <Send size={16} />
                Send Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestMoney;
