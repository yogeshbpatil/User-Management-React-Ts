// src/App.tsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import UserForm from './pages/Form/UserForm';
import UserList from './pages/List/UserList';
import './App.css';

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="App">
          <Navbar />
          <div className="container-fluid p-0">
            <Routes>
              <Route path="/" element={<UserForm />} />
              <Route path="/form" element={<UserForm />} />
              <Route path="/list" element={<UserList />} />
            </Routes>
          </div>
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;