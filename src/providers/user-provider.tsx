'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useGlobalUser } from '@/hooks/useGlobalUser';

interface UserContextType {
  userInfo: any;
  loading: boolean;
  error: string | null;
  fetchUserInfo: () => Promise<any>;
  refreshUserInfo: () => Promise<any>;
  clearUser: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const userHook = useGlobalUser();

  return (
    <UserContext.Provider value={userHook}>
      {children}
    </UserContext.Provider>
  );
}; 