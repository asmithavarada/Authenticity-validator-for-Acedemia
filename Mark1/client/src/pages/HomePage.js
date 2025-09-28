import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Shield, 
  CheckCircle, 
  Upload, 
  Search, 
  Users, 
  Award,
  ArrowRight,
  Building2,
  FileText
} from 'lucide-react';

const HomePage = () => {
  const stats = [
    { number: "10,000+", label: "Certificates Verified" },
    { number: "500+", label: "Universities Registered" },
    { number: "99.9%", label: "Accuracy Rate" },
    { number: "24/7", label: "Available" }
  ];

  // A common style for cards. Adjust these Tailwind classes if your .card style was different.
  const cardStyles = "bg-white p-6 rounded-lg shadow-lg text-center hover:shadow-glow transition-all duration-300";

  return (
    <div className="min-h-screen relative overflow-hidden bg-gray-900">
      {/* Enhanced Animated Background with darker gradient and geometric pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800">
        <div className="absolute inset-0 opacity-40" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}></div>
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-blue-800/30 to-indigo-900/30"></div>
      </div>

      {/* Floating Blockchain and Certificate Icons - Enhanced with more SVG icons */}
      <motion.div 
        className="absolute top-20 left-20 w-16 h-16 opacity-80"
        animate={{ 
          y: [0, -15, 0],
          rotate: [0, 5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          repeatType: "reverse"
        }}
      >
        {/* Blockchain Shield Icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-300 drop-shadow-glow">
          <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 2.18l7 3.12v5.7c0 4.83-3.4 9.19-7 10.3-3.6-1.11-7-5.47-7-10.3V6.3l7-3.12z" fill="currentColor"/>
          <path d="M12 7L9 9.5V14.5L12 17L15 14.5V9.5L12 7Z" fill="currentColor"/>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute bottom-20 right-20 w-20 h-20 opacity-80"
        animate={{ 
          y: [0, -20, 0],
          rotate: [0, -8, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
          repeatType: "reverse"
        }}
      >
        {/* Certificate Grid Icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-200 drop-shadow-glow">
          <path d="M19 3H5C3.9 3 3 3.9 3 5V19C3 20.1 3.9 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM19 19H5V5H19V19Z" fill="currentColor"/>
          <path d="M14 17H17V14H14V17ZM14 13H17V10H14V13ZM14 9H17V6H14V9ZM7 17H10V14H7V17ZM7 13H10V10H7V13ZM7 9H10V6H7V9Z" fill="currentColor"/>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-1/2 left-10 w-14 h-14 opacity-80"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, 10, 0]
        }}
        transition={{ 
          duration: 3.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
          repeatType: "reverse"
        }}
      >
        {/* Blockchain Node Icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-cyan-300 drop-shadow-glow">
          <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor"/>
          <path d="M2 17L12 22L22 17V7L12 12L2 7V17Z" fill="currentColor" fillOpacity="0.7"/>
        </svg>
      </motion.div>
      
      <motion.div 
        className="absolute top-1/3 right-1/4 w-12 h-12 opacity-80"
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 4.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.5,
          repeatType: "reverse"
        }}
      >
        {/* Verification Checkmark Icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-indigo-300 drop-shadow-glow">
          <path d="M19 3H5C3.89 3 3 3.9 3 5V19C3 20.1 3.89 21 5 21H19C20.1 21 21 20.1 21 19V5C21 3.9 20.1 3 19 3ZM10 17L5 12L6.41 10.59L10 14.17L17.59 6.58L19 8L10 17Z" fill="currentColor"/>
        </svg>
      </motion.div>

      {/* Additional floating certificate icons */}
      <motion.div 
        className="absolute top-1/4 right-1/6 w-10 h-10 opacity-70"
        animate={{ 
          y: [0, -8, 0],
          rotate: [0, 8, 0]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
          repeatType: "reverse"
        }}
      >
        {/* Document Certificate Icon */}
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-200 drop-shadow-glow">
          <path d="M14 2H6C4.9 2 4.01 2.9 4.01 4L4 20C4 21.1 4.89 22 5.99 22H18C19.1 22 20 21.1 20 20V8L14 2ZM16 18H8V16H16V18ZM16 14H8V12H16V14ZM13 9V3.5L18.5 9H13Z" fill="currentColor"/>
        </svg>
      </motion.div>

      {/* New Blockchain Icon */}
      <motion.div 
        className="absolute top-2/3 left-1/4 w-12 h-12 opacity-70"
        animate={{ 
          y: [0, -10, 0],
          rotate: [0, -5, 0]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.7,
          repeatType: "reverse"
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-blue-400 drop-shadow-glow">
          <path d="M12 1.75L5.75 12.25L12 16L18.25 12.25L12 1.75Z" fill="currentColor" fillOpacity="0.7"/>
          <path d="M12 16L5.75 12.25L5.75 19.75L12 23.5L18.25 19.75L18.25 12.25L12 16Z" fill="currentColor" fillOpacity="0.5"/>
        </svg>
      </motion.div>

      {/* New Certificate Badge Icon */}
      <motion.div 
        className="absolute bottom-1/3 right-1/3 w-14 h-14 opacity-70"
        animate={{ 
          y: [0, -12, 0],
          rotate: [0, 8, 0]
        }}
        transition={{ 
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1.2,
          repeatType: "reverse"
        }}
      >
        <svg viewBox="0 0 24 24" fill="none" className="w-full h-full text-cyan-200 drop-shadow-glow">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="currentColor" fillOpacity="0.7"/>
        </svg>
      </motion.div>

      {/* Data Flow Lines - Enhanced with more visible lines */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse"></div>
        <div className="absolute top-2/3 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-0 w-full h-px bg-gradient-to-r from-transparent via-blue-400/60 to-transparent animate-pulse" style={{animationDelay: '0.5s'}}></div>
        
        {/* Additional diagonal data flow lines */}
        <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent animate-pulse" style={{animationDelay: '1.5s'}}></div>
        <div className="absolute top-0 left-2/3 w-px h-full bg-gradient-to-b from-transparent via-blue-400/40 to-transparent animate-pulse" style={{animationDelay: '2s'}}></div>
      </div>

      {/* Hero Section - Enhanced visibility with stronger drop shadows and contrast */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center"
          >
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/10 border border-white/20 text-white mb-4 backdrop-blur">
              Blockchain-powered • OCR • AI
            </span>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 drop-shadow-[0_4px_8px_rgba(0,0,0,0.5)]">
              Secure Certificate
              <span className="bg-gradient-to-r from-cyan-300 to-blue-300 bg-clip-text text-transparent block drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]">Verification System</span>
            </h1>
            <p className="text-xl text-white mb-8 max-w-3xl mx-auto drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] font-medium">
              Verify academic certificates instantly using blockchain technology, 
              OCR, and AI-powered authentication. Protect against fraud and ensure 
              academic integrity.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/agency/register"
                className="bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white text-lg px-8 py-3 rounded-xl inline-flex items-center space-x-2 transition-all duration-200 shadow-lg hover:shadow-xl ring-1 ring-white/10"
              >
                <Users className="h-5 w-5" />
                <span>Register as Agency</span>
              </Link>
              <Link
                to="/university/register"
                className="bg-white/10 backdrop-blur-sm border border-white/30 text-white text-lg px-8 py-3 rounded-xl inline-flex items-center space-x-2 hover:bg-white/20 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                <Building2 className="h-5 w-5" />
                <span>Register University</span>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats Section - glass cards on gradient */}
      <section className="py-16 bg-gradient-to-br from-blue-950 via-blue-900 to-indigo-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="text-center rounded-2xl p-6 backdrop-blur bg-white/10 border border-white/15 shadow-glow"
              >
                <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                  {stat.number}
                </div>
                <div className="text-white/80 text-sm md:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Capabilities</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Everything you need to issue, verify, and audit academic certificates end-to-end.</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: '🔗', title: 'On-chain Proof', desc: 'Immutable certificate hashes stored on blockchain.' },
              { icon: '🧠', title: 'AI OCR', desc: 'Accurate data extraction from uploaded documents.' },
              { icon: '🛡️', title: 'Tamper Detection', desc: 'Instant mismatch alerts and fraud detection.' },
              { icon: '📊', title: 'Analytics', desc: 'Trends, volumes, and verification insights.' },
            ].map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              >
                <div className="text-3xl mb-3" aria-hidden>{item.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section removed as requested */}

      {/* Platform Modules Section - gradient borders and hover */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Platform Modules
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Comprehensive solution for all stakeholders in certificate verification.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-[1px] bg-gradient-to-r from-red-400/60 via-purple-400/60 to-blue-400/60 hover:from-red-500/80 hover:via-purple-500/80 hover:to-blue-500/80 transition-all"
            >
              <div className="rounded-2xl bg-white p-6 h-full hover:shadow-xl transition-shadow">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Admin Module</h3>
                <p className="text-gray-600 mb-4">
                  Manage university approvals, monitor agencies, and audit verification activities.
                </p>
                <Link
                  to="/admin/login"
                  className="text-red-600 hover:text-red-700 font-medium inline-flex items-center"
                >
                  Admin Login <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="rounded-2xl p-[1px] bg-gradient-to-r from-blue-400/60 via-cyan-400/60 to-indigo-400/60 hover:from-blue-500/80 hover:via-cyan-500/80 hover:to-indigo-500/80 transition-all"
            >
              <div className="rounded-2xl bg-white p-6 h-full hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Award className="h-8 w-8 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">University Module</h3>
                <p className="text-gray-600 mb-4">
                  Upload certificates, manage student records, and track verification status.
                </p>
                <Link
                  to="/university/login"
                  className="text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
                >
                  University Login <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="rounded-2xl p-[1px] bg-gradient-to-r from-purple-400/60 via-pink-400/60 to-blue-400/60 hover:from-purple-500/80 hover:via-pink-500/80 hover:to-blue-500/80 transition-all"
            >
              <div className="rounded-2xl bg-white p-6 h-full hover:shadow-xl transition-shadow">
                <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="h-8 w-8 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Agency Module</h3>
                <p className="text-gray-600 mb-4">
                  Verify certificates, track verification history, and generate reports.
                </p>
                <Link
                  to="/agency/login"
                  className="text-purple-600 hover:text-purple-700 font-medium inline-flex items-center"
                >
                  Agency Login <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple, secure, and fast certificate verification process.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center"
            >
              <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Upload className="h-8 w-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">1. University Upload</h3>
              <p className="text-gray-600">
                Universities upload student certificates to the blockchain after admin approval.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-center"
            >
              <div className="bg-secondary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">2. Agency Verification</h3>
              <p className="text-gray-600">
                Agencies verify certificates using OCR and blockchain matching technology.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center"
            >
              <div className="bg-accent-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="h-8 w-8 text-accent-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">3. Admin Monitoring</h3>
              <p className="text-gray-600">
                Admins monitor all activities and ensure system integrity and security.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Security & Compliance */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="rounded-2xl p-6 bg-white shadow-lg border border-gray-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-3">Security & Compliance</h3>
              <ul className="space-y-3 text-gray-700">
                <li>• End-to-end encryption in transit</li>
                <li>• Role-based access controls</li>
                <li>• Immutable audit logs</li>
                <li>• GDPR-ready data handling</li>
              </ul>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="rounded-2xl p-6 backdrop-blur bg-gradient-to-br from-blue-600/10 to-indigo-600/10 border border-blue-400/20"
            >
              <div className="grid grid-cols-2 gap-4">
                {['Blockchain', 'OCR', 'AI Match', 'Audit'].map((chip) => (
                  <div key={chip} className="text-center bg-white rounded-xl py-6 shadow-sm">
                    <div className="text-sm font-semibold text-gray-900">{chip}</div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6">
            <h3 className="text-sm font-semibold text-gray-500 tracking-wider">TRUSTED BY</h3>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {['State Univ', 'TechCorp', 'Gov Agency', 'EdBoard'].map((name) => (
              <div key={name} className="h-16 rounded-xl border border-gray-100 bg-gray-50 flex items-center justify-center text-gray-500 text-sm font-medium">
                {name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section removed as requested */}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary-600 to-secondary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
              Join thousands of institutions already using CertVerify to secure 
              their certificate verification process.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/university/register"
                className="bg-white text-primary-600 hover:bg-gray-100 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <span>Register Your University</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                to="/agency/register"
                className="border-2 border-white text-white hover:bg-white hover:text-primary-600 font-medium py-3 px-8 rounded-lg transition-colors duration-200 inline-flex items-center space-x-2"
              >
                <span>Register as Agency</span>
                <Users className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;