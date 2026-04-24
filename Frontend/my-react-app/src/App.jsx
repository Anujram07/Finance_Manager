import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './Components/Navbar';
import Home from './Home/Home';
import Dashboard from './Pages/Dashboard';
import HowItWorks from './Pages/How_it_works';
import Login from './Pages/Login';
import Loan from './Components/Loan_eligibility/Loan';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('John Doe');

  return (
    <Router>
      <Navbar isLoggedIn={isLoggedIn} userName={userName} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserName={setUserName} />} />
        <Route path="/loan" element={<Loan />} />
      </Routes>
    </Router>
  );
};

export default App;
