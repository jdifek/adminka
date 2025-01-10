"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from "jwt-decode";

interface AuthContextType {
  isLoggedIn: boolean;
  role: string | null;
  name: string | null;
  login: (token: string, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded: any = jwtDecode(token);
        setIsLoggedIn(true);
        setRole(decoded.role);
        setName(decoded.name);
      } catch (error) {
        console.error("Invalid token", error);
        setIsLoggedIn(false);
        setRole(null);
        setName(null);
      }
    }
  }, []);

  const login = (token: string, role: string) => {
    localStorage.setItem('token', token);
    setIsLoggedIn(true);
    setRole(role);
    const decoded: any = jwtDecode(token);
    setName(decoded.name);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    setRole(null);
    setName(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, name, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
