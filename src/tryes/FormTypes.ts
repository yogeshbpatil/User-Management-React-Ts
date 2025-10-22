export interface FormData {
  id?: string; // Add this line
  name: string;
  mobileNumber: string;
  email: string;
  dateOfBirth: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  pinCode: string;
}

export interface FormErrors {
  name?: string;
  mobileNumber?: string;
  email?: string;
  dateOfBirth?: string;
  addressLine1?: string;
  city?: string;
  pinCode?: string;
}