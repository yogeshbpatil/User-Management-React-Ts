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

export interface CreateUserRequest {
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pinCode: string;
}

export const userService = {
  // Get all users
  getUsers: async (): Promise<User[]> => {
    try {
      console.log("🔄 [GET USERS] - Fetching users...");
      const response = await axios.get<ApiResponse>(`${API_BASE_URL}/users`);
      console.log("✅ [GET USERS] - Users fetched successfully!");
      return response.data.data.users;
    } catch (error) {
      console.error("❌ [GET USERS] - Error fetching users:", error);
      throw error;
    }
  },

  // Create new user - WITH DATE FORMAT FIX
  createUser: async (userData: CreateUserRequest): Promise<User> => {
    console.log("🆕 [CREATE USER] - Starting user creation...");

    // Convert date format from DD/MM/YYYY to MM/DD/YYYY for API
    const formattedUserData = {
      ...userData,
      dateOfBirth: convertDateFormat(userData.dateOfBirth),
    };

    console.log("📤 [CREATE USER] - Original user data:", userData);
    console.log("📤 [CREATE USER] - Formatted user data:", formattedUserData);
    console.log(`📡 [CREATE USER] - POST URL: ${API_BASE_URL}/users/register`);

    // Validate required fields before sending
    const requiredFields = [
      "fullName",
      "mobileNumber",
      "emailAddress",
      "dateOfBirth",
      "addressLine1",
      "city",
      "pinCode",
    ];
    const missingFields = requiredFields.filter(
      (field) => !userData[field as keyof CreateUserRequest]
    );

    if (missingFields.length > 0) {
      console.error(
        "❌ [CREATE USER] - Missing required fields:",
        missingFields
      );
      throw new Error(`Missing required fields: ${missingFields.join(", ")}`);
    }

    try {
      const response = await axios.post(
        `${API_BASE_URL}/users/register`,
        formattedUserData, // Use the formatted data with correct date format
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          timeout: 10000,
        }
      );

      console.log("✅ [CREATE USER] - Request successful!");
      console.log("📋 [CREATE USER] - Response status:", response.status);
      console.log("📦 [CREATE USER] - Response data:", response.data);

      if (response.data.success) {
        // Handle the actual API response structure
        if (response.data.data) {
          // For POST /users/register - response.data.data contains the user directly
          return response.data.data;
        } else {
          console.warn(
            "⚠️ [CREATE USER] - Unexpected response structure:",
            response.data
          );
          throw new Error("Unexpected response structure from API");
        }
      } else {
        throw new Error(
          `API Error: ${response.data.message || "Unknown error"}`
        );
      }
    } catch (error: any) {
      console.error("❌ [CREATE USER] - Error creating user:");

      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        const responseData = error.response?.data;

        console.error("🔧 [CREATE USER] - Axios error details:");
        console.error("   Status:", status);
        console.error("   Status Text:", error.response?.statusText);
        console.error("   Response Data:", responseData);
        console.error("   Error Message:", error.message);

        // Provide more specific error messages based on status code
        if (status === 400) {
          const errorMessage =
            responseData?.message || "Bad Request - Check your input data";
          console.error(
            "   💡 Validation errors:",
            responseData?.errors || responseData
          );
          throw new Error(`Validation Error: ${errorMessage}`);
        } else if (status === 409) {
          throw new Error(
            "User already exists with this email or mobile number"
          );
        } else if (status === 422) {
          throw new Error("Data validation failed - Please check all fields");
        }
      }

      // Re-throw the original error if it's not an Axios error
      throw error;
    }
  },

  // Update user - WITH DATE FORMAT FIX
  updateUser: async (id: string, userData: Partial<User>): Promise<User> => {
    try {
      console.log("✏️ [UPDATE USER] - Updating user:", id);

      // Convert date format if dateOfBirth is being updated
      const formattedUserData = userData.dateOfBirth
        ? { ...userData, dateOfBirth: convertDateFormat(userData.dateOfBirth) }
        : userData;

      console.log(
        "📤 [UPDATE USER] - Formatted update data:",
        formattedUserData
      );

      const response = await axios.put(
        `${API_BASE_URL}/users/${id}`,
        formattedUserData
      );

      console.log("✅ [UPDATE USER] - User updated successfully!");
      console.log("📦 [UPDATE USER] - Response data:", response.data);

      if (response.data.success) {
        // Handle the actual API response structure for update
        if (response.data.data) {
          // For PUT /users/{id} - response.data.data contains the updated user directly
          return response.data.data;
        } else {
          console.warn(
            "⚠️ [UPDATE USER] - Unexpected response structure:",
            response.data
          );
          throw new Error("Unexpected response structure from API");
        }
      } else {
        throw new Error(
          `API Error: ${response.data.message || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("❌ [UPDATE USER] - Error updating user:", error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ [DELETE USER] - Deleting user:", id);
      const response = await axios.delete(`${API_BASE_URL}/users/${id}`);
      console.log("✅ [DELETE USER] - User deleted successfully!");

      if (!response.data.success) {
        throw new Error(response.data.message || "Failed to delete user");
      }
    } catch (error) {
      console.error("❌ [DELETE USER] - Error deleting user:", error);
      throw error;
    }
  },
};

// Utility function to convert date format from DD/MM/YYYY to MM/DD/YYYY for API
function convertDateFormat(dateString: string): string {
  console.log("📅 [DATE CONVERSION] - Converting date format:", dateString);

  // If already in MM/DD/YYYY format, return as is
  if (dateString.includes("/")) {
    const parts = dateString.split("/");
    if (
      parts.length === 3 &&
      parts[0].length === 2 &&
      parts[1].length === 2 &&
      parseInt(parts[0]) <= 12 && // First part is month
      parseInt(parts[1]) <= 31 // Second part is day
    ) {
      console.log("📅 [DATE CONVERSION] - Date already in correct format");
      return dateString;
    }
  }

  // Convert from DD/MM/YYYY to MM/DD/YYYY
  try {
    const [day, month, year] = dateString
      .split("/")
      .map((part) => parseInt(part, 10));

    // Validate date components
    if (isNaN(day) || isNaN(month) || isNaN(year)) {
      throw new Error("Invalid date components");
    }

    // Validate date ranges
    if (month < 1 || month > 12) {
      throw new Error("Invalid month");
    }
    if (day < 1 || day > 31) {
      throw new Error("Invalid day");
    }
    if (year < 1900 || year > 2100) {
      throw new Error("Invalid year");
    }

    // Validate actual date
    const date = new Date(year, month - 1, day);
    if (
      isNaN(date.getTime()) ||
      date.getDate() !== day ||
      date.getMonth() !== month - 1
    ) {
      throw new Error("Invalid date");
    }

    const convertedDate = `${month.toString().padStart(2, "0")}/${day
      .toString()
      .padStart(2, "0")}/${year}`;
    console.log("📅 [DATE CONVERSION] - Converted date:", convertedDate);

    return convertedDate;
  } catch (error) {
    console.error("❌ [DATE CONVERSION] - Error converting date:", error);
    throw new Error(
      `Invalid date format: ${dateString}. Please use DD/MM/YYYY format.`
    );
  }
}

// Utility function to convert from API format (MM/DD/YYYY) to display format (DD/MM/YYYY)
export const convertToDisplayFormat = (dateString: string): string => {
  if (!dateString) return "";

  try {
    // If already in DD/MM/YYYY format, return as is
    if (dateString.includes("/")) {
      const parts = dateString.split("/");
      if (
        parts.length === 3 &&
        parts[0].length === 2 &&
        parts[1].length === 2
      ) {
        const [first, second] = parts.map((p) => parseInt(p));
        // Check if it's already in DD/MM/YYYY (if first part > 12, it's likely day)
        if (first > 12 && second <= 12) {
          return dateString;
        }
      }
    }

    // Convert from MM/DD/YYYY to DD/MM/YYYY
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return dateString;
    }

    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error converting to display format:", error);
    return dateString;
  }
};

// Utility function to test the API connection and create a user
export const testCreateUser = async () => {
  const testUser: CreateUserRequest = {
    fullName: "Test User",
    mobileNumber: "1234567890",
    emailAddress: "test@example.com",
    dateOfBirth: "15/10/1990", // This will be automatically converted to "10/15/1990"
    addressLine1: "Test Address",
    addressLine2: "Test Line 2",
    city: "Test City",
    pinCode: "123456",
  };

  try {
    console.log("🧪 [TEST] - Testing user creation...");
    const result = await userService.createUser(testUser);
    console.log("🎉 [TEST] - Test user created successfully:", result);
    return result;
  } catch (error) {
    console.error("💥 [TEST] - Test failed:", error);
    throw error;
  }
};
