import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FormData } from '../tryes/FormTypes';
// import { FormData } from '../types/FormTypes';
import { userService } from '../services/userService';

interface UserContextType {
  users: FormData[];
  loading: boolean;
  error: string | null;
  addUser: (user: FormData) => Promise<void>;
  updateUser: (id: string, user: FormData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<FormData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUsers = await userService.getUsers();
      // Convert API user format to FormData format
      const formattedUsers: FormData[] = apiUsers.map(user => ({
        _id: user._id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        emailAddress: user.emailAddress,
        dateOfBirth: user.dateOfBirth,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        pinCode: user.pinCode
      }));
      setUsers(formattedUsers);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  const addUser = async (user: FormData) => {
    setLoading(true);
    setError(null);
    try {
      // Convert FormData to API format
      const userData = {
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        emailAddress: user.emailAddress,
        dateOfBirth: user.dateOfBirth,
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        pinCode: user.pinCode
      };

      const newUser = await userService.createUser(userData);
      
      // Add the new user to local state
      const formattedUser: FormData = {
        _id: newUser._id,
        fullName: newUser.fullName,
        mobileNumber: newUser.mobileNumber,
        emailAddress: newUser.emailAddress,
        dateOfBirth: newUser.dateOfBirth,
        addressLine1: newUser.addressLine1,
        addressLine2: newUser.addressLine2,
        city: newUser.city,
        pinCode: newUser.pinCode
      };

      setUsers(prev => [...prev, formattedUser]);
    } catch (err) {
      setError('Failed to add user');
      console.error('Error adding user:', err);
      throw err; // Re-throw to handle in component
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, user: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(id, user);
      setUsers(prev => prev.map(u => u._id === id ? { ...user, _id: id } : u));
    } catch (err) {
      setError('Failed to update user');
      console.error('Error updating user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id: string) => {
    setLoading(true);
    setError(null);
    try {
      await userService.deleteUser(id);
      setUsers(prev => prev.filter(u => u._id !== id));
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <UserContext.Provider value={{ 
      users, 
      loading, 
      error, 
      addUser, 
      updateUser, 
      deleteUser, 
      fetchUsers 
    }}>
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