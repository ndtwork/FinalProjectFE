// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(username, password);
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : typeof err === "string"
          ? err
          : "Lỗi không xác định";
      alert("Đăng nhập thất bại: " + message);
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
        Đăng nhập
      </h2>
      <input
        type="text"
        placeholder="Tên đăng nhập"
        value={username}
        onChange={e => setUsername(e.target.value)}
        className="w-full text-lg rounded-xl border border-gray-200 px-5 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-200 transition-all"
        autoFocus
        disabled={loading}
      />
      <input
        type="password"
        placeholder="Mật khẩu"
        value={password}
        onChange={e => setPassword(e.target.value)}
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
            Đang đăng nhập...
          </div>
        ) : (
          "Đăng nhập"
        )}
      </button>
      <div className="mt-2">
        <span className="text-gray-500 text-sm">
          Chưa có tài khoản?{" "}
          <Link to="/register" className="text-blue-600 underline hover:text-blue-800">
            Đăng ký
          </Link>
        </span>
      </div>
    </form>
  </div>
);

}
