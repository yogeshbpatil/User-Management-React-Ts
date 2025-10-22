import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
      <div className="container">
        <Link className="navbar-brand" to="/">
          User Management
        </Link>
        
        <div className="navbar-nav">
          <Link 
            className={`nav-link ${location.pathname === '/form' ? 'active' : ''}`} 
            to="/form"
          >
            Form
          </Link>
          <Link 
            className={`nav-link ${location.pathname === '/list' ? 'active' : ''}`} 
            to="/list"
          >
            List
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;