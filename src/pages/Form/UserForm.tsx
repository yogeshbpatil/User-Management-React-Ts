import React, { useState } from 'react';
// import { FormErrors, FormData } from '../';
// import { FormData } from '../tryes/FormTypes';

import { useUsers } from '../../context/UserContext';
import { FormErrors, FormData } from '../../tryes/FormTypes';

const UserForm: React.FC = () => {
  const { addUser, loading, error } = useUsers();
  
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    mobileNumber: '',
    emailAddress: '',
    dateOfBirth: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    pinCode: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Validation rules (updated field names)
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // Name validation
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full Name is required';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'Full Name must be at least 2 characters long';
    }

    // Mobile number validation
    const mobileRegex = /^[0-9]{10}$/;
    if (!formData.mobileNumber) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!mobileRegex.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Mobile number must be 10 digits';
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.emailAddress) {
      newErrors.emailAddress = 'Email is required';
    } else if (!emailRegex.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Please enter a valid email address';
    }

    // Date of birth validation
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    }

    // Address validation
    if (!formData.addressLine1.trim()) {
      newErrors.addressLine1 = 'Address Line 1 is required';
    }

    // City validation
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    // Pin code validation
    const pinCodeRegex = /^[0-9]{6}$/;
    if (!formData.pinCode) {
      newErrors.pinCode = 'Pin code is required';
    } else if (!pinCodeRegex.test(formData.pinCode)) {
      newErrors.pinCode = 'Pin code must be 6 digits';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);

    if (validateForm()) {
      try {
        await addUser(formData);
        alert('User added successfully!');
        handleReset();
      } catch (err) {
        alert('Failed to add user. Please try again.');
      }
    }
  };

  const handleReset = () => {
    setFormData({
      fullName: '',
      mobileNumber: '',
      emailAddress: '',
      dateOfBirth: '',
      addressLine1: '',
      addressLine2: '',
      city: '',
      pinCode: ''
    });
    setErrors({});
    setIsSubmitted(false);
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">User Registration Form</h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              
              <form onSubmit={handleSubmit} noValidate>
                {/* Name and Mobile Number */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="fullName" className="form-label text-start w-100">
                      Full Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.fullName ? 'is-invalid' : ''}`}
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                    />
                    {errors.fullName && (
                      <div className="invalid-feedback text-start">{errors.fullName}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="mobileNumber" className="form-label text-start w-100">
                      Mobile Number <span className="text-danger">*</span>
                    </label>
                    <input
                      type="tel"
                      className={`form-control ${errors.mobileNumber ? 'is-invalid' : ''}`}
                      id="mobileNumber"
                      name="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={handleChange}
                      placeholder="Enter 10-digit mobile number"
                      maxLength={10}
                    />
                    {errors.mobileNumber && (
                      <div className="invalid-feedback text-start">{errors.mobileNumber}</div>
                    )}
                  </div>
                </div>

                {/* Email and Date of Birth */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="emailAddress" className="form-label text-start w-100">
                      Email Address <span className="text-danger">*</span>
                    </label>
                    <input
                      type="email"
                      className={`form-control ${errors.emailAddress ? 'is-invalid' : ''}`}
                      id="emailAddress"
                      name="emailAddress"
                      value={formData.emailAddress}
                      onChange={handleChange}
                      placeholder="Enter your email address"
                    />
                    {errors.emailAddress && (
                      <div className="invalid-feedback text-start">{errors.emailAddress}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="dateOfBirth" className="form-label text-start w-100">
                      Date of Birth <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                    />
                    {errors.dateOfBirth && (
                      <div className="invalid-feedback text-start">{errors.dateOfBirth}</div>
                    )}
                  </div>
                </div>

                {/* Address Fields */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="addressLine1" className="form-label text-start w-100">
                      Address Line 1 <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.addressLine1 ? 'is-invalid' : ''}`}
                      id="addressLine1"
                      name="addressLine1"
                      value={formData.addressLine1}
                      onChange={handleChange}
                      placeholder="Street address, P.O. box, company name"
                    />
                    {errors.addressLine1 && (
                      <div className="invalid-feedback text-start">{errors.addressLine1}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="addressLine2" className="form-label text-start w-100">
                      Address Line 2
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="addressLine2"
                      name="addressLine2"
                      value={formData.addressLine2}
                      onChange={handleChange}
                      placeholder="Apartment, suite, unit, building, floor, etc."
                    />
                  </div>
                </div>

                {/* City and Pin Code */}
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="city" className="form-label text-start w-100">
                      City <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.city ? 'is-invalid' : ''}`}
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder="Enter your city"
                    />
                    {errors.city && (
                      <div className="invalid-feedback text-start">{errors.city}</div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="pinCode" className="form-label text-start w-100">
                      Pin Code <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.pinCode ? 'is-invalid' : ''}`}
                      id="pinCode"
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder="Enter 6-digit pin code"
                      maxLength={6}
                    />
                    {errors.pinCode && (
                      <div className="invalid-feedback text-start">{errors.pinCode}</div>
                    )}
                  </div>
                </div>

                {/* Buttons */}
                <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
                  <button
                    type="button"
                    className="btn btn-outline-secondary me-md-2"
                    onClick={handleReset}
                    disabled={loading}
                  >
                    Reset
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={loading}
                  >
                    {loading ? 'Adding...' : 'Submit'}
                  </button>
                </div>

                {isSubmitted && Object.keys(errors).length > 0 && (
                  <div className="alert alert-danger mt-3 text-start" role="alert">
                    Please fix the errors above before submitting.
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserForm;