import React, { useState, useEffect } from 'react';
import { useTypedSelector, useTypedDispatch } from '../../hooks/index';
import { createUser, updateUser, setEditingUser, clearError } from '../../store/slices/userSlice';
import { showToast } from '../../store/slices/toastSlice';
import type { FormErrors, FormData } from '../../store/types';
import { useNavigate } from 'react-router-dom';

const UserForm: React.FC = () => {
  const dispatch = useTypedDispatch();
  const navigate = useNavigate();

  const { loading, error, editingUser } = useTypedSelector((state: any) => state.users);

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

  // Set form data when editingUser changes
  useEffect(() => {
    if (editingUser) {
      setFormData(editingUser);
    } else {
      // Reset form when not editing
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
    }
    // Clear any existing errors when form data changes
    setErrors({});
    dispatch(clearError());
  }, [editingUser, dispatch]);

  // Clear error when component unmounts or when starting new operation
  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  // Validation rules
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
    const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
    } else if (!dateRegex.test(formData.dateOfBirth)) {
      newErrors.dateOfBirth = 'Please enter date in DD/MM/YYYY format';
    } else {
      // Additional validation for valid date
      const parts = formData.dateOfBirth.split('/').map(Number);
      const day = parts[0];
      const month = parts[1];
      const year = parts[2];
      
      if (day !== undefined && month !== undefined && year !== undefined) {
        const date = new Date(year, month - 1, day);
        if (date.getDate() !== day || date.getMonth() !== month - 1 || date.getFullYear() !== year) {
          newErrors.dateOfBirth = 'Please enter a valid date';
        }
      }
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

    let formattedValue = value;

    // Format date input for DD/MM/YYYY
    if (name === 'dateOfBirth') {
      // Remove any non-digit characters
      const digitsOnly = value.replace(/\D/g, '');

      // Format as DD/MM/YYYY
      if (digitsOnly.length <= 2) {
        formattedValue = digitsOnly;
      } else if (digitsOnly.length <= 4) {
        formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2)}`;
      } else {
        formattedValue = `${digitsOnly.slice(0, 2)}/${digitsOnly.slice(2, 4)}/${digitsOnly.slice(4, 8)}`;
      }
    }

    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }));

    // Clear error when user starts typing
    if (errors[name as keyof FormErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }

    // Clear global error when user starts typing
    if (error) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    dispatch(clearError()); // Clear any previous errors

    if (validateForm()) {
      try {
        if (editingUser && editingUser._id) {
          // Update existing user
          await dispatch(updateUser({ id: editingUser._id, userData: formData })).unwrap();
          dispatch(showToast({ message: 'User updated successfully!', type: 'success' }));
          handleResetAndNavigate();
        } else {
          // Add new user
          await dispatch(createUser(formData)).unwrap();
          dispatch(showToast({ message: 'User created successfully!', type: 'success' }));
          handleResetAndNavigate();
        }
      } catch (err: any) {
        // Error is already handled in the slice, toast will be shown
        console.error('Form submission error:', err);
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
    dispatch(setEditingUser(null));
    dispatch(clearError());
  };

  const handleResetAndNavigate = () => {
    handleReset();
    // Navigate to list page after successful submission
    navigate('/list');
  };

  const handleCancelEdit = () => {
    dispatch(setEditingUser(null));
    handleReset();
    navigate('/list');
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h2 className="text-center mb-0">
                {editingUser ? 'Edit User' : 'User Registration Form'}
              </h2>
            </div>
            <div className="card-body">
              {error && (
                <div className="alert alert-danger" role="alert">
                  <strong>Error:</strong> {error}
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
                      Date of Birth (DD/MM/YYYY) <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${errors.dateOfBirth ? 'is-invalid' : ''}`}
                      id="dateOfBirth"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      placeholder="DD/MM/YYYY"
                      maxLength={10}
                    />
                    {errors.dateOfBirth && (
                      <div className="invalid-feedback text-start">{errors.dateOfBirth}</div>
                    )}
                    <small className="form-text text-muted">

                    </small>
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
                  {editingUser ? (
                    <>
                      <button
                        type="button"
                        className="btn btn-outline-secondary me-md-2"
                        onClick={handleCancelEdit}
                        disabled={loading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={loading}
                      >
                        {loading ? 'Updating...' : 'Update User'}
                      </button>
                    </>
                  ) : (
                    <>
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
                    </>
                  )}
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
