// src/pages/RegisterPage.tsx
import React, { useState } from 'react';
import { register } from '../api/auth';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, email, password);
      navigate('/login');
    } catch (err: any) {
      alert('Đăng ký thất bại: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-teal-200 via-blue-200 to-blue-300">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center gap-6 w-full max-w-md"
      >
        <h2 className="font-extrabold text-3xl mb-2 text-blue-600 tracking-wide">
          Đăng ký
        </h2>
        <input
          type="text"
          placeholder="Tên đăng nhập"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full text-lg rounded-xl border border-gray-200 px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          autoFocus
          disabled={loading}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          className="w-full text-lg rounded-xl border border-gray-200 px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          disabled={loading}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full text-lg rounded-xl border border-gray-200 px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
          disabled={loading}
        />
        <button
          type="submit"
          className={`w-full py-3 mt-2 text-lg font-bold text-white rounded-2xl bg-gradient-to-r from-teal-400 to-blue-500 shadow-lg transition-all duration-150 ${
            loading ? "opacity-70 cursor-not-allowed" : "hover:scale-105 hover:shadow-2xl"
          }`}
          disabled={loading}
        >
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10" stroke="white" strokeWidth="4" fill="none"/>
                <path className="opacity-70" fill="white" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
              </svg>
              Đang đăng ký...
            </div>
          ) : (
            "Đăng ký"
          )}
        </button>
        <div className="mt-2">
          <span className="text-gray-500 text-sm">
            Đã có tài khoản?{" "}
            <Link to="/login" className="text-blue-600 underline hover:text-blue-800">
              Đăng nhập
            </Link>
          </span>
        </div>
      </form>
    </div>
  );
}
