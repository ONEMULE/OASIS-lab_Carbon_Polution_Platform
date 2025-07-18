'use client';

import React, { useState } from 'react';
import { User, UserRole, Permission } from '@/types';
import { mockUsers, getRoleDisplayName, getRoleColor } from '@/lib/auth';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { Modal } from '@/components/ui/Modal';
import { 
  UserIcon, 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  EyeIcon,
  UserGroupIcon,
} from '@heroicons/react/24/outline';

const UserManagementContent: React.FC = () => {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);

  const handleUserAction = (action: string, user: User) => {
    switch (action) {
      case 'view':
        setSelectedUser(user);
        setIsViewModalOpen(true);
        break;
      case 'edit':
        setSelectedUser(user);
        setIsCreateModalOpen(true);
        break;
      case 'delete':
        setUsers(users.filter(u => u.id !== user.id));
        break;
    }
  };

  const getUserStats = () => {
    const total = users.length;
    const admins = users.filter(u => u.role === UserRole.ADMIN).length;
    const analysts = users.filter(u => u.role === UserRole.ANALYST).length;
    const visitors = users.filter(u => u.role === UserRole.VISITOR).length;
    
    return { total, admins, analysts, visitors };
  };

  const stats = getUserStats();

  return (
    <div className="min-h-screen bg-black pt-16">
      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Typography variant="h2" className="mb-2 noto-serif-sc-bold">
              用户管理
            </Typography>
            <Typography variant="body-large" className="text-gray-400 libre-baskerville-regular">
              管理系统用户权限和角色
            </Typography>
          </div>
          <Button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center space-x-2"
          >
            <PlusIcon className="w-4 h-4" />
            <span className="noto-serif-sc-medium">添加用户</span>
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    总用户数
                  </Typography>
                  <Typography variant="h3" className="mt-1">
                    {stats.total}
                  </Typography>
                </div>
                <UserGroupIcon className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    管理员
                  </Typography>
                  <Typography variant="h3" className="mt-1 text-red-400">
                    {stats.admins}
                  </Typography>
                </div>
                <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-red-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    分析人员
                  </Typography>
                  <Typography variant="h3" className="mt-1 text-blue-400">
                    {stats.analysts}
                  </Typography>
                </div>
                <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-blue-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    访客
                  </Typography>
                  <Typography variant="h3" className="mt-1 text-green-400">
                    {stats.visitors}
                  </Typography>
                </div>
                <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Users Table */}
        <Card>
          <CardHeader>
            <CardTitle>用户列表</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-600">
                    <th className="text-left py-3 px-4 text-gray-400 noto-serif-sc-medium">用户</th>
                    <th className="text-left py-3 px-4 text-gray-400 noto-serif-sc-medium">邮箱</th>
                    <th className="text-left py-3 px-4 text-gray-400 noto-serif-sc-medium">角色</th>
                    <th className="text-left py-3 px-4 text-gray-400 noto-serif-sc-medium">最后登录</th>
                    <th className="text-left py-3 px-4 text-gray-400 noto-serif-sc-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-medium-gray rounded-full flex items-center justify-center">
                            <UserIcon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <Typography variant="body-medium" className="font-medium libre-baskerville-bold">
                              {user.username}
                            </Typography>
                            <Typography variant="body-small" className="text-gray-400">
                              ID: {user.id}
                            </Typography>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Typography variant="body-medium">
                          {user.email}
                        </Typography>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs noto-serif-sc-medium ${getRoleColor(user.role)}`}>
                          {getRoleDisplayName(user.role)}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <Typography variant="body-medium" className="text-gray-400">
                          {user.lastLogin ? user.lastLogin.toLocaleDateString() : '从未登录'}
                        </Typography>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction('view', user)}
                          >
                            <EyeIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction('edit', user)}
                          >
                            <PencilIcon className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleUserAction('delete', user)}
                            className="text-red-400 hover:text-red-300"
                          >
                            <TrashIcon className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Create/Edit User Modal */}
        <Modal
          isOpen={isCreateModalOpen}
          onClose={() => {
            setIsCreateModalOpen(false);
            setSelectedUser(null);
          }}
          title={selectedUser ? '编辑用户' : '添加新用户'}
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm noto-serif-sc-medium text-gray-300 mb-2">
                用户名
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white"
                defaultValue={selectedUser?.username}
              />
            </div>
            <div>
              <label className="block text-sm noto-serif-sc-medium text-gray-300 mb-2">
                邮箱
              </label>
              <input
                type="email"
                className="w-full px-3 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white"
                defaultValue={selectedUser?.email}
              />
            </div>
            <div>
              <label className="block text-sm noto-serif-sc-medium text-gray-300 mb-2">
                角色
              </label>
              <select
                className="w-full px-3 py-2 bg-medium-gray border border-gray-600 rounded-lg text-white"
                defaultValue={selectedUser?.role}
              >
                <option value={UserRole.ADMIN} className="noto-serif-sc-regular">管理员</option>
                <option value={UserRole.ANALYST} className="noto-serif-sc-regular">分析人员</option>
                <option value={UserRole.VISITOR} className="noto-serif-sc-regular">访客</option>
              </select>
            </div>
            <div className="flex justify-end space-x-2 pt-4">
              <Button
                variant="ghost"
                onClick={() => {
                  setIsCreateModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                <span className="noto-serif-sc-regular">取消</span>
              </Button>
              <Button>
                <span className="noto-serif-sc-regular">{selectedUser ? '更新' : '创建'}</span>
              </Button>
            </div>
          </div>
        </Modal>

        {/* View User Modal */}
        {selectedUser && (
          <Modal
            isOpen={isViewModalOpen}
            onClose={() => {
              setIsViewModalOpen(false);
              setSelectedUser(null);
            }}
            title="用户详情"
          >
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-medium-gray rounded-full flex items-center justify-center">
                  <UserIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                  <Typography variant="h4">{selectedUser.username}</Typography>
                  <Typography variant="body-medium" className="text-gray-400">
                    {selectedUser.email}
                  </Typography>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    角色
                  </Typography>
                  <Typography variant="body-medium" className={getRoleColor(selectedUser.role)}>
                    {getRoleDisplayName(selectedUser.role)}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    创建时间
                  </Typography>
                  <Typography variant="body-medium">
                    {selectedUser.createdAt.toLocaleDateString()}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    最后登录
                  </Typography>
                  <Typography variant="body-medium">
                    {selectedUser.lastLogin ? selectedUser.lastLogin.toLocaleString() : '从未登录'}
                  </Typography>
                </div>
                <div>
                  <Typography variant="body-small" className="text-gray-400">
                    权限数量
                  </Typography>
                  <Typography variant="body-medium">
                    {selectedUser.permissions.length}
                  </Typography>
                </div>
              </div>

              <div>
                <Typography variant="body-small" className="text-gray-400 mb-2">
                  用户权限
                </Typography>
                <div className="space-y-1">
                  {selectedUser.permissions.map((permission) => (
                    <div key={permission} className="px-2 py-1 bg-gray-800 rounded text-sm">
                      {permission}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Modal>
        )}
      </div>
    </div>
  );
};

const UserManagement: React.FC = () => {
  return (
    <ProtectedRoute requiredPermission={Permission.MANAGE_USERS}>
      <UserManagementContent />
    </ProtectedRoute>
  );
};

export default UserManagement;