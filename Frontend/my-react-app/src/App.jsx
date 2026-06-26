import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Home/Home';
import Dashboard from './Pages/Dashboard';
import HowItWorks from './Pages/How_it_works';
import Finance from './Pages/Finance';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Loan from './Components/Loan_eligibility/Loan';

const AppContent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('John Doe');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('authUser');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setIsLoggedIn(true);
        setUserName(user?.name || user?.email || 'User');
      } catch {
        localStorage.removeItem('authToken');
        localStorage.removeItem('authUser');
      }
    }
  }, []);

  const logout = () => {
    setIsLoggedIn(false);
    setUserName('John Doe');
    localStorage.removeItem('authToken');
    localStorage.removeItem('authUser');
    navigate('/login');
  };

  return (
    <>
      {isLoggedIn && <Navbar isLoggedIn={isLoggedIn} userName={userName} logout={logout} />}
      <Routes>
        <Route path="/" element={isLoggedIn ? <Home /> : <Navigate to="/login" replace />} />
        <Route path="/dashboard" element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />} />
        <Route path="/how-it-works" element={isLoggedIn ? <HowItWorks /> : <Navigate to="/login" replace />} />
        <Route path="/finance" element={isLoggedIn ? <Finance /> : <Navigate to="/login" replace />} />
        <Route path="/loan" element={isLoggedIn ? <Loan /> : <Navigate to="/login" replace />} />
        <Route path="/login" element={isLoggedIn ? <Navigate to="/" replace /> : <Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
        <Route path="/signup" element={isLoggedIn ? <Navigate to="/" replace /> : <Signup setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
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
