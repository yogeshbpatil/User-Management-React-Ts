export interface FormData {
  _id?: string;
  fullName: string;
  mobileNumber: string;
  emailAddress: string;
  dateOfBirth: string; // This will be in DD/MM/YYYY format
  addressLine1: string;
  addressLine2: string;
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
