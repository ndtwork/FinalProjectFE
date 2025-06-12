// ---------------------- src/pages/LoginPage.tsx ----------------------
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login } from '../api/auth';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const data = await login(username, password);
    if (data.access_token) {
      setToken(data.access_token);
      navigate('/chat');
    } else {
      alert('Đăng nhập thất bại');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white/90 backdrop-blur-sm p-8 rounded-2xl shadow-2xl w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Đăng nhập</h1>
          <p className="text-gray-600">Vui lòng đăng nhập để tiếp tục</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Tên đăng nhập</label>
            <Input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Nhập tên đăng nhập"
              className="w-full h-11 text-base px-4 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Mật khẩu</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu"
              className="w-full h-11 text-base px-4 bg-white/50 backdrop-blur-sm border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-11 text-base font-medium bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200"
          >
            Đăng nhập
          </Button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Chưa có tài khoản?{' '}
            <a 
              href="/register" 
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Đăng ký ngay
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
