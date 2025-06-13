import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import users from '../data/users.json';
import { SESSION_CONFIG } from '../config/session';

const generateSessionId = () => {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user = users.users.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      const sessionId = generateSessionId();
      const expiryTime = Date.now() + SESSION_CONFIG.TIMEOUT_DURATION;
      localStorage.setItem('sessionId', sessionId);
      localStorage.setItem('sessionExpiry', expiryTime.toString());
      localStorage.setItem('username', username);
      navigate('/dashboard');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
}; 