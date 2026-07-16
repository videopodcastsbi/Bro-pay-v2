import React, { useState, useMemo } from 'react';
import { Plus, Target, Calendar, TrendingUp, Edit2, Trash2, Trophy } from 'lucide-react';
import '../styles/goal-saving.css';

interface SavingsGoal {
  id: number;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

const GoalSaving: React.FC = () => {
  const [goals, setGoals] = useState<SavingsGoal[]>([
    { id: 1, name: 'Emergency Fund', targetAmount: 10000, currentAmount: 6500, deadline: '2026-12-31', icon: '🛡️', color: '#2563EB' },
    { id: 2, name: 'Vacation Trip', targetAmount: 3000, currentAmount: 1200, deadline: '2026-09-15', icon: '✈️', color: '#10B981' },
    { id: 3, name: 'New Laptop', targetAmount: 2000, currentAmount: 1800, deadline: '2026-08-01', icon: '💻', color: '#8B5CF6' },
    { id: 4, name: 'Car Down Payment', targetAmount: 15000, currentAmount: 4500, deadline: '2027-06-01', icon: '🚗', color: '#F59E0B' },
  ]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newGoal, setNewGoal] = useState({ name: '', target: '', deadline: '', icon: '🎯', color: '#2563EB' });

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalSaved = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  const addGoal = () => {
    if (newGoal.name && newGoal.target) {
      setGoals([...goals, {
        id: Date.now(),
        name: newGoal.name,
        targetAmount: Number(newGoal.target),
        currentAmount: 0,
        deadline: newGoal.deadline,
        icon: newGoal.icon,
        color: newGoal.color,
      }]);
      setNewGoal({ name: '', target: '', deadline: '', icon: '🎯', color: '#2563EB' });
      setShowAddModal(false);
    }
  };

  const deleteGoal = (id: number) => setGoals(goals.filter(g => g.id !== id));

  const [nowTimestamp] = useState(() => Date.now());

  const getDaysLeft = (deadline: string) => {
    const diff = new Date(deadline).getTime() - nowTimestamp;
    return Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
  };

  return (
    <div className="goal-page">
      <div className="page-header">
        <div>
          <h1>Goal Saving</h1>
          <p>Set financial targets and track your progress toward each goal</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAddModal(true)}>
          <Plus size={18} />
          Add Goal
        </button>
      </div>

      <div className="goal-overview">
        <div className="overview-card">
          <Trophy size={24} className="overview-icon" />
          <div>
            <span className="overview-label">Total Goals</span>
            <span className="overview-value">{goals.length}</span>
          </div>
        </div>
        <div className="overview-card">
          <Target size={24} className="overview-icon" />
          <div>
            <span className="overview-label">Total Target</span>
            <span className="overview-value">${totalTarget.toLocaleString()}</span>
          </div>
        </div>
        <div className="overview-card">
          <TrendingUp size={24} className="overview-icon" />
          <div>
            <span className="overview-label">Total Saved</span>
            <span className="overview-value">${totalSaved.toLocaleString()}</span>
            <span className="overview-percentage">{((totalSaved / totalTarget) * 100).toFixed(1)}% of target</span>
          </div>
        </div>
      </div>

      <div className="goals-grid">
        {goals.map(goal => {
          const percentage = Math.min((goal.currentAmount / goal.targetAmount) * 100, 100);
          const daysLeft = getDaysLeft(goal.deadline);
          return (
            <div key={goal.id} className="goal-card">
              <div className="goal-card-header">
                <div className="goal-icon" style={{ background: `${goal.color}20`, color: goal.color }}>
                  {goal.icon}
                </div>
                <div className="goal-actions">
                  <button className="action-btn"><Edit2 size={14} /></button>
                  <button className="action-btn delete" onClick={() => deleteGoal(goal.id)}><Trash2 size={14} /></button>
                </div>
              </div>
              <h3>{goal.name}</h3>
              <div className="goal-amounts">
                <span className="current">${goal.currentAmount.toLocaleString()}</span>
                <span className="target">of ${goal.targetAmount.toLocaleString()}</span>
              </div>
              <div className="goal-progress">
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${percentage}%`, background: goal.color }}></div>
                </div>
                <span className="progress-text">{percentage.toFixed(0)}%</span>
              </div>
              <div className="goal-footer">
                <span className="deadline">
                  <Calendar size={14} />
                  {daysLeft} days left
                </span>
                <button className="btn btn-sm btn-primary">
                  + Add Funds
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create Savings Goal</h2>
            <div className="input-group">
              <label>Goal Name</label>
              <input type="text" className="input-field" placeholder="e.g., New Car" value={newGoal.name} onChange={(e) => setNewGoal({ ...newGoal, name: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Target Amount ($)</label>
              <input type="number" className="input-field" placeholder="0.00" value={newGoal.target} onChange={(e) => setNewGoal({ ...newGoal, target: e.target.value })} />
            </div>
            <div className="input-group">
              <label>Deadline</label>
              <input type="date" className="input-field" value={newGoal.deadline} onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })} />
            </div>
            <div className="modal-actions">
              <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={addGoal}>Create Goal</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GoalSaving;
