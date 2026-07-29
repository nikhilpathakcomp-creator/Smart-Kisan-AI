import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  switchRole: (role: UserRole) => void;
  updateUser: (updatedData: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>({
    id: 'usr_01',
    name: 'Ramesh Patil',
    phone: '9876543210',
    role: 'farmer',
    language: 'en',
    location: {
      district: 'Nashik',
      state: 'Maharashtra',
      pincode: '422001',
    },
    farmInfo: {
      landSizeAcres: 4.5,
      soilType: 'Black Cotton',
      irrigationSource: 'Drip / Well',
      primaryCrops: ['Onion', 'Tomato', 'Grapes'],
    },
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getMe()
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch((err) => console.error('Auth fetch error:', err));
  }, []);

  const switchRole = (newRole: UserRole) => {
    if (!user) return;
    const updated = { ...user, role: newRole };
    setUser(updated);
    api.login(user.phone, newRole).catch(() => {});
  };

  const updateUser = (updatedData: Partial<User>) => {
    if (!user) return;
    const nextUser = { ...user, ...updatedData };
    setUser(nextUser);
    api.updateProfile(updatedData).catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, loading, switchRole, updateUser }}>
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
