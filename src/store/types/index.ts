export interface User {
  _id: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pinCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface FormData {
  _id?: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  pinCode: string;
}

export interface FormErrors {
  fullName?: string;
  mobileNumber?: string;
  emailAddress?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  city?: string;
  pinCode?: string;
}

export interface ToastState {
  message: string;
  type: 'success' | 'error' | 'info';
  visible: boolean;
}

export interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
  editingUser: FormData | null;
}

export interface RootState {
  users: UserState;
  toast: ToastState;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
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
