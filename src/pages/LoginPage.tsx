// src/pages/LoginPage.tsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login(username, password);
    navigate('/', { replace: true });
  } catch (err: unknown) {
    // Narrow down err thành Error để lấy message
    const message =
      err instanceof Error
        ? err.message
        : typeof err === "string"
        ? err
        : "Lỗi không xác định";
    alert("Đăng nhập thất bại: " + message);
  }
};


  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">Đăng Nhập</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
          className="w-full border p-2 rounded"
        />
        <button
          type="submit"
          className="w-full bg-green-500 hover:bg-green-600 text-white p-2 rounded"
        >
          Login
        </button>
      </form>

      {/* Dòng dẫn sang trang đăng ký */}
      <p className="mt-4 text-center">
        Chưa có tài khoản?{' '}
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Đăng ký ngay
        </Link>
      </p>
    </div>
  );
}
