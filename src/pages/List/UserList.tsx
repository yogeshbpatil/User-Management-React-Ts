// src/pages/List/UserList.tsx
import React, { useState } from 'react';
import { FormData } from '../../tryes/FormTypes';
import { useUsers } from '../../context/UserContext';

const UserList: React.FC = () => {
  const { users, deleteUser } = useUsers();
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Filter users based on search term
  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.mobileNumber.includes(searchTerm)
  );

  const handleDelete = (id: string) => {
    deleteUser(id);
    setDeleteConfirm(null);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAddress = (addressLine1: string, addressLine2: string, city: string, pinCode: string) => {
    let address = addressLine1;
    if (addressLine2) address += `, ${addressLine2}`;
    address += `, ${city} - ${pinCode}`;
    return address;
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-12">
          {/* Header Section */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="text-primary mb-1">
                <i className="bi bi-people-fill me-2"></i>
                User Management
              </h2>
              <p className="text-muted">Manage your user database efficiently</p>
            </div>
            <div className="text-end">
              <span className="badge bg-primary fs-6">
                Total Users: {users.length}
              </span>
            </div>
          </div>

          {/* Search and Stats Section */}
          <div className="card shadow-sm mb-4">
            <div className="card-body">
              <div className="row align-items-center">
                <div className="col-md-6">
                  <div className="input-group">
                    <span className="input-group-text bg-light border-end-0">
                      <i className="bi bi-search text-muted"></i>
                    </span>
                    <input
                      type="text"
                      className="form-control border-start-0"
                      placeholder="Search by name, email, or mobile..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>
                <div className="col-md-6 text-md-end mt-2 mt-md-0">
                  <small className="text-muted">
                    Showing {filteredUsers.length} of {users.length} users
                  </small>
                </div>
              </div>
            </div>
          </div>

          {/* Users Table */}
          <div className="card shadow-sm">
            <div className="card-header bg-light">
              <h5 className="card-title mb-0 text-dark">
                <i className="bi bi-list-ul me-2"></i>
                Users List
              </h5>
            </div>
            <div className="card-body p-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-5">
                  <i className="bi bi-people display-1 text-muted"></i>
                  <h4 className="text-muted mt-3">No users found</h4>
                  <p className="text-muted">
                    {searchTerm ? 'Try adjusting your search terms' : 'Start by adding some users from the Form page'}
                  </p>
                </div>
              ) : (
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead className="table-light">
                      <tr>
                        <th scope="col" className="ps-4">Name</th>
                        <th scope="col">Mobile Number</th>
                        <th scope="col">Email Address</th>
                        <th scope="col">Date of Birth</th>
                        <th scope="col">Address</th>
                        <th scope="col" className="text-center pe-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user: any, index: any) => (
                        <tr key={user.id} className={index % 2 === 0 ? 'table-default' : ''}>
                          <td className="ps-4">
                            <div className="d-flex align-items-center">
                              <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px' }}>
                                <span className="text-white fw-bold">
                                  {user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <div className="fw-semibold">{user.name}</div>
                                <small className="text-muted">{user.city}</small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-phone me-2 text-muted"></i>
                              {user.mobileNumber}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <i className="bi bi-envelope me-2 text-muted"></i>
                              <a href={`mailto:${user.email}`} className="text-decoration-none">
                                {user.email}
                              </a>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">
                              {formatDate(user.dateOfBirth)}
                            </span>
                          </td>
                          <td>
                            <small className="text-muted">
                              {formatAddress(user.addressLine1, user.addressLine2, user.city, user.pinCode)}
                            </small>
                          </td>
                          <td className="text-center pe-4">
                            <div className="btn-group" role="group">
                              <button
                                className="btn btn-outline-primary btn-sm"
                                title="Edit User"
                                onClick={() => {/* Add edit functionality */}}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="btn btn-outline-danger btn-sm"
                                title="Delete User"
                                onClick={() => setDeleteConfirm(user.id!)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Delete Confirmation Modal */}
          {deleteConfirm && (
            <div className="modal fade show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header border-0">
                    <h5 className="modal-title text-danger">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      Confirm Delete
                    </h5>
                  </div>
                  <div className="modal-body py-4">
                    <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                  </div>
                  <div className="modal-footer border-0">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setDeleteConfirm(null)}
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDelete(deleteConfirm)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserList;