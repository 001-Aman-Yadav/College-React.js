import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from './redux/slices/authSlice.js';
import { GraduationCap, LogOut, LayoutDashboard, LogIn, Menu, X, Sun, Moon } from 'lucide-react';

import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Admission from './pages/Admission.jsx';
import Courses from './pages/Courses.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import StudentDashboard from './pages/StudentDashboard.jsx';
import FacultyDashboard from './pages/FacultyDashboard.jsx';
import About from './pages/About.jsx';
import Placements from './pages/Placements.jsx';
import Contact from './pages/Contact.jsx';
import Downloads from './pages/Downloads.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AIChatbot from './components/AIChatbot.jsx';

function Navigation() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return document.documentElement.classList.contains('dark') || 
      localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const getDashboardPath = () => {
    if (!user) return '/login';
    if (user.role === 'SuperAdmin' || user.role === 'Admin') return '/admin';
    if (user.role === 'Teacher') return '/teacher';
    return '/student';
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <GraduationCap className="h-8 w-8 text-blue-600 dark:text-blue-500" />
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Metropolitan University
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-5">
            <Link to="/" className="text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition">Home</Link>
            <Link to="/about" className="text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition">About</Link>
            <Link to="/courses" className="text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition">Courses</Link>
            <Link to="/admission" className="text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition">Admission</Link>
            <Link to="/placements" className="text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition">Placements</Link>
            <Link to="/downloads" className="text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition">Downloads</Link>
            <Link to="/contact" className="text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 dark:hover:text-blue-400 transition">Contact</Link>
            
            {/* Theme Toggle */}
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            {/* Auth Actions */}
            {user ? (
              <div className="flex items-center gap-4">
                <Link
                  to={getDashboardPath()}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition"
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-transparent px-4 py-2 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-805 transition"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Logout
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-sm hover:bg-blue-500 transition"
              >
                <LogIn className="h-3.5 w-3.5" />
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className="rounded-full p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            >
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400 transition"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-4 space-y-3">
          <Link to="/" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 py-1">Home</Link>
          <Link to="/about" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 py-1">About</Link>
          <Link to="/courses" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 py-1">Courses</Link>
          <Link to="/admission" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 py-1">Admission</Link>
          <Link to="/placements" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 py-1">Placements</Link>
          <Link to="/downloads" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 py-1">Downloads</Link>
          <Link to="/contact" onClick={() => setIsOpen(false)} className="block text-sm font-medium text-slate-650 dark:text-slate-350 hover:text-blue-600 py-1">Contact</Link>
          
          <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex flex-col gap-2">
            {user ? (
              <>
                <Link
                  to={getDashboardPath()}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  Dashboard ({user.role})
                </Link>
                <button
                  onClick={() => { setIsOpen(false); handleLogout(); }}
                  className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 dark:border-slate-800 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-805"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-1.5 rounded-lg bg-blue-600 py-2.5 text-sm font-semibold text-white shadow-sm"
              >
                <LogIn className="h-4 w-4" />
                Sign In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-8 mt-12 text-center text-xs text-slate-400">
      <p>© {new Date().getFullYear()} Metropolitan University College ERP. All rights reserved.</p>
    </footer>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Listen to custom auth-logout event from api interceptor
    const handleAuthLogout = () => {
      dispatch({ type: 'auth/clearAuth' });
    };
    window.addEventListener('auth-logout', handleAuthLogout);
    return () => window.removeEventListener('auth-logout', handleAuthLogout);
  }, [dispatch]);

  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-900 dark:text-slate-100 transition-colors duration-200">
        <Navigation />
        <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/admission" element={<Admission />} />
            <Route path="/placements" element={<Placements />} />
            <Route path="/downloads" element={<Downloads />} />
            <Route path="/contact" element={<Contact />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['Admin', 'SuperAdmin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/student"
              element={
                <ProtectedRoute allowedRoles={['Student']}>
                  <StudentDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/teacher"
              element={
                <ProtectedRoute allowedRoles={['Teacher']}>
                  <FacultyDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </main>
        <Footer />
        <AIChatbot />
      </div>
    </Router>
  );
}

export default App;

