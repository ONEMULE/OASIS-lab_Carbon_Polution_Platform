'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  EyeIcon, 
  EyeSlashIcon, 
  UserIcon, 
  LockClosedIcon,
  ExclamationTriangleIcon 
} from '@heroicons/react/24/outline';

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    remember: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      await login(formData);
      router.push('/dashboard');
    } catch {
      setError('用户名或密码错误');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const demoUsers = [
    { username: 'admin', role: '管理员', description: '完整系统权限' },
    { username: 'analyst', role: '分析人员', description: '数据分析和导出' },
    { username: 'visitor', role: '访客', description: '只读访问权限' },
  ];

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center">
              <span className="text-black libre-baskerville-bold text-2xl">PM</span>
            </div>
          </div>
          <Typography variant="h3" className="mb-2 noto-serif-sc-bold">
            污染监测系统
          </Typography>
          <Typography variant="body-large" className="text-gray-400 libre-baskerville-regular">
            环境数据智能分析平台
          </Typography>
        </div>

        {/* Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center">用户登录</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Username Field */}
              <div>
                <label className="block text-sm noto-serif-sc-medium text-gray-300 mb-2">
                  用户名
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <UserIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent libre-baskerville-regular"
                    placeholder="请输入用户名"
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label className="block text-sm noto-serif-sc-medium text-gray-300 mb-2">
                  密码
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                    <LockClosedIcon className="w-5 h-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-12 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent libre-baskerville-regular"
                    placeholder="请输入密码"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="w-5 h-5" />
                    ) : (
                      <EyeIcon className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  name="remember"
                  checked={formData.remember}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-white bg-medium-gray border-gray-600 rounded focus:ring-white focus:ring-2"
                />
                <label className="ml-2 block text-sm libre-baskerville-regular text-gray-300">
                  记住登录状态
                </label>
              </div>

              {/* Error Message */}
              {error && (
                <div className="flex items-center space-x-2 text-red-400 text-sm">
                  <ExclamationTriangleIcon className="w-4 h-4" />
                  <span>{error}</span>
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    登录中...
                  </>
                ) : (
                  '登录'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Demo Accounts */}
        <Card>
          <CardHeader>
            <CardTitle className="text-center text-lg">演示账户</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {demoUsers.map((user) => (
                <div key={user.username} className="flex items-center justify-between p-3 bg-medium-gray rounded-lg">
                  <div>
                    <div className="libre-baskerville-bold text-white">{user.username}</div>
                    <div className="text-sm libre-baskerville-regular text-gray-400">{user.role} · {user.description}</div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, username: user.username, password: 'password123' }))}
                  >
                    使用
                  </Button>
                </div>
              ))}
            </div>
            <div className="mt-4 text-center text-sm text-gray-500">
              默认密码: password123
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center text-sm libre-baskerville-regular text-gray-500">
          © 2024 环境监测系统 · 技术支持
        </div>
      </div>
    </div>
  );
};

export default LoginPage;