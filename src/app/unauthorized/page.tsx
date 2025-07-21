'use client';

import React from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Typography } from '@/components/ui/Typography';
import { 
  ExclamationTriangleIcon,
  ArrowLeftIcon,
  HomeIcon,
} from '@heroicons/react/24/outline';

const UnauthorizedPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
              <ExclamationTriangleIcon className="w-8 h-8 text-red-400" />
            </div>
          </div>
          <CardTitle className="text-red-400">访问被拒绝</CardTitle>
        </CardHeader>
        <CardContent>
          <Typography variant="body-medium" className="mb-6">
            您没有权限访问此页面。如需访问，请联系系统管理员。
          </Typography>
          
          <div className="space-y-3">
            <Button
              onClick={() => window.history.back()}
              variant="secondary"
              className="w-full flex items-center justify-center space-x-2"
            >
              <ArrowLeftIcon className="w-4 h-4" />
              <span>返回上一页</span>
            </Button>
            
            <Link href="/dashboard">
              <Button className="w-full flex items-center justify-center space-x-2">
                <HomeIcon className="w-4 h-4" />
                <span>返回首页</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UnauthorizedPage;