import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, LogIn, Briefcase } from 'lucide-react';
import { setAuthToken, setAgency } from '../utils/auth';

const AgencyLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation(
    async () => authAPI.loginAgency({ email, password }),
    {
      onSuccess: (data) => {
        if (data?.token) {
          setAuthToken(data.token);
          if (data.agency) setAgency(data.agency);
          toast.success('Logged in successfully');
          navigate('/agency/dashboard');
        } else {
          toast.error('Invalid server response');
        }
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'Login failed');
      }
    }
  );

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }}></div>
      <div className="absolute top-20 left-20 w-32 h-32 bg-blue-500/10 rounded-full blur-xl animate-bounce"></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-bounce" style={{animationDelay: '1s'}}></div>
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-md w-full glass-effect rounded-xl shadow-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
            <Briefcase className="h-8 w-8 text-indigo-600" />
          </div>
          <h2 className="text-3xl font-bold text-white">Agency Login</h2>
          <p className="mt-2 text-blue-200">Access your verification dashboard</p>
        </div>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1">Email Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-blue-300" />
              </div>
              <input 
                className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="agency@example.com" 
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-blue-200 mb-1">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-blue-300" />
              </div>
              <input 
                className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300" 
                type="password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                placeholder="••••••••" 
              />
            </div>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-primary w-full flex items-center justify-center bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 shadow-lg"
            onClick={() => loginMutation.mutate()} 
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
            No account? <Link to="/agency/register" className="text-blue-300 hover:text-white font-medium">Register</Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AgencyLogin;