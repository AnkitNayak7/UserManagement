import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ProfileSection } from './ProfileDropdown';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <header className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo - Aligned to extreme left, clickable */}
          <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/dashboard')}>
            <svg
              className="h-8 w-8 text-blue-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            <span className="ml-2 text-xl font-semibold text-gray-900 dark:text-white select-none">
              Session App
            </span>
          </div>

          {/* Right side - User Management nav and Profile Section */}
          <div className="flex items-center justify-end flex-1 gap-4">
            {/* User Management navigation button, highlight if on that page */}
            <button
              className={`px-4 py-2 rounded font-medium transition-colors ${location.pathname === '/UserManagement' ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-blue-100 dark:hover:bg-gray-600'}`}
              onClick={() => navigate('/UserManagement')}
            >
              User Management
            </button>
            <ProfileSection />
          </div>
        </div>
      </div>
    </header>
  );
}; 