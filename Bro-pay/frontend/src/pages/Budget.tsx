import React, { useState } from 'react';
import { Plus, Target, TrendingUp, TrendingDown, Edit2, Trash2, CheckCircle } from 'lucide-react';
import '../styles/budget.css';

interface BudgetCategory {
  id: number;
  name: string;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
}

const Budget: React.FC = () => {
  const [budgets, setBudgets] = useState<BudgetCategory[]>([
    { id: 1, name: 'Food & Dining', allocated: 800, spent: 450, icon: '🍔', color: '#2563EB' },
    { id: 2, name: 'Transportation', allocated: 400, spent: 280, icon: '🚗', color: '#10B981' },
    { id: 3, name: 'Shopping', allocated: 500, spent: 520, icon: '🛍️', color: '#F59E0B' },
    { id: 4, name: 'Bills & Utilities', allocated: 600, spent: 200, icon: '💡', color: '#EF4444' },
    { id: 5, name: 'Entertainment', allocated: 300, spent: 150, icon: '🎬', color: '#8B5CF6' },
    { id: 6, name: 'Healthcare', allocated: 200, spent: 50, icon: '🏥', color: '#EC4899' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newBudget, setNewBudget] = useState({ name: '', allocated: '', icon: '💰', color: '#2563EB' });

  const totalAllocated = budgets.reduce((sum, b) => sum + b.allocated, 0);
  const totalSpent = budgets.reduce((sum, b) => sum + b.spent, 0);

  const addBudget = () => {
    if (newBudget.name && newBudget.allocated) {
      setBudgets([...budgets, {
        id: Date.now(),
        name: newBudget.name,
        allocated: Number(newBudget.allocated),
        spent: 0,
        icon: newBudget.icon,
        color: newBudget.color,
      }]);
      setNewBudget({ name: '', allocated: '', icon: '💰', color: '#2563EB' });
      setShowAddModal(false);
    }
  };

  const deleteBudget = (id: number) => {
    setBudgets(budgets.filter(b => b.id !== id));
  };

  return (
    <div className="budget-page">
      <div className="page-header">
        <div>
          <h1>Smart Budget</h1>
          <p>Set spending limits and track your budget in real-time</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Budget
        </button>
      </div>

      <div className="budget-overview">
        <div className="overview-card total">
          <div className="overview-icon">
            <Target size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">Total Budget</span>
            <span className="overview-value">${totalAllocated.toLocaleString()}</span>
          </div>
        </div>
        <div className="overview-card spent">
          <div className="overview-icon">
            <TrendingDown size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">Total Spent</span>
            <span className="overview-value">${totalSpent.toLocaleString()}</span>
            <span className="overview-percentage">{((totalSpent / totalAllocated) * 100).toFixed(1)}% used</span>
          </div>
        </div>
        <div className="overview-card remaining">
          <div className="overview-icon">
            <TrendingUp size={24} />
          </div>
          <div className="overview-content">
            <span className="overview-label">Remaining</span>
            <span className="overview-value">${(totalAllocated - totalSpent).toLocaleString()}</span>
            <span className="overview-percentage">{(((totalAllocated - totalSpent) / totalAllocated) * 100).toFixed(1)}% left</span>
          </div>
        </div>
      </div>

      <div className="budget-grid">
        {budgets.map(budget => {
          const percentage = Math.min((budget.spent / budget.allocated) * 100, 100);
          const isOver = budget.spent > budget.allocated;
          return (
            <div key={budget.id} className={`budget-card ${isOver ? 'over-budget' : ''}`}>
              <div className="budget-card-header">
                <div className="budget-icon" style={{ background: `${budget.color}20`, color: budget.color }}>
                  {budget.icon}
                </div>
                <div className="budget-actions">
                  <button className="action-btn"><Edit2 size={14} /></button>
                  <button className="action-btn delete" onClick={() => deleteBudget(budget.id)}><Trash2 size={14} /></button>
                </div>
              </div>
              <h3>{budget.name}</h3>
              <div className="budget-progress">
                <div className="progress-bar">
                  <div
                    className="progress-fill"
                    style={{ width: `${percentage}%`, background: isOver ? 'var(--danger)' : budget.color }}
                  ></div>
                </div>
                <div className="progress-info">
                  <span>${budget.spent.toLocaleString()} spent</span>
                  <span>${budget.allocated.toLocaleString()} limit</span>
                </div>
              </div>
              {isOver ? (
                <span className="budget-status over">Over budget by ${(budget.spent - budget.allocated).toLocaleString()}</span>
              ) : (
                <span className="budget-status ok">
                  <CheckCircle size={14} />
                  ${(budget.allocated - budget.spent).toLocaleString()} remaining
                </span>
              )}
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Add Budget Category</h2>
            <div className="input-group">
              <label>Category Name</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., Groceries"
                value={newBudget.name}
                onChange={(e) => setNewBudget({ ...newBudget, name: e.target.value })}
              />
            </div>
            <div className="input-group">
              <label>Monthly Limit ($)</label>
              <input
                type="number"
                className="input-field"
                placeholder="0.00"
                value={newBudget.allocated}
                onChange={(e) => setNewBudget({ ...newBudget, allocated: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addBudget}>Add Budget</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Budget;
