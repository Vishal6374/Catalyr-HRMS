import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

export type UserRole = 'hr' | 'employee';

export interface User {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  departmentId: string;
  designationId: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isHR: boolean;
  isEmployee: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: Record<string, { password: string; user: User }> = {
  'hr@company.com': {
    password: 'hr123',
    user: {
      id: '1',
      employeeId: 'EMP2026-0001',
      name: 'Sarah Johnson',
      email: 'hr@company.com',
      role: 'hr',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
      departmentId: 'dept-1',
      designationId: 'des-1',
    },
  },
  'employee@company.com': {
    password: 'emp123',
    user: {
      id: '2',
      employeeId: 'EMP2026-0015',
      name: 'John Smith',
      email: 'employee@company.com',
      role: 'employee',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      departmentId: 'dept-2',
      designationId: 'des-3',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('hrms_user');
    return stored ? JSON.parse(stored) : null;
  });

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500));
    const mockUser = mockUsers[email.toLowerCase()];
    if (mockUser && mockUser.password === password) {
      setUser(mockUser.user);
      localStorage.setItem('hrms_user', JSON.stringify(mockUser.user));
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('hrms_user');
  }, []);

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isHR: user?.role === 'hr',
    isEmployee: user?.role === 'employee',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
