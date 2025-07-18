'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import Navigation from '@/components/layout/Navigation';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermission?: Permission;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  requiredPermission,
  requireAuth = true,
}) => {
  const { user, isLoading, hasPermission } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      if (requireAuth && !user) {
        router.push('/login');
        return;
      }

      if (requiredPermission && !hasPermission(requiredPermission)) {
        router.push('/unauthorized');
        return;
      }
    }
  }, [user, isLoading, hasPermission, requiredPermission, requireAuth, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (requireAuth && !user) {
    return null;
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    return null;
  }

  return (
    <>
      {user && <Navigation />}
      {children}
    </>
  );
};

export default ProtectedRoute;