import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { FormData } from '../tryes/FormTypes';
import { userService } from '../services/userService';

interface UserContextType {
  users: FormData[];
  loading: boolean;
  error: string | null;
  addUser: (user: FormData) => Promise<void>;
  updateUser: (id: string, user: FormData) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  fetchUsers: () => Promise<void>;
  editingUser: FormData | null;
  setEditingUser: (user: FormData | null) => void;
  clearError: () => void; // Add this function
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<FormData[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [editingUser, setEditingUser] = useState<FormData | null>(null);

  // Clear error function
  const clearError = () => setError(null);

  // Fetch users from API
  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiUsers = await userService.getUsers();
      // Convert API user format to FormData format with proper date conversion
      const formattedUsers: FormData[] = apiUsers.map(user => ({
        _id: user._id,
        fullName: user.fullName,
        mobileNumber: user.mobileNumber,
        emailAddress: user.emailAddress,
        dateOfBirth: convertToDisplayFormat(user.dateOfBirth), // Convert to DD/MM/YYYY for display
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
        dateOfBirth: user.dateOfBirth, // Already in correct format from form
        addressLine1: user.addressLine1,
        addressLine2: user.addressLine2,
        city: user.city,
        pinCode: user.pinCode
      };

      const newUser = await userService.createUser(userData);
      
      // Add the new user to local state with proper date format
      const formattedUser: FormData = {
        _id: newUser._id,
        fullName: newUser.fullName,
        mobileNumber: newUser.mobileNumber,
        emailAddress: newUser.emailAddress,
        dateOfBirth: convertToDisplayFormat(newUser.dateOfBirth), // Convert to DD/MM/YYYY
        addressLine1: newUser.addressLine1,
        addressLine2: newUser.addressLine2,
        city: newUser.city,
        pinCode: newUser.pinCode
      };

      setUsers(prev => [...prev, formattedUser]);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to add user';
      setError(errorMessage);
      console.error('Error adding user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (id: string, user: FormData) => {
    setLoading(true);
    setError(null);
    try {
      const updatedUser = await userService.updateUser(id, user);
      
      // Update the user in local state with proper date format
      setUsers(prev => prev.map(u => 
        u._id === id ? { 
          ...user, 
          _id: id,
          dateOfBirth: convertToDisplayFormat(updatedUser.dateOfBirth) // Convert to DD/MM/YYYY
        } : u
      ));
      
      // Clear editing user after successful update
      setEditingUser(null);
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to update user';
      setError(errorMessage);
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
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to delete user';
      setError(errorMessage);
      console.error('Error deleting user:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert date to DD/MM/YYYY format for display
  const convertToDisplayFormat = (dateString: string): string => {
    if (!dateString) return '';
    
    // If already in DD/MM/YYYY format, return as is
    if (dateString.includes('/')) {
      const parts = dateString.split('/');
      if (parts.length === 3 && parts[0].length === 2 && parts[1].length === 2) {
        return dateString;
      }
    }
    
    // Convert from MM/DD/YYYY or other formats to DD/MM/YYYY
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return dateString; // Return original if invalid
      }
      
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      
      return `${day}/${month}/${year}`;
    } catch (error) {
      console.error('Error converting date format:', error);
      return dateString;
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
      fetchUsers,
      editingUser,
      setEditingUser,
      clearError // Add this to the context value
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