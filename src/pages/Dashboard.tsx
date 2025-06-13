import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionTimeout } from '../hooks/useSessionTimeout';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { clearSession } = useSessionTimeout();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <nav className="dashboard-nav">
        <h1>Welcome, {username}!</h1>
        <button onClick={handleLogout}>Logout</button>
      </nav>
      <div className="dashboard-content">
        <h2>Dashboard</h2>
        <p>This is a protected page. You can only see this if you're logged in.</p>
      </div>
    </div>
  );
}; 