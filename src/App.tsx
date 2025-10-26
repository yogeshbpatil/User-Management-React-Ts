import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { UserProvider } from './context/UserContext';
import Navbar from './components/Navbar';
import UserForm from './pages/Form/UserForm';
import UserList from './pages/List/UserList';
import Toast from './components/Toast';
import { useUsers } from './context/UserContext';
import './App.css';

// Component to handle toast display
const ToastContainer: React.FC = () => {
  const { toast, clearToast } = useUsers();
  
  if (!toast) return null;
  
  return (
    <Toast
      message={toast.message}
      type={toast.type}
      onClose={clearToast}
    />
  );
};

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
          <ToastContainer />
        </div>
      </Router>
    </UserProvider>
  );
}

export default App;