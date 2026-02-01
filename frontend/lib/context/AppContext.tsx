'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api';
import { User, Claim } from '../types';

interface AppContextType {
  user: User | null;
  claims: Claim[];
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  claimDeal: (dealId: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [claims, setClaims] = useState<Claim[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /* -----------------------------
     Restore session on refresh
  ------------------------------ */
  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      setIsLoading(false);
      return;
    }

    const bootstrap = async () => {
      try {
        const profileRes = await apiFetch('/auth/profile');
        setUser(profileRes.data.user);

        const claimsRes = await apiFetch('/claims/my');
        setClaims(claimsRes.data);
      } catch {
        localStorage.removeItem('token');
        setUser(null);
        setClaims([]);
      } finally {
        setIsLoading(false);
      }
    };

    bootstrap();
  }, []);

  /* -------- Login -------- */
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);

      const claimsRes = await apiFetch('/claims/my');
      setClaims(claimsRes.data);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------- Register -------- */
  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      const res = await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      localStorage.setItem('token', res.data.token);
      setUser(res.data.user);
      setClaims([]);
    } finally {
      setIsLoading(false);
    }
  };

  /* -------- Logout -------- */
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setClaims([]);
  };

  /* -------- Claim Deal -------- */
  const claimDeal = async (dealId: string) => {
    if (!user) throw new Error('Not authenticated');

    setIsLoading(true);
    try {
      await apiFetch(`/claims/${dealId}`, {
        method: 'POST',
      });

      const claimsRes = await apiFetch('/claims/my');
      setClaims(claimsRes.data);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        user,
        claims,
        isLoading,
        login,
        register,
        logout,
        claimDeal,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

/* -------- Hook -------- */
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
