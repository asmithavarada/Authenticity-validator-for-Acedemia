import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { authAPI } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, Lock, Building, MapPin, Phone, User, FileText, School, ArrowRight } from 'lucide-react';

const UniversityRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    officialEmail: '',
    password: '',
    confirmPassword: '',
    address: '',
    city: '',
    state: '',
    contactNumber: '',
    registrationNumber: '',
    registrarName: ''
  });
  const [step, setStep] = useState(1);
  const [letterheadFile, setLetterheadFile] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setLetterheadFile(e.target.files[0]);
  };

  const registerMutation = useMutation(
    async () => {
      const formDataObj = new FormData();
      Object.keys(formData).forEach(key => {
        formDataObj.append(key, formData[key]);
      });
      if (letterheadFile) {
        formDataObj.append('letterheadPdf', letterheadFile);
      }
      return authAPI.registerUniversity(formDataObj);
    },
    {
      onSuccess: () => {
        toast.success('Registration successful! Please wait for admin approval.');
        navigate('/university/login');
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'Registration failed');
      }
    }
  );

  const validateStep1 = () => {
    if (!formData.name || !formData.officialEmail || !formData.password || !formData.confirmPassword) {
      toast.error('Please fill all required fields');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return false;
    }
    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.address || !formData.city || !formData.state || !formData.contactNumber) {
      toast.error('Please fill all required fields');
      return false;
    }
    return true;
  };

  const validateStep3 = () => {
    if (!formData.registrationNumber || !formData.registrarName || !letterheadFile) {
      toast.error('Please fill all required fields and upload letterhead');
      return false;
    }
    return true;
  };

  const nextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep3()) {
      registerMutation.mutate();
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 py-12 px-4 sm:px-6 lg:px-8">
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
        className="max-w-2xl mx-auto glass-effect rounded-xl shadow-2xl p-8 relative z-10"
      >
        <div className="text-center mb-8">
          <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <School className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-3xl font-bold text-white">University Registration</h2>
          <p className="mt-2 text-blue-200">Join our certificate verification network</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-between items-center mb-8">
          {[1, 2, 3].map((item) => (
            <div key={item} className="flex flex-col items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                step === item ? 'bg-blue-600 text-white' : 
                step > item ? 'bg-green-500 text-white' : 
                'bg-white/20 text-white'
              }`}>
                {step > item ? '✓' : item}
              </div>
              <span className="text-xs mt-2 text-blue-200">
                {item === 1 ? 'Account' : item === 2 ? 'Details' : 'Verification'}
              </span>
            </div>
          ))}
        </div>

        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">University Name*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building className="h-5 w-5 text-blue-300" />
                  </div>
                  <input 
                    className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="University Name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Official Email*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-blue-300" />
                  </div>
                  <input 
                    className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                    name="officialEmail"
                    type="email"
                    value={formData.officialEmail}
                    onChange={handleChange}
                    placeholder="registrar@university.edu"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Password*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300" />
                    </div>
                    <input 
                      className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">Confirm Password*</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-blue-300" />
                    </div>
                    <input 
                      className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      placeholder="••••••••"
                      required
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Address*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-blue-300" />
                  </div>
                  <input 
                    className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="University Address"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">City*</label>
                  <input 
                    className="input-field bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-blue-200 mb-1">State*</label>
                  <input 
                    className="input-field bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Contact Number*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-blue-300" />
                  </div>
                  <input 
                    className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    required
                  />
                </div>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Registration Number*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FileText className="h-5 w-5 text-blue-300" />
                  </div>
                  <input 
                    className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    placeholder="University Registration Number"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">Registrar Name*</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-blue-300" />
                  </div>
                  <input 
                    className="input-field pl-10 bg-white/10 border-blue-400/30 text-white placeholder-blue-300"
                    name="registrarName"
                    value={formData.registrarName}
                    onChange={handleChange}
                    placeholder="Registrar Name"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-blue-200 mb-1">University Letterhead (PDF)*</label>
                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-blue-400/30 border-dashed rounded-md bg-white/10">
                  <div className="space-y-1 text-center">
                    <FileText className="mx-auto h-12 w-12 text-blue-300" />
                    <div className="flex text-sm text-blue-200">
                      <label htmlFor="letterhead-upload" className="relative cursor-pointer bg-blue-600 rounded-md font-medium text-white hover:bg-blue-700 px-3 py-2">
                        <span>Upload a file</span>
                        <input 
                          id="letterhead-upload" 
                          name="letterheadPdf" 
                          type="file" 
                          className="sr-only"
                          accept=".pdf"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1 pt-2">{letterheadFile ? letterheadFile.name : 'No file chosen'}</p>
                    </div>
                    <p className="text-xs text-blue-200">PDF up to 10MB</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={prevStep}
                className="btn-secondary bg-white/20 text-white hover:bg-white/30"
              >
                Back
              </motion.button>
            )}
            
            {step < 3 ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={nextStep}
                className="btn-primary ml-auto flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
              >
                Next <ArrowRight className="h-4 w-4 ml-2" />
              </motion.button>
            ) : (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="btn-primary ml-auto flex items-center bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                disabled={registerMutation.isLoading}
              >
                {registerMutation.isLoading ? (
                  <>
                    <div className="spinner mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    Register
                  </>
                )}
              </motion.button>
            )}
          </div>
        </form>
        
        <div className="text-sm text-center mt-6 text-blue-200">
          Already have an account? <Link to="/university/login" className="text-blue-300 hover:text-white font-medium">Login</Link>
        </div>
      </motion.div>
    </div>
  );
};

export default UniversityRegister;