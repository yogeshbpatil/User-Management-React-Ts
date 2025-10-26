import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          <i className="bi bi-people-fill me-2"></i>
          User Management
        </Link>
        
        <div className="navbar-nav">
          <Link 
            className={`nav-link ${location.pathname === '/form' ? 'active' : ''}`} 
            to="/form"
          >
            <i className="bi bi-person-plus me-1"></i>
            Add User
          </Link>
          <Link 
            className={`nav-link ${location.pathname === '/list' ? 'active' : ''}`} 
            to="/list"
          >
            <i className="bi bi-list-ul me-1"></i>
            User List
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;