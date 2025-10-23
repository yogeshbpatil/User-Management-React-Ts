import axios from "axios";

const API_BASE_URL = "https://user-management-app-6csh.onrender.com/api/v1";

export interface User {
  _id: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pinCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse {
  success: boolean;
  message: string;
  data: {
    users: User[];
    total: number;
    showing: number;
  };
}

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    const response = await axios.get<ApiResponse>(`${API_BASE_URL}/users`);
    return response.data.data.users;
  },

  // Create new user
  createUser: async (
    userData: Omit<User, "_id" | "createdAt" | "updatedAt">
  ): Promise<User> => {
    const response = await axios.post<ApiResponse>(
      `${API_BASE_URL}/users`,
      userData
    );
    return response.data.data.users[0]; // Assuming the API returns the created user
  },

  // Update user
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    const response = await axios.put<ApiResponse>(
      `${API_BASE_URL}/users/${id}`,
      userData
    );
    return response.data.data.users[0];
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    await axios.delete(`${API_BASE_URL}/users/${id}`);
  },
};
