// src/context/UserContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FormData } from '../tryes/FormTypes';

interface UserContextType {
  users: FormData[];
  addUser: (user: FormData) => void;
  updateUser: (id: string, user: FormData) => void;
  deleteUser: (id: string) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<FormData[]>([
    // Sample data
    {
      id: '1',
      name: 'John Doe',
      mobileNumber: '9876543210',
      email: 'john@example.com',
      dateOfBirth: '1990-01-15',
      addressLine1: '123 Main Street',
      addressLine2: 'Apt 4B',
      city: 'New York',
      pinCode: '10001'
    },
    {
      id: '2',
      name: 'Jane Smith',
      mobileNumber: '9876543211',
      email: 'jane@example.com',
      dateOfBirth: '1985-05-20',
      addressLine1: '456 Oak Avenue',
      addressLine2: 'Suite 200',
      city: 'Los Angeles',
      pinCode: '90001'
    }
  ]);

  const addUser = (user: FormData) => {
    const newUser = { ...user, id: Date.now().toString() };
    setUsers(prev => [...prev, newUser]);
  };

  const updateUser = (id: string, user: FormData) => {
    setUsers(prev => prev.map(u => u.id === id ? { ...user, id } : u));
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(u => u.id !== id));
  };

  return (
    <UserContext.Provider value={{ users, addUser, updateUser, deleteUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUsers = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUsers must be used within a UserProvider');
  }
  return context;
};