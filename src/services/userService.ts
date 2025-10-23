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

    // Convert date format from YYYY-MM-DD to MM/DD/YYYY
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
        // Handle different possible response structures
        if (
          response.data.data &&
          response.data.data.users &&
          response.data.data.users.length > 0
        ) {
          return response.data.data.users[0];
        } else if (response.data.data && response.data.data.user) {
          return response.data.data.user;
        } else if (response.data.user) {
          return response.data.user;
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

      const response = await axios.put<ApiResponse>(
        `${API_BASE_URL}/users/${id}`,
        formattedUserData
      );
      console.log("✅ [UPDATE USER] - User updated successfully!");
      return response.data.data.users[0];
    } catch (error) {
      console.error("❌ [UPDATE USER] - Error updating user:", error);
      throw error;
    }
  },

  // Delete user
  deleteUser: async (id: string): Promise<void> => {
    try {
      console.log("🗑️ [DELETE USER] - Deleting user:", id);
      await axios.delete(`${API_BASE_URL}/users/${id}`);
      console.log("✅ [DELETE USER] - User deleted successfully!");
    } catch (error) {
      console.error("❌ [DELETE USER] - Error deleting user:", error);
      throw error;
    }
  },
};

// Utility function to convert date format from YYYY-MM-DD to MM/DD/YYYY
function convertDateFormat(dateString: string): string {
  console.log("📅 [DATE CONVERSION] - Converting date format:", dateString);

  // If already in MM/DD/YYYY format, return as is
  if (dateString.includes("/")) {
    console.log("📅 [DATE CONVERSION] - Date already in correct format");
    return dateString;
  }

  // Convert from YYYY-MM-DD to MM/DD/YYYY
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    console.error("❌ [DATE CONVERSION] - Invalid date format:", dateString);
    throw new Error(`Invalid date format: ${dateString}`);
  }

  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const year = date.getFullYear();

  const convertedDate = `${month}/${day}/${year}`;
  console.log("📅 [DATE CONVERSION] - Converted date:", convertedDate);

  return convertedDate;
}

// Utility function to test the API connection and create a user
export const testCreateUser = async () => {
  const testUser: CreateUserRequest = {
    fullName: "Rashid Khan",
    mobileNumber: "9652632532",
    emailAddress: "rashidkhan@gmail.com",
    dateOfBirth: "1996-10-05", // This will be automatically converted to "10/05/1996"
    addressLine1: "Kabul",
    addressLine2: "Afganistan",
    city: "Kandhar",
    pinCode: "889966",
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

// Alternative: If you want to accept dates in multiple formats
export const formatDateForAPI = (dateString: string): string => {
  // Handle multiple date formats
  if (dateString.includes("/")) {
    return dateString; // Already in MM/DD/YYYY format
  } else if (dateString.includes("-")) {
    // Convert from YYYY-MM-DD to MM/DD/YYYY
    const [year, month, day] = dateString.split("-");
    return `${month}/${day}/${year}`;
  } else {
    throw new Error(`Unsupported date format: ${dateString}`);
  }
};
