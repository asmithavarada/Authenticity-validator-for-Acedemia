import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Shield } from 'lucide-react';
import { setAuthToken, setAdmin } from '../utils/auth';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({ email: '', password: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    setErrors({ email: '', password: '' });
    if (!email) {
      setErrors((prev) => ({ ...prev, email: 'Email is required' }));
      return;
    }
    if (!password) {
      setErrors((prev) => ({ ...prev, password: 'Password is required' }));
      return;
    }
    setIsLoading(true);
    
    // Hardcoded admin credentials for demo purposes
    if (email === "admin@example.com" && password === "admin123") {
      setTimeout(() => {
        toast.success('Login successful');
        setAuthToken('demo-admin-token');
        setAdmin({ name: 'Administrator', email });
        navigate('/admin/dashboard');
        setIsLoading(false);
      }, 500);
      return;
    }
    
    // If not using demo credentials, show error
    setTimeout(() => {
      toast.error('Login failed. Please use the demo credentials shown below.');
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s'}}></div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 items-center relative z-10">
        {/* Left: Marketing/Context */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
          <div className="glass-effect rounded-2xl p-6 shadow-2xl border border-white/20">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-red-500/20 flex items-center justify-center">
                <Shield className="h-6 w-6 text-red-400" />
              </div>
              <h1 className="text-xl font-semibold text-white">Admin Console</h1>
            </div>
            <p className="text-gray-200 text-sm leading-6">
              Manage approvals, audit verification logs, and oversee participating agencies and universities.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-200">
              <li className="bg-white/10 rounded-lg px-3 py-2">Audit Trails</li>
              <li className="bg-white/10 rounded-lg px-3 py-2">Role Controls</li>
              <li className="bg-white/10 rounded-lg px-3 py-2">Live Insights</li>
              <li className="bg-white/10 rounded-lg px-3 py-2">Chain Proof</li>
            </ul>
          </div>
        </motion.div>

        {/* Right: Form */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="glass-effect rounded-2xl shadow-2xl p-8"
        >
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white">Admin Login</h2>
            <p className="mt-1 text-sm text-gray-300">Access the admin dashboard</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="admin@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-300">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-white mb-1">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="••••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-xs text-red-300">{errors.password}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full flex justify-center items-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
            >
              {isLoading ? (
                <div className="spinner mr-2"></div>
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {isLoading ? 'Logging in...' : 'Sign in'}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-800/50 border border-gray-700 rounded-md">
            <h3 className="text-sm font-medium text-white mb-2 flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Test Credentials
            </h3>
            <div className="text-xs text-gray-300 space-y-1">
              <p><span className="font-semibold">Email:</span> admin@example.com</p>
              <p><span className="font-semibold">Password:</span> admin123</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;