// src/components/NavBar.tsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  if (!token) return null;

return (
  <nav className="bg-white shadow-md">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        {/* LOGO - HUST CHATBOT */}
        <div className="flex items-center space-x-8">
          <span className="text-3xl font-extrabold bg-gradient-to-r from-red-600 to-black bg-clip-text text-transparent tracking-wide select-none">
            HUST CHATBOT
          </span>
          <div className="flex space-x-4">
            <Link
              to="/chat"
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition"
            >
              Chat
            </Link>
            {role === 'admin' && (
              <Link
                to="/admin"
                className="px-5 py-2 bg-green-600 text-white font-medium rounded-md hover:bg-green-700 transition"
              >
                Admin
              </Link>
            )}
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-red-600 font-medium rounded-md hover:bg-red-100 transition"
        >
          Logout
        </button>
      </div>
    </div>
  </nav>
);

}
