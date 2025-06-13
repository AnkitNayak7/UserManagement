import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './pages/Login';
import Dashboard from './pages/Dashboard';
import UserManagement from './pages/UserManagement';
import { ProtectedRoute } from './components/ProtectedRoute';
import { ThemeProvider } from './context/ThemeContext';
import { Header } from './components/Header/Header';
import './App.css';

function App() {
  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 transition-colors">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <Dashboard />
                  </>
                </ProtectedRoute>
              }
            />
            <Route
              path="/UserManagement"
              element={
                <ProtectedRoute>
                  <>
                    <Header />
                    <UserManagement />
                  </>
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
