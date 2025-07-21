'use client';

import React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Permission } from '@/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Typography } from '@/components/ui/Typography';
import { Button } from '@/components/ui/Button';

const DebugPage: React.FC = () => {
  const { user, isLoading, hasPermission } = useAuth();

  if (isLoading) {
    return <div className="min-h-screen bg-black flex items-center justify-center text-white">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card>
          <CardContent className="p-6">
            <Typography variant="h3" className="text-center text-white mb-4">
              Not Authenticated
            </Typography>
            <Typography variant="body-medium" className="text-center text-gray-400">
              Please login to access this page.
            </Typography>
          </CardContent>
        </Card>
      </div>
    );
  }

  const permissions = Object.values(Permission);

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-white">Debug Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Typography variant="h4" className="text-white mb-2">User Info</Typography>
              <div className="space-y-2 text-sm">
                <div className="text-gray-300">Username: {user.username}</div>
                <div className="text-gray-300">Email: {user.email}</div>
                <div className="text-gray-300">Role: {user.role}</div>
                <div className="text-gray-300">ID: {user.id}</div>
              </div>
            </div>

            <div>
              <Typography variant="h4" className="text-white mb-2">User Permissions</Typography>
              <div className="space-y-1">
                {user.permissions.map((permission) => (
                  <div key={permission} className="text-sm text-green-400">
                    ✓ {permission}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Typography variant="h4" className="text-white mb-2">Permission Check Results</Typography>
              <div className="space-y-1">
                {permissions.map((permission) => (
                  <div key={permission} className="text-sm flex items-center space-x-2">
                    <span className={hasPermission(permission) ? 'text-green-400' : 'text-red-400'}>
                      {hasPermission(permission) ? '✓' : '✗'}
                    </span>
                    <span className="text-gray-300">{permission}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Typography variant="h4" className="text-white mb-2">Actions</Typography>
              <div className="space-y-2">
                <Button
                  onClick={() => window.location.href = '/dashboard'}
                  className="mr-2"
                >
                  Go to Dashboard
                </Button>
                <Button
                  onClick={() => window.location.href = '/login'}
                  variant="secondary"
                >
                  Go to Login
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DebugPage;