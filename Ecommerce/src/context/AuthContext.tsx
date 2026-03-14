import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';

type User = {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
};

type AuthContextType = {
  userToken: string | null;
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  login: (token: string) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  // NEVER conditionally call hooks
  useEffect(() => {
    const loadToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');

        if (!token) {
          setUserToken(null);
          setUser(null);
          return;
        }

        const decoded: any = jwtDecode(token);
        const currentTime = Date.now() / 1000;

        if (decoded.exp && decoded.exp < currentTime) {
          await AsyncStorage.removeItem('token');
          setUserToken(null);
          setUser(null);
        } else {
          setUserToken(token);

          setUser({
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
            phone: decoded.phone,
            address: decoded.address,
          });
        }
      } catch (error) {
        setUserToken(null);
        setUser(null);
      }
    };

    loadToken();
  }, []);

  const login = async (token: string) => {
    try {
      await AsyncStorage.setItem('token', token);
      setUserToken(token);

      const decoded: any = jwtDecode(token);

      setUser({
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
        phone: decoded.phone,
        address: decoded.address,
      });
    } catch {
      setUser(null);
      setUserToken(null);
    }
  };

  const logout = async () => {
    await AsyncStorage.removeItem('token');
    setUserToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ userToken, user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }
  return context;
};