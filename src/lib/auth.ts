import { User, UserRole, Permission } from '@/types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.ADMIN]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.MANAGE_USERS,
    Permission.SYSTEM_CONFIG,
    Permission.ADVANCED_FILTERS,
  ],
  [UserRole.ANALYST]: [
    Permission.VIEW_DASHBOARD,
    Permission.VIEW_ANALYTICS,
    Permission.EXPORT_DATA,
    Permission.ADVANCED_FILTERS,
  ],
  [UserRole.VISITOR]: [
    Permission.VIEW_DASHBOARD,
  ],
};

export const hasPermission = (user: User | null, permission: Permission): boolean => {
  if (!user) return false;
  return user.permissions.includes(permission);
};

export const hasRole = (user: User | null, role: UserRole): boolean => {
  if (!user) return false;
  return user.role === role;
};

export const canAccessRoute = (user: User | null, route: string): boolean => {
  if (!user) return false;

  const protectedRoutes: Record<string, Permission> = {
    '/dashboard': Permission.VIEW_DASHBOARD,
    '/analytics': Permission.VIEW_ANALYTICS,
    '/export': Permission.EXPORT_DATA,
    '/users': Permission.MANAGE_USERS,
    '/settings': Permission.SYSTEM_CONFIG,
  };

  const requiredPermission = protectedRoutes[route];
  if (!requiredPermission) return true;

  return hasPermission(user, requiredPermission);
};

export const getUserPermissions = (role: UserRole): Permission[] => {
  return ROLE_PERMISSIONS[role] || [];
};

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'admin',
    email: 'admin@pollution-monitor.com',
    role: UserRole.ADMIN,
    avatar: '/avatars/admin.png',
    createdAt: new Date('2023-01-01'),
    lastLogin: new Date('2024-01-01T10:00:00Z'),
    permissions: getUserPermissions(UserRole.ADMIN),
  },
  {
    id: '2',
    username: 'analyst',
    email: 'analyst@pollution-monitor.com',
    role: UserRole.ANALYST,
    avatar: '/avatars/analyst.png',
    createdAt: new Date('2023-02-01'),
    lastLogin: new Date('2024-01-01T10:00:00Z'),
    permissions: getUserPermissions(UserRole.ANALYST),
  },
  {
    id: '3',
    username: 'visitor',
    email: 'visitor@pollution-monitor.com',
    role: UserRole.VISITOR,
    avatar: '/avatars/visitor.png',
    createdAt: new Date('2023-03-01'),
    lastLogin: new Date('2024-01-01T10:00:00Z'),
    permissions: getUserPermissions(UserRole.VISITOR),
  },
];

export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Simple mock authentication
  const user = mockUsers.find(u => u.username === username);
  if (user && password === 'password123') {
    return user;
  }
  
  return null;
};

export const getRoleDisplayName = (role: UserRole): string => {
  const roleNames = {
    [UserRole.ADMIN]: '管理员',
    [UserRole.ANALYST]: '分析人员',
    [UserRole.VISITOR]: '访客',
  };
  return roleNames[role] || role;
};

export const getRoleColor = (role: UserRole): string => {
  const roleColors = {
    [UserRole.ADMIN]: 'text-red-400',
    [UserRole.ANALYST]: 'text-blue-400',
    [UserRole.VISITOR]: 'text-green-400',
  };
  return roleColors[role] || 'text-gray-400';
};