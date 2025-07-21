'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChartBarIcon,
  MapIcon,
  DocumentArrowDownIcon,
  UsersIcon,
  Cog6ToothIcon,
  UserIcon,
  ArrowRightOnRectangleIcon,
  Bars3Icon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@/hooks/useAuth';
import { Permission, UserRole } from '@/types';
import { getRoleDisplayName, getRoleColor } from '@/lib/auth';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  permission?: Permission;
  roles?: UserRole[];
}

const navigationItems: NavigationItem[] = [
  {
    name: '监测大屏',
    href: '/dashboard',
    icon: MapIcon,
    permission: Permission.VIEW_DASHBOARD,
  },
  {
    name: '数据分析',
    href: '/analytics',
    icon: ChartBarIcon,
    permission: Permission.VIEW_ANALYTICS,
  },
  {
    name: '数据导出',
    href: '/export',
    icon: DocumentArrowDownIcon,
    permission: Permission.EXPORT_DATA,
  },
  {
    name: '用户管理',
    href: '/users',
    icon: UsersIcon,
    permission: Permission.MANAGE_USERS,
  },
  {
    name: '系统设置',
    href: '/settings',
    icon: Cog6ToothIcon,
    permission: Permission.SYSTEM_CONFIG,
  },
];

const Navigation: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, logout, hasPermission } = useAuth();
  const pathname = usePathname();

  const handleLogout = () => {
    logout();
    setIsMobileMenuOpen(false);
  };

  const filteredNavItems = navigationItems.filter(item => {
    if (item.permission) {
      return hasPermission(item.permission);
    }
    return true;
  });

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-nav border-b border-medium-gray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                <span className="text-black libre-baskerville-bold text-lg">PM</span>
              </div>
              <span className="text-white noto-serif-sc-bold text-xl">污染监测系统</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {filteredNavItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'px-3 py-2 rounded-lg text-sm noto-serif-sc-medium transition-colors duration-200 flex items-center space-x-2',
                      isActive
                        ? 'bg-white/10 text-white'
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* User Menu */}
          <div className="hidden md:block">
            <div className="ml-4 flex items-center md:ml-6 space-x-4">
              {user && (
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="text-sm libre-baskerville-regular text-white">{user.username}</div>
                    <div className={cn('text-xs noto-serif-sc-light', getRoleColor(user.role))}>
                      {getRoleDisplayName(user.role)}
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-medium-gray rounded-full flex items-center justify-center">
                    <UserIcon className="w-5 h-5 text-white" />
                  </div>
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-white hover:text-gray-300"
              >
                <ArrowRightOnRectangleIcon className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="bg-medium-gray p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-black/95 backdrop-blur-md border-t border-medium-gray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-base noto-serif-sc-medium transition-colors',
                    isActive
                      ? 'bg-white/10 text-white'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  )}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
          
          {/* Mobile User Info */}
          <div className="pt-4 pb-3 border-t border-medium-gray">
            <div className="flex items-center px-5">
              <div className="w-10 h-10 bg-medium-gray rounded-full flex items-center justify-center">
                <UserIcon className="w-6 h-6 text-white" />
              </div>
              <div className="ml-3">
                <div className="text-base libre-baskerville-regular text-white">{user?.username}</div>
                <div className={cn('text-sm noto-serif-sc-light', getRoleColor(user?.role || UserRole.VISITOR))}>
                  {getRoleDisplayName(user?.role || UserRole.VISITOR)}
                </div>
              </div>
            </div>
            <div className="mt-3 px-2 space-y-1">
              <Link
                href="/profile"
                className="flex items-center px-3 py-2 rounded-md text-base noto-serif-sc-medium text-gray-300 hover:text-white hover:bg-white/10"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <UserIcon className="w-5 h-5 mr-3" />
                个人资料
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-3 py-2 rounded-md text-base noto-serif-sc-medium text-gray-300 hover:text-white hover:bg-white/10"
              >
                <ArrowRightOnRectangleIcon className="w-5 h-5 mr-3" />
                退出登录
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;