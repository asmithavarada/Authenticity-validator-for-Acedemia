import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, FileText, Shield, BarChart2, Settings, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Mock data for dashboard
  const stats = {
    universities: 24,
    agencies: 18,
    certificates: 1458,
    verifications: 876
  };

  const recentActivities = [
    { id: 1, action: 'New University Registered', entity: 'Delhi Technical University', time: '2 hours ago' },
    { id: 2, action: 'New Agency Registered', entity: 'National Skill Development Corp', time: '5 hours ago' },
    { id: 3, action: 'Bulk Certificates Uploaded', entity: 'Mumbai University', time: '1 day ago' },
    { id: 4, action: 'System Update Completed', entity: 'System Admin', time: '2 days ago' }
  ];

  const handleLogout = () => {
    // Handle logout logic here
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 right-20 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
        className="absolute bottom-20 left-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
            <h2 className="text-2xl font-bold text-white">Admin Panel</h2>
            <p className="text-blue-200 text-sm mt-1">Certificate Verification System</p>
          </div>
          
          <nav className="mt-6">
            <div className="px-4 space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors ${
                  activeTab === 'overview' 
                    ? 'bg-blue-700 bg-opacity-70 text-white' 
                    : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-40'
                }`}
              >
                <BarChart2 className="h-5 w-5 mr-3" />
                <span>Overview</span>
              </button>
              
              <button
                onClick={() => setActiveTab('universities')}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors ${
                  activeTab === 'universities' 
                    ? 'bg-blue-700 bg-opacity-70 text-white' 
                    : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-40'
                }`}
              >
                <FileText className="h-5 w-5 mr-3" />
                <span>Universities</span>
              </button>
              
              <button
                onClick={() => setActiveTab('agencies')}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors ${
                  activeTab === 'agencies' 
                    ? 'bg-blue-700 bg-opacity-70 text-white' 
                    : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-40'
                }`}
              >
                <Users className="h-5 w-5 mr-3" />
                <span>Agencies</span>
              </button>
              
              <button
                onClick={() => setActiveTab('settings')}
                className={`flex items-center px-4 py-3 w-full rounded-lg transition-colors ${
                  activeTab === 'settings' 
                    ? 'bg-blue-700 bg-opacity-70 text-white' 
                    : 'text-blue-200 hover:bg-blue-700 hover:bg-opacity-40'
                }`}
              >
                <Settings className="h-5 w-5 mr-3" />
                <span>Settings</span>
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
                {activeTab === 'overview' && 'Dashboard Overview'}
                {activeTab === 'universities' && 'Manage Universities'}
                {activeTab === 'agencies' && 'Manage Agencies'}
                {activeTab === 'settings' && 'System Settings'}
              </h1>
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-white">Admin User</p>
                  <p className="text-xs text-blue-300">System Administrator</p>
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
                      <div className="p-3 rounded-lg bg-blue-600 bg-opacity-30">
                        <FileText className="h-6 w-6 text-blue-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-blue-300">Universities</h3>
                        <p className="text-2xl font-bold text-white">{stats.universities}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-indigo-600 bg-opacity-30">
                        <Users className="h-6 w-6 text-indigo-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-indigo-300">Agencies</h3>
                        <p className="text-2xl font-bold text-white">{stats.agencies}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-purple-600 bg-opacity-30">
                        <FileText className="h-6 w-6 text-purple-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-purple-300">Certificates</h3>
                        <p className="text-2xl font-bold text-white">{stats.certificates}</p>
                      </div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    whileHover={{ y: -5 }}
                    className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20"
                  >
                    <div className="flex items-center">
                      <div className="p-3 rounded-lg bg-green-600 bg-opacity-30">
                        <Shield className="h-6 w-6 text-green-300" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-sm font-medium text-green-300">Verifications</h3>
                        <p className="text-2xl font-bold text-white">{stats.verifications}</p>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                      <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
                      <div className="space-y-4">
                        {recentActivities.map((activity) => (
                          <div 
                            key={activity.id}
                            className="flex items-start p-3 rounded-lg hover:bg-white hover:bg-opacity-5 transition-colors"
                          >
                            <div className="w-2 h-2 mt-2 rounded-full bg-blue-400 mr-3"></div>
                            <div>
                              <p className="text-white font-medium">{activity.action}</p>
                              <p className="text-blue-300 text-sm">{activity.entity}</p>
                              <p className="text-blue-400 text-xs mt-1">{activity.time}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                      <h2 className="text-xl font-semibold text-white mb-4">System Status</h2>
                      <div className="space-y-4">
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-blue-300">Server Load</span>
                            <span className="text-sm text-blue-300">28%</span>
                          </div>
                          <div className="w-full bg-blue-900 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '28%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-blue-300">Database</span>
                            <span className="text-sm text-blue-300">52%</span>
                          </div>
                          <div className="w-full bg-blue-900 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '52%' }}></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between mb-1">
                            <span className="text-sm text-blue-300">Storage</span>
                            <span className="text-sm text-blue-300">34%</span>
                          </div>
                          <div className="w-full bg-blue-900 rounded-full h-2">
                            <div className="bg-blue-500 h-2 rounded-full" style={{ width: '34%' }}></div>
                          </div>
                        </div>
                        
                        <div className="pt-4 border-t border-blue-800">
                          <p className="text-blue-300 text-sm">Last System Update</p>
                          <p className="text-white">September 22, 2023 - 14:30</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
            
            {activeTab === 'universities' && (
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">Manage Universities</h2>
                <p className="text-blue-300">University management interface would be displayed here.</p>
              </div>
            )}
            
            {activeTab === 'agencies' && (
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">Manage Agencies</h2>
                <p className="text-blue-300">Agency management interface would be displayed here.</p>
              </div>
            )}
            
            {activeTab === 'settings' && (
              <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl p-6 border border-white border-opacity-20">
                <h2 className="text-xl font-semibold text-white mb-4">System Settings</h2>
                <p className="text-blue-300">System configuration options would be displayed here.</p>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;