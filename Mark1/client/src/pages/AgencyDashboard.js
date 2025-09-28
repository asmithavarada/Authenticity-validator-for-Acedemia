import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileText, CheckCircle, Clock, User, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AgencyDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for dashboard
  const stats = {
    verified: 124,
    pending: 18,
    rejected: 5,
    total: 147
  };

  const recentVerifications = [
    { id: 1, name: 'Rahul Sharma', university: 'Delhi University', degree: 'B.Tech Computer Science', status: 'verified', date: '2 hours ago' },
    { id: 2, name: 'Priya Patel', university: 'Mumbai University', degree: 'MBA Finance', status: 'verified', date: '5 hours ago' },
    { id: 3, name: 'Amit Kumar', university: 'IIT Bombay', degree: 'M.Tech Electrical', status: 'pending', date: '1 day ago' },
    { id: 4, name: 'Sneha Gupta', university: 'Bangalore University', degree: 'BSc Computer Science', status: 'rejected', date: '2 days ago' }
  ];

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('agencyToken');
    navigate('/agency/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-900 via-blue-800 to-indigo-900">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ 
          x: [0, 30, 0],
          y: [0, 40, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 8,
          ease: "easeInOut" 
        }}
      />
      <motion.div 
        className="absolute bottom-20 left-10 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
        animate={{ 
          x: [0, -40, 0],
          y: [0, -30, 0],
        }}
        transition={{ 
          repeat: Infinity,
          duration: 10,
          ease: "easeInOut" 
        }}
      />

      <div className="flex h-screen">
        {/* Sidebar */}
        <motion.div 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="w-64 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-r border-white border-opacity-20"
        >
          <div className="p-6">
            <h2 className="text-2xl font-bold text-white">Agency Portal</h2>
            <p className="text-indigo-200 text-sm mt-1">Certificate Verification System</p>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-indigo-700 bg-opacity-70 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-700 hover:bg-opacity-40'
                }`}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('verify')}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors ${
                  activeTab === 'verify' 
                    ? 'bg-indigo-700 bg-opacity-70 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-700 hover:bg-opacity-40'
                }`}
              >
                <Search className="h-5 w-5 mr-3" />
                <span>Verify Certificate</span>
              </button>
              
              <button
                onClick={() => setActiveTab('history')}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors ${
                  activeTab === 'history' 
                    ? 'bg-indigo-700 bg-opacity-70 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-700 hover:bg-opacity-40'
                }`}
              >
                <Clock className="h-5 w-5 mr-3" />
                <span>Verification History</span>
              </button>
              
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors ${
                  activeTab === 'profile' 
                    ? 'bg-indigo-700 bg-opacity-70 text-white' 
                    : 'text-indigo-200 hover:bg-indigo-700 hover:bg-opacity-40'
                }`}
              >
                <User className="h-5 w-5 mr-3" />
                <span>Agency Profile</span>
              </button>
            </div>
            
            <div className="px-4 mt-8">
              <button
                onClick={handleLogout}
                className="flex items-center px-4 py-3 w-full rounded-lg text-red-300 hover:bg-red-900 hover:bg-opacity-30 transition-colors"
              >
                <LogOut className="h-5 w-5 mr-3" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </motion.div>
        
        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <header className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg border-b border-white border-opacity-20 p-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">
                {activeTab === 'overview' && 'Agency Dashboard'}
                {activeTab === 'verify' && 'Verify Certificate'}
                {activeTab === 'history' && 'Verification History'}
                {activeTab === 'profile' && 'Agency Profile'}
              </h1>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center">
                  <User className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">National Skills Agency</p>
                  <p className="text-xs text-indigo-300">Verified Agency</p>
                </div>
              </div>
            </div>
          </header>
          
          <main className="p-6">
            {activeTab === 'overview' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-600 bg-opacity-30">
                        <CheckCircle className="h-6 w-6 text-green-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-green-300">Verified</h3>
                        <p className="text-2xl font-bold text-white">{stats.verified}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-yellow-600 bg-opacity-30">
                        <Clock className="h-6 w-6 text-yellow-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-yellow-300">Pending</h3>
                        <p className="text-2xl font-bold text-white">{stats.pending}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-red-600 bg-opacity-30">
                        <FileText className="h-6 w-6 text-red-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-red-300">Rejected</h3>
                        <p className="text-2xl font-bold text-white">{stats.rejected}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-blue-600 bg-opacity-30">
                        <FileText className="h-6 w-6 text-blue-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-blue-300">Total</h3>
                        <p className="text-2xl font-bold text-white">{stats.total}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                      <h2 className="text-xl font-semibold text-white mb-4">Recent Verifications</h2>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-indigo-800">
                          <thead>
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Name</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">University</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Degree</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Status</th>
                              <th className="px-6 py-3 text-left text-xs font-medium text-indigo-300 uppercase tracking-wider">Date</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-indigo-800">
                            {recentVerifications.map((verification) => (
                              <tr key={verification.id} className="hover:bg-white hover:bg-opacity-5">
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{verification.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-200">{verification.university}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-200">{verification.degree}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                                    ${verification.status === 'verified' ? 'bg-green-100 text-green-800' : 
                                      verification.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 
                                      'bg-red-100 text-red-800'}`}>
                                    {verification.status}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-200">{verification.date}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                      <h2 className="text-xl font-semibold text-white mb-4">Quick Verification</h2>
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="certificateId" className="block text-sm font-medium text-indigo-200 mb-1">Certificate ID</label>
                          <div className="relative rounded-md shadow-sm">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <Search className="h-5 w-5 text-indigo-400" />
                            </div>
                            <input
                              type="text"
                              id="certificateId"
                              className="block w-full pl-10 pr-12 py-2 bg-white bg-opacity-10 border border-indigo-300 border-opacity-30 rounded-lg text-indigo-100 placeholder-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter certificate ID"
                            />
                          </div>
                        </div>
                        
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          type="submit"
                          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          <Search className="mr-2 h-4 w-4" />
                          Verify Certificate
                        </motion.button>
                      </form>
                      
                      <div className="mt-6 pt-6 border-t border-indigo-800">
                        <h3 className="text-lg font-medium text-white mb-2">Verification Stats</h3>
                        <div className="space-y-2">
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-indigo-300">Today</span>
                              <span className="text-sm text-indigo-300">12</span>
                            </div>
                            <div className="w-full bg-indigo-900 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '40%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-indigo-300">This Week</span>
                              <span className="text-sm text-indigo-300">48</span>
                            </div>
                            <div className="w-full bg-indigo-900 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '65%' }}></div>
                            </div>
                          </div>
                          
                          <div>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm text-indigo-300">This Month</span>
                              <span className="text-sm text-indigo-300">147</span>
                            </div>
                            <div className="w-full bg-indigo-900 rounded-full h-2">
                              <div className="bg-indigo-500 h-2 rounded-full" style={{ width: '80%' }}></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'verify' && (
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">Verify Certificate</h2>
                <p className="text-indigo-300">Certificate verification interface would be displayed here.</p>
              </div>
            )}
            
            {activeTab === 'history' && (
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">Verification History</h2>
                <p className="text-indigo-300">Full verification history would be displayed here.</p>
              </div>
            )}
            
            {activeTab === 'profile' && (
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">Agency Profile</h2>
                <p className="text-indigo-300">Agency profile information would be displayed here.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AgencyDashboard;