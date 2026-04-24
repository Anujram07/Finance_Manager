import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu, X, ChevronDown, LogOut, Settings, User,
  Home, BarChart3, HelpCircle, DollarSign, ChevronRight
} from 'lucide-react';

const Navbar = ({ isLoggedIn = false, userName = 'John Doe' }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef(null);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'How it Works', href: '/how-it-works', icon: HelpCircle },
    { name: 'Loan Eligibility', href: '/loan', icon: DollarSign },
  ];

  const isActive = (path) => location.pathname === path;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* Main Navbar */}
      <nav className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-100' 
          : 'bg-white/90 backdrop-blur-md border-b border-slate-100/50'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">

            {/* Logo Section */}
            <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold text-sm shadow-lg group-hover:shadow-emerald-500/40 transition-all duration-300 group-hover:scale-105">
                FV
              </div>
              <div className="hidden sm:block">
                <p className="text-lg font-bold text-slate-900 tracking-tight">FinanceView</p>
                <p className="text-xs text-emerald-600 font-semibold leading-none">AI Finance</p>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center gap-2">
              {navLinks.map((link) => (
                <Link key={link.href} to={link.href} className="relative group">
                  <button
                    className={`px-4 py-2.5 rounded-lg transition-all duration-200 flex items-center gap-2 font-medium text-sm ${
                      isActive(link.href)
                        ? 'text-emerald-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <link.icon size={18} />
                    {link.name}
                  </button>
                  {/* Active underline indicator */}
                  <div className={`absolute bottom-0 left-4 right-4 h-1 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-full transition-all duration-300 ${
                    isActive(link.href) ? 'scale-x-100 opacity-100' : 'scale-x-0 opacity-0 group-hover:scale-x-100 group-hover:opacity-50'
                  }`} />
                </Link>
              ))}
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                // Profile Dropdown
                <div className="relative hidden sm:block" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 hover:from-emerald-100 hover:to-teal-100 transition-all duration-200 group border border-emerald-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-emerald-400/50 transition-all">
                      {userName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-900 hidden md:inline">
                      {userName.split(' ')[0]}
                    </span>
                    <ChevronDown size={16} className={`text-slate-600 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {/* Premium Dropdown Menu */}
                  {isProfileOpen && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      {/* User Info Header */}
                      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 px-6 py-4 border-b border-slate-100">
                        <p className="text-xs text-slate-500 uppercase tracking-wider font-semibold">Account</p>
                        <p className="text-sm font-bold text-slate-900 mt-1">{userName}</p>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                        <Link to="/profile" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors group">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-emerald-100 transition-colors">
                            <User size={16} className="text-slate-600 group-hover:text-emerald-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Profile</p>
                            <p className="text-xs text-slate-500">View your profile</p>
                          </div>
                        </Link>

                        <Link to="/dashboard" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors group">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-blue-100 transition-colors">
                            <BarChart3 size={16} className="text-slate-600 group-hover:text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Dashboard</p>
                            <p className="text-xs text-slate-500">View analytics</p>
                          </div>
                        </Link>

                        <Link to="/settings" className="flex items-center gap-3 px-6 py-3 hover:bg-slate-50 transition-colors group">
                          <div className="p-2 bg-slate-100 rounded-lg group-hover:bg-purple-100 transition-colors">
                            <Settings size={16} className="text-slate-600 group-hover:text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-slate-900">Settings</p>
                            <p className="text-xs text-slate-500">Manage preferences</p>
                          </div>
                        </Link>
                      </div>

                      {/* Divider */}
                      <div className="border-t border-slate-100" />

                      {/* Logout Button */}
                      <button className="w-full flex items-center gap-3 px-6 py-3 hover:bg-red-50 transition-colors text-red-600 font-semibold group">
                        <div className="p-2 bg-red-50 rounded-lg group-hover:bg-red-100 transition-colors">
                          <LogOut size={16} className="text-red-600" />
                        </div>
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                // Auth Buttons
                <div className="hidden sm:flex items-center gap-3">
                  <Link to="/login">
                    <button className="px-5 py-2.5 text-slate-700 font-semibold hover:text-emerald-600 transition-colors duration-200 rounded-lg">
                      Login
                    </button>
                  </Link>
                  <Link to="/login">
                    <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all duration-200 flex items-center gap-2 group">
                      Sign Up
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                  </Link>
                </div>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 hover:bg-slate-100 rounded-lg transition-colors duration-200"
              >
                {isMenuOpen ? (
                  <X size={24} className="text-slate-900" />
                ) : (
                  <Menu size={24} className="text-slate-900" />
                )}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="lg:hidden pb-6 border-t border-slate-200 animate-in slide-in-from-top duration-300">
              <div className="flex flex-col gap-2 mt-4">
                {navLinks.map((link) => (
                  <Link key={link.href} to={link.href} onClick={() => setIsMenuOpen(false)}>
                    <button
                      className={`w-full px-4 py-3 rounded-lg transition-all duration-200 flex items-center gap-3 font-semibold text-sm ${
                        isActive(link.href)
                          ? 'bg-gradient-to-r from-emerald-100 to-teal-100 text-emerald-700 border-l-4 border-emerald-600'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <link.icon size={20} />
                      {link.name}
                    </button>
                  </Link>
                ))}

                {!isLoggedIn && (
                  <div className="flex flex-col gap-2 mt-6 pt-4 border-t border-slate-200">
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full px-4 py-3 text-slate-700 font-semibold hover:bg-slate-100 rounded-lg transition-colors duration-200">
                        Login
                      </button>
                    </Link>
                    <Link to="/login" onClick={() => setIsMenuOpen(false)}>
                      <button className="w-full px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2">
                        Sign Up
                        <ChevronRight size={16} />
                      </button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content overlap */}
      <div className="h-20"></div>
    </>
  );
};

export default Navbar;
