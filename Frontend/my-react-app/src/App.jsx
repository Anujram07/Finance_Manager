import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Home/Home';
import Dashboard from './Pages/Dashboard';
import HowItWorks from './Pages/How_it_works';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Loan from './Components/Loan_eligibility/Loan';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const navigate = useNavigate();

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('John Doe');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} userName={userName} logout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/signup" />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
        <Route path="/signup" element={<Signup setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
        <Route path="/loan" element={<Loan />} />
      </Routes>
    </>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
};

export default App;
