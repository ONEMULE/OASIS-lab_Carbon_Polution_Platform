'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, AuthContextType, LoginCredentials, Permission, UserRole } from '@/types';
import { authenticateUser, hasPermission, hasRole, getUserPermissions } from '@/lib/auth';

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        // Ensure the user has the correct permission structure
        if (parsedUser && parsedUser.role) {
          const userWithPermissions = {
            ...parsedUser,
            permissions: getUserPermissions(parsedUser.role),
            createdAt: new Date(parsedUser.createdAt),
            lastLogin: parsedUser.lastLogin ? new Date(parsedUser.lastLogin) : null,
          };
          setUser(userWithPermissions);
        }
      } catch (error) {
        console.error('Failed to parse saved user:', error);
        localStorage.removeItem('user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const authenticatedUser = await authenticateUser(credentials.username, credentials.password);
      if (authenticatedUser) {
        setUser(authenticatedUser);
        if (credentials.remember) {
          localStorage.setItem('user', JSON.stringify(authenticatedUser));
        }
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const checkPermission = (permission: Permission): boolean => {
    return hasPermission(user, permission);
  };

  const checkRole = (role: UserRole): boolean => {
    return hasRole(user, role);
  };

  const value: AuthContextType = {
    user,
    login,
    logout,
    isLoading,
    hasPermission: checkPermission,
    hasRole: checkRole,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};