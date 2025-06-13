import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function NavBar() {
  const { token, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!token) return null; // chỉ hiện khi đã login

  return (
    <nav className="bg-gray-100 p-4 flex justify-between items-center">
      <div className="space-x-4">
        <Link to="/chat" className="text-blue-600 hover:underline">
          Chat
        </Link>
        {role === 'admin' && (
          <Link to="/admin" className="text-blue-600 hover:underline">
            Admin
          </Link>
        )}
      </div>
      <button
        onClick={handleLogout}
        className="text-red-600 hover:underline"
      >
        Logout
      </button>
    </nav>
  );
}
