import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionTimeout } from '../../hooks/useSessionTimeout';
import { useTheme } from '../../context/ThemeContext';

export const ProfileSection: React.FC = () => {
  const navigate = useNavigate();
  const { clearSession } = useSessionTimeout();
  const { theme, toggleTheme } = useTheme();
  const username = localStorage.getItem('username');

  const handleLogout = () => {
    clearSession();
    navigate('/login');
  };

  const iconBtnClass =
    'w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-gray-600 transition-colors';

  return (
    <div className="flex items-center gap-2">
      {/* Avatar and username */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center text-white text-base font-semibold">
          {username?.charAt(0).toUpperCase()}
        </div>
        <span className="text-sm font-medium hidden md:inline text-gray-900 dark:text-white">{username}</span>
      </div>
      {/* Theme toggle icon */}
      <button
        onClick={toggleTheme}
        className={iconBtnClass}
        aria-label="Toggle theme"
      >
        {theme === 'light' ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        )}
      </button>
      {/* Logout icon */}
      <button
        onClick={handleLogout}
        className={iconBtnClass + ' text-red-600 dark:text-red-400'}
        aria-label="Logout"
      >
        <svg viewBox="0 0 64 64" fill="none" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="36" r="18" stroke="white" strokeWidth="3"/>
          <rect x="30.5" y="14" width="3" height="16" rx="1.5" fill="white"/>
        </svg>
      </button>
    </div>
  );
}; 