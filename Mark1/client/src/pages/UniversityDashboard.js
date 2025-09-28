import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Upload, 
  FileText, 
  Users, 
  Shield, 
  TrendingUp, 
  Calendar,
  CheckCircle,
  AlertTriangle,
  Clock,
  BarChart3,
  ArrowRight,
  Plus
} from 'lucide-react';
import { useQuery } from 'react-query';
import { certificatesAPI, verificationAPI } from '../services/api';
import { getUniversity } from '../utils/auth';

const UniversityDashboard = () => {
  const university = getUniversity();
  const [stats, setStats] = useState({
    totalCertificates: 0,
    verifiedToday: 0,
    totalVerifications: 0,
    verificationRate: 0
  });

  // Fetch certificates
  const { data: certificatesData, isLoading: certificatesLoading } = useQuery(
    'university-certificates',
    () => certificatesAPI.getUniversityCertificates(1, 5),
    {
      refetchOnWindowFocus: false,
    }
  );

  // Fetch verification stats
  const { data: verificationStats } = useQuery(
    'verification-stats',
    verificationAPI.getVerificationStats,
    {
      refetchOnWindowFocus: false,
    }
  );

  useEffect(() => {
    if (certificatesData && verificationStats) {
      setStats({
        totalCertificates: certificatesData.pagination?.total || 0,
        verifiedToday: verificationStats.stats?.verifiedCount || 0,
        totalVerifications: verificationStats.stats?.totalVerifications || 0,
        verificationRate: parseFloat(verificationStats.stats?.verificationRate || 0)
      });
    }
  }, [certificatesData, verificationStats]);

  const quickActions = [
    {
      title: 'Upload Certificates',
      description: 'Bulk upload certificates via CSV file',
      icon: <Upload className="h-8 w-8 text-primary-600" />,
      link: '/university/upload',
      color: 'bg-primary-50 border-primary-200 hover:bg-primary-100'
    },
    {
      title: 'View Certificates',
      description: 'Manage and view all your certificates',
      icon: <FileText className="h-8 w-8 text-secondary-600" />,
      link: '/university/certificates',
      color: 'bg-secondary-50 border-secondary-200 hover:bg-secondary-100'
    },
    {
      title: 'Blockchain Management',
      description: 'Generate and manage blockchain hashes',
      icon: <Shield className="h-8 w-8 text-purple-600" />,
      link: '/university/blockchain',
      color: 'bg-purple-50 border-purple-200 hover:bg-purple-100'
    }
  ];

  const recentCertificates = certificatesData?.certificates || [];

  return (
    <div className="min-h-screen gradient-bg py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {university?.name}
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your certificates and track verification activity
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Calendar className="h-4 w-4" />
              <span>{new Date().toLocaleDateString()}</span>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCertificates}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <FileText className="h-6 w-6 text-primary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <TrendingUp className="h-4 w-4 mr-1" />
              <span>Active certificates</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Verified Today</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verifiedToday}</p>
              </div>
              <div className="bg-secondary-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-secondary-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-blue-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>Last 24 hours</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Verifications</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVerifications}</p>
              </div>
              <div className="bg-accent-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-accent-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-purple-600">
              <Shield className="h-4 w-4 mr-1" />
              <span>All time</span>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">{stats.verificationRate}%</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            <div className="mt-4 flex items-center text-sm text-green-600">
              <CheckCircle className="h-4 w-4 mr-1" />
              <span>Verification accuracy</span>
            </div>
          </div>
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className={`card border-2 transition-all duration-200 hover:shadow-lg ${action.color}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {action.icon}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {action.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {action.description}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
              </Link>
            ))}
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Certificates */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="card"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Certificates</h2>
              <Link
                to="/university/certificates"
                className="text-primary-600 hover:text-primary-700 text-sm font-medium flex items-center space-x-1"
              >
                <span>View all</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>

            {certificatesLoading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <div key={index} className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : recentCertificates.length > 0 ? (
              <div className="space-y-4">
                {recentCertificates.map((certificate, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{certificate.studentName}</h3>
                      <p className="text-sm text-gray-600">
                        {certificate.course} • {certificate.graduationYear}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Roll: {certificate.rollNumber}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${
                        certificate.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                      }`}></div>
                      <span className="text-xs text-gray-500 capitalize">
                        {certificate.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates yet</h3>
                <p className="text-gray-600 mb-4">Start by uploading your first batch of certificates</p>
                <Link
                  to="/university/upload"
                  className="btn-primary inline-flex items-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Upload Certificates</span>
                </Link>
              </div>
            )}
          </motion.div>

          {/* Verification Activity */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="card"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Verification Activity</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                  <div>
                    <p className="font-medium text-green-800">Successful Verifications</p>
                    <p className="text-sm text-green-600">Certificates verified today</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {stats.verifiedToday}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-6 w-6 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">Total Verifications</p>
                    <p className="text-sm text-blue-600">All time verifications</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {stats.totalVerifications}
                </div>
              </div>

              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                  <div>
                    <p className="font-medium text-purple-800">Success Rate</p>
                    <p className="text-sm text-purple-600">Verification accuracy</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {stats.verificationRate}%
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <Link
                to="/university/stats"
                className="btn-secondary w-full text-center"
              >
                View Detailed Analytics
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mt-8 card bg-blue-50 border-blue-200"
        >
          <div className="flex items-start space-x-3">
            <Shield className="h-6 w-6 text-blue-600 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-800 mb-2">
                Security & Privacy
              </h3>
              <p className="text-blue-700">
                All your certificates are secured using blockchain technology. Your data is encrypted 
                and protected with enterprise-grade security measures. We maintain strict privacy 
                protocols and never share your information with third parties.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default UniversityDashboard;
