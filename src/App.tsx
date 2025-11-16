import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import ErrorBoundary from './components/ErrorBoundary';
import Navbar from './components/Navbar';
import UserForm from './features/users/UserForm';
import UserList from './features/users/UserList';
import ToastContainer from './features/toast/ToastContainer';
import './App.css';

function App() {
  return (
    <ErrorBoundary>
      <Provider store={store}>
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
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
