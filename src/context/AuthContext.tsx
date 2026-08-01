import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  role: UserRole;
  switchRole: (role: UserRole) => void;
  login: (email: string) => Promise<void>;
  logout: () => void;
}

const defaultUsers: Record<UserRole, User> = {
  ROLE_CUSTOMER: {
    id: 1,
    email: 'customer@loanflow.com',
    name: 'Alex Morgan',
    role: 'ROLE_CUSTOMER',
    phone: '+18005550103',
    active: true,
  },
  ROLE_LOAN_OFFICER: {
    id: 2,
    email: 'officer@loanflow.com',
    name: 'Sarah Jenkins',
    role: 'ROLE_LOAN_OFFICER',
    phone: '+18005550101',
    active: true,
  },
  ROLE_MANAGER: {
    id: 3,
    email: 'manager@loanflow.com',
    name: 'David Miller',
    role: 'ROLE_MANAGER',
    phone: '+18005550102',
    active: true,
  },
  ROLE_ADMIN: {
    id: 4,
    email: 'admin@loanflow.com',
    name: 'System Admin',
    role: 'ROLE_ADMIN',
    phone: '+18005550100',
    active: true,
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('ROLE_CUSTOMER');
  const [user, setUser] = useState<User | null>(defaultUsers['ROLE_CUSTOMER']);

  const switchRole = (newRole: UserRole) => {
    setRole(newRole);
    setUser(defaultUsers[newRole]);
  };

  const login = async (email: string) => {
    const matched = Object.values(defaultUsers).find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (matched) {
      setRole(matched.role);
      setUser(matched);
    } else {
      setUser({
        id: Date.now(),
        email,
        name: email.split('@')[0],
        role: 'ROLE_CUSTOMER',
        phone: '+18005550000',
        active: true,
      });
      setRole('ROLE_CUSTOMER');
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, role, switchRole, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
