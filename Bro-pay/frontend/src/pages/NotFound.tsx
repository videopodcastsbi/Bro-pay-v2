import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import '../styles/not-found.css';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <div className="glitch" data-text="404">404</div>
        <h2>Page Not Found</h2>
        <p>The page you're looking for doesn't exist or has been moved.</p>
        
        <div className="action-buttons">
          <button className="btn-outline" onClick={() => navigate(-1)}>
            <ArrowLeft size={18} />
            Go Back
          </button>
          <button className="btn-primary" onClick={() => navigate('/dashboard')}>
            <Home size={18} />
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
