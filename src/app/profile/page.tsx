'use client';

import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getRoleDisplayName, getRoleColor } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { 
  UserIcon,
  EnvelopeIcon,
  ShieldCheckIcon,
  CalendarIcon,
  ClockIcon,
  PencilIcon,
  KeyIcon,
} from '@heroicons/react/24/outline';

const ProfileContent: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // Here you would normally save the changes to the backend
    console.log('Saving profile changes:', formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
    });
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2">
              个人资料
            </Typography>
            <Typography variant="body-large" className="text-gray-400">
              管理您的账户信息和设置
            </Typography>
          </div>
          <Button
            onClick={() => setIsEditing(!isEditing)}
            variant={isEditing ? 'ghost' : 'secondary'}
            className="flex items-center space-x-2"
          >
            <PencilIcon className="w-4 h-4" />
            <span>{isEditing ? '取消编辑' : '编辑资料'}</span>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Info */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-medium-gray rounded-full flex items-center justify-center">
                    <UserIcon className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <Typography variant="h4">{user.username}</Typography>
                    <Typography variant="body-medium" className={getRoleColor(user.role)}>
                      {getRoleDisplayName(user.role)}
                    </Typography>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
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
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      邮箱地址
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <EnvelopeIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        disabled={!isEditing}
                        className="w-full pl-10 pr-4 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white disabled:opacity-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      用户角色
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                        <ShieldCheckIcon className="w-5 h-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        value={getRoleDisplayName(user.role)}
                        disabled
                        className="w-full pl-10 pr-4 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white opacity-50"
                      />
                    </div>
                  </div>
                </div>

                {/* Save/Cancel Buttons */}
                {isEditing && (
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button variant="ghost" onClick={handleCancel}>
                      取消
                    </Button>
                    <Button onClick={handleSave}>
                      保存更改
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Security Settings */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>安全设置</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <KeyIcon className="w-5 h-5 text-gray-400" />
                      <div>
                        <Typography variant="body-medium" className="font-medium">
                          修改密码
                        </Typography>
                        <Typography variant="body-small" className="text-gray-400">
                          定期更改密码以确保账户安全
                        </Typography>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      修改
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Account Stats */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>账户统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <CalendarIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">创建时间</span>
                    </div>
                    <span className="text-sm text-white">
                      {user.createdAt.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <ClockIcon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-400">最后登录</span>
                    </div>
                    <span className="text-sm text-white">
                      {user.lastLogin ? user.lastLogin.toLocaleDateString() : '从未登录'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>权限列表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {user.permissions.map((permission) => (
                    <div
                      key={permission}
                      className="px-3 py-2 bg-gray-800 rounded-lg text-sm"
                    >
                      {permission}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile: React.FC = () => {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
};

export default Profile;