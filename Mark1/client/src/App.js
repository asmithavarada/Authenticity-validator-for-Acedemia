import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';

// Pages
import HomePage from './pages/HomePage';
import VerificationPage from './pages/VerificationPage';
import UniversityLogin from './pages/UniversityLogin';
import UniversityRegister from './pages/UniversityRegister';
import UniversityDashboard from './pages/UniversityDashboard';
import UploadCertificates from './pages/UploadCertificates';
import CertificateList from './pages/CertificateList';
import BlockchainManagement from './pages/BlockchainManagement';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AgencyLogin from './pages/AgencyLogin';
import AgencyRegister from './pages/AgencyRegister';
import AgencyDashboard from './pages/AgencyDashboard';
import NotFound from './pages/NotFound';
import AnalyticsPage from './pages/AnalyticsPage';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AgencyProtectedRoute from './components/AgencyProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute';
import UniversityProtectedRoute from './components/UniversityProtectedRoute';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          
          <main className="min-h-screen">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<HomePage />} />
              
              {/* University Routes */}
              <Route path="/university/login" element={<UniversityLogin />} />
              <Route path="/university/register" element={<UniversityRegister />} />
              <Route path="/university/stats" element={<AnalyticsPage />} />
              
              {/* Admin Routes */}
              <Route path="/admin/login" element={<AdminLogin />} />
              
              {/* Agency Routes */}
              <Route path="/agency/login" element={<AgencyLogin />} />
              <Route path="/agency/register" element={<AgencyRegister />} />
              
              {/* Protected University Routes */}
              <Route 
                path="/university/dashboard" 
                element={
                  <UniversityProtectedRoute>
                    <UniversityDashboard />
                  </UniversityProtectedRoute>
                } 
              />
              <Route 
                path="/university/upload" 
                element={
                  <ProtectedRoute>
                    <UploadCertificates />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/university/certificates" 
                element={
                  <ProtectedRoute>
                    <CertificateList />
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/university/blockchain" 
                element={
                  <ProtectedRoute>
                    <BlockchainManagement />
                  </ProtectedRoute>
                } 
              />
              
              {/* Protected Admin Routes */}
              <Route 
                path="/admin/dashboard" 
                element={
                  <AdminProtectedRoute>
                    <AdminDashboard />
                  </AdminProtectedRoute>
                } 
              />
              
              {/* Protected Agency Routes */}
              <Route 
                path="/agency/dashboard" 
                element={
                  <AgencyProtectedRoute>
                    <AgencyDashboard />
                  </AgencyProtectedRoute>
                } 
              />
              <Route 
                path="/verify" 
                element={
                  <AgencyProtectedRoute>
                    <VerificationPage />
                  </AgencyProtectedRoute>
                } 
              />
              
              {/* 404 Route */}
              <Route path="/404" element={<NotFound />} />
              <Route path="*" element={<Navigate to="/404" replace />} />
            </Routes>
          </main>
          
          <Footer />
          
          {/* Toast notifications */}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#22c55e',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
