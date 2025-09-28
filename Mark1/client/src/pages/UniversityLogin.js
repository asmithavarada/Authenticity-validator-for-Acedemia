import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, School } from 'lucide-react';
import { setAuthToken, setUniversity } from '../utils/auth';

const UniversityLogin = () => {
  const navigate = useNavigate();
  const [officialEmail, setOfficialEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: async () => authAPI.loginUniversity({ officialEmail, password }),
    onSuccess: (data) => {
      if (data?.token) {
        setAuthToken(data.token);
        if (data.university) setUniversity(data.university);
        toast.success('Logged in successfully');
        navigate('/university/dashboard');
      } else {
        toast.error('Invalid server response');
      }
    },
    onError: (err) => {
      toast.error(err?.response?.data?.message || 'Login failed');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation.mutate();
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
              <div className="h-10 w-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <School className="h-6 w-6 text-blue-400" />
              </div>
              <h1 className="text-xl font-semibold text-white">University Portal</h1>
            </div>
            <p className="text-gray-200 text-sm leading-6">
              Upload certificates, manage student records, and monitor verification status in real time.
            </p>
            <ul className="mt-4 grid grid-cols-2 gap-2 text-xs text-gray-200">
              <li className="bg-white/10 rounded-lg px-3 py-2">Bulk Upload</li>
              <li className="bg-white/10 rounded-lg px-3 py-2">Chain Anchor</li>
              <li className="bg-white/10 rounded-lg px-3 py-2">Search & Filter</li>
              <li className="bg-white/10 rounded-lg px-3 py-2">Export CSV</li>
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
            <h2 className="text-2xl font-bold text-white">University Login</h2>
            <p className="mt-1 text-sm text-gray-300">Access your university dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-white mb-1">Email Address</label>
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
                  value={officialEmail}
                  onChange={(e) => setOfficialEmail(e.target.value)}
                  className="appearance-none block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="university@example.com"
                />
              </div>
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
            </div>

            <motion.button 
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              className="btn-primary w-full flex items-center justify-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              disabled={loginMutation.isLoading}
            >
              {loginMutation.isLoading ? (
                <div className="spinner mr-2"></div>
              ) : (
                <LogIn className="h-5 w-5 mr-2" />
              )}
              {loginMutation.isLoading ? 'Signing in...' : 'Sign In'}
            </motion.button>

            <div className="text-sm text-center text-blue-200">
              No account? <Link to="/university/register" className="text-blue-300 hover:text-white font-medium">Register</Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UniversityLogin;
