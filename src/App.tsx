import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateLayout from './components/PrivateLayout';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import ChatPage from './pages/ChatPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public routes */}
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected layout */}
          <Route path="/" element={<PrivateLayout />}>
            {/* Khi đã auth và vào "/", tự động vào "/chat" */}
            <Route index element={<Navigate to="chat" replace />} />
            <Route path="chat" element={<ChatPage />} />
            <Route path="admin" element={<AdminPage />} />
          </Route>

          {/* Fallback: bất kỳ đường dẫn không khớp nào khác */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>

    </AuthProvider>
  );
}

// TODO: remove before prod”

// export default function App() {
//   return (
//     <div className="bg-red-500 text-white text-2xl p-10 rounded-3xl shadow-2xl">
//       Nếu bạn thấy nền đỏ và chữ trắng thì Tailwind hoạt động OK!
//     </div>
//   )
// }