import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../redux/slices/authSlice.js';
import { Lock, Mail, Loader2, ArrowRight, ShieldCheck, KeyRound } from 'lucide-react';
import api from '../services/api.js';

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, loading: authLoading, error: authError } = useSelector((state) => state.auth);

  const [viewMode, setViewMode] = useState('login'); // login, forgot, verify, reset
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [resetEmail, setResetEmail] = useState('');
  const [otpCode, setOtpCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const [localLoading, setLocalLoading] = useState(false);
  const [localMessage, setLocalMessage] = useState('');
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      if (user.role === 'SuperAdmin' || user.role === 'Admin') {
        navigate('/admin');
      } else if (user.role === 'Teacher') {
        navigate('/teacher');
      } else {
        navigate('/student');
      }
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const handleSubmitLogin = (e) => {
    e.preventDefault();
    dispatch(loginUser(credentials));
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    setLocalLoading(true);
    setLocalError('');
    setLocalMessage('');
    try {
      const res = await api.post('/auth/forgot-password', { email: resetEmail });
      if (res.data.success) {
        setLocalMessage('A 6-digit OTP code has been sent to your email.');
        setTimeout(() => setViewMode('verify'), 1500);
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to request OTP code.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    if (!otpCode) return;
    setLocalLoading(true);
    setLocalError('');
    setLocalMessage('');
    try {
      const res = await api.post('/auth/verify-otp', { email: resetEmail, otp: otpCode });
      if (res.data.success) {
        setLocalMessage('OTP verified successfully!');
        setTimeout(() => setViewMode('reset'), 1500);
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Invalid or expired OTP code.');
    } finally {
      setLocalLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setLocalError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setLocalError('Password must be at least 6 characters.');
      return;
    }
    setLocalLoading(true);
    setLocalError('');
    setLocalMessage('');
    try {
      const res = await api.post('/auth/reset-password', {
        email: resetEmail,
        otp: otpCode,
        newPassword,
      });
      if (res.data.success) {
        setLocalMessage('Password updated successfully! Redirecting...');
        setTimeout(() => {
          setViewMode('login');
          setCredentials({ email: resetEmail, password: '' });
          setLocalMessage('');
        }, 2000);
      }
    } catch (err) {
      setLocalError(err.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="flex min-h-[75vh] items-center justify-center px-4">
      <div className="w-full max-w-md space-y-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-8 shadow-lg">
        
        {/* LOGIN VIEW */}
        {viewMode === 'login' && (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                ERP Portal Sign In
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Log in to access your role-based academic dashboard.
              </p>
            </div>

            {(authError || localError) && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-xs font-semibold text-red-500">
                {authError || localError}
              </div>
            )}

            <form onSubmit={handleSubmitLogin} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="email"
                      name="email"
                      value={credentials.email}
                      onChange={handleChange}
                      className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                      placeholder="name@college.edu.in"
                      required
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-xs font-bold text-slate-400 uppercase">Password</label>
                    <button
                      type="button"
                      onClick={() => { setViewMode('forgot'); setLocalError(''); setLocalMessage(''); }}
                      className="text-xs text-blue-600 hover:underline font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      name="password"
                      value={credentials.password}
                      onChange={handleChange}
                      className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-blue-500 disabled:bg-blue-450"
              >
                {authLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In to Dashboard
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>
            </form>

            <div className="border-t border-slate-100 dark:border-slate-800 pt-6">
              <p className="text-[11px] font-bold uppercase text-slate-400 tracking-wider mb-2">Super Admin Login for Evaluation</p>
              <div className="rounded-lg bg-slate-50 dark:bg-slate-950 p-4 border border-slate-150 dark:border-slate-850 space-y-1.5 text-xs text-slate-650 dark:text-slate-350">
                <p><strong>Email:</strong> admin@college.edu.in</p>
                <p><strong>Password:</strong> admin123</p>
              </div>
            </div>
          </>
        )}

        {/* FORGOT PASSWORD VIEW */}
        {viewMode === 'forgot' && (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                <KeyRound className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Reset Password
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter your email address to request a one-time verification code.
              </p>
            </div>

            {localError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-xs font-semibold text-red-500">
                {localError}
              </div>
            )}
            {localMessage && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-600">
                {localMessage}
              </div>
            )}

            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Registered Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                    placeholder="name@college.edu.in"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setViewMode('login')}
                  className="w-1/3 rounded-lg border border-slate-205 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={localLoading}
                  className="w-2/3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500 disabled:bg-blue-450"
                >
                  {localLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get OTP Code'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* VERIFY OTP VIEW */}
        {viewMode === 'verify' && (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                Enter OTP Code
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Enter the verification code sent to <strong>{resetEmail}</strong>.
              </p>
            </div>

            {localError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-xs font-semibold text-red-500">
                {localError}
              </div>
            )}
            {localMessage && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-600">
                {localMessage}
              </div>
            )}

            <form onSubmit={handleVerifyOTP} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">6-Digit Verification Code</label>
                <input
                  type="text"
                  maxLength="6"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent py-2.5 px-3 text-center text-lg font-bold tracking-widest focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                  placeholder="000000"
                  required
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setViewMode('forgot')}
                  className="w-1/3 rounded-lg border border-slate-205 py-3 text-xs font-semibold text-slate-700 dark:text-slate-200"
                >
                  Change Email
                </button>
                <button
                  type="submit"
                  disabled={localLoading}
                  className="w-2/3 inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500 disabled:bg-blue-450"
                >
                  {localLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Verify Code'}
                </button>
              </div>
            </form>
          </>
        )}

        {/* RESET PASSWORD VIEW */}
        {viewMode === 'reset' && (
          <>
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                <Lock className="h-6 w-6" />
              </div>
              <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-950 dark:text-white">
                New Password
              </h2>
              <p className="mt-2 text-sm text-slate-500">
                Configure your new password credential to complete reset.
              </p>
            </div>

            {localError && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 text-xs font-semibold text-red-500">
                {localError}
              </div>
            )}
            {localMessage && (
              <div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/20 p-4 text-xs font-semibold text-emerald-600">
                {localMessage}
              </div>
            )}

            <form onSubmit={handleResetPassword} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Confirm New Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      type="password"
                      value={confirmNewPassword}
                      onChange={(e) => setConfirmNewPassword(e.target.value)}
                      className="w-full rounded border border-slate-350 dark:border-slate-750 bg-transparent py-2.5 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none text-slate-800 dark:text-slate-100"
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={localLoading}
                className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 py-3 text-sm font-semibold text-white shadow hover:bg-blue-500 disabled:bg-blue-450"
              >
                {localLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Confirm Password Reset'}
              </button>
            </form>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;
