import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, FileCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { useMutation } from 'react-query';

const VerificationPage = () => {
  const [certificateId, setCertificateId] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);

  const verifyMutation = useMutation(
    async (id) => {
      // This would be replaced with an actual API call
      const response = await fetch(`/api/verify/${id}`);
      if (!response.ok) {
        throw new Error('Verification failed');
      }
      return response.json();
    },
    {
      onSuccess: (data) => {
        setVerificationResult({
          isValid: true,
          details: data
        });
      },
      onError: () => {
        setVerificationResult({
          isValid: false,
          message: 'Certificate could not be verified or does not exist.'
        });
      }
    }
  );

  const handleVerify = (e) => {
    e.preventDefault();
    if (certificateId.trim()) {
      verifyMutation.mutate(certificateId);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated background elements */}
      <motion.div 
        className="absolute top-20 left-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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
        className="absolute bottom-20 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20"
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

      <div className="max-w-3xl mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-white mb-4">Certificate Verification</h1>
          <p className="text-blue-100 text-lg">
            Verify the authenticity of certificates using our blockchain-based verification system
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-xl shadow-xl p-8 border border-white border-opacity-20"
        >
          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label htmlFor="certificateId" className="block text-sm font-medium text-blue-100 mb-2">
                Certificate ID
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="text"
                  id="certificateId"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  className="block w-full pl-10 pr-12 py-3 bg-white bg-opacity-10 border border-blue-300 border-opacity-30 rounded-lg text-blue-100 placeholder-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter certificate ID or hash"
                />
              </div>
            </div>
            
            <div className="flex justify-center">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={verifyMutation.isLoading || !certificateId.trim()}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {verifyMutation.isLoading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Verifying...
                  </>
                ) : (
                  <>
                    <FileCheck className="mr-2 h-5 w-5" />
                    Verify Certificate
                  </>
                )}
              </motion.button>
            </div>
          </form>

          {verificationResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className={`mt-8 p-6 rounded-lg ${
                verificationResult.isValid
                  ? 'bg-green-100 bg-opacity-20 border border-green-300 border-opacity-30'
                  : 'bg-red-100 bg-opacity-20 border border-red-300 border-opacity-30'
              }`}
            >
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  {verificationResult.isValid ? (
                    <CheckCircle className="h-6 w-6 text-green-400" />
                  ) : (
                    <AlertCircle className="h-6 w-6 text-red-400" />
                  )}
                </div>
                <div className="ml-3">
                  <h3 className={`text-lg font-medium ${
                    verificationResult.isValid ? 'text-green-300' : 'text-red-300'
                  }`}>
                    {verificationResult.isValid ? 'Certificate Verified' : 'Verification Failed'}
                  </h3>
                  <div className="mt-2 text-sm text-blue-100">
                    {verificationResult.isValid ? (
                      <div className="space-y-2">
                        <p>The certificate is authentic and has been verified on the blockchain.</p>
                        {verificationResult.details && (
                          <div className="mt-4 bg-white bg-opacity-10 p-4 rounded-md">
                            <h4 className="font-medium text-blue-200 mb-2">Certificate Details:</h4>
                            <ul className="space-y-1 text-blue-100">
                              <li><span className="font-medium">Student Name:</span> {verificationResult.details.studentName}</li>
                              <li><span className="font-medium">University:</span> {verificationResult.details.university}</li>
                              <li><span className="font-medium">Course:</span> {verificationResult.details.course}</li>
                              <li><span className="font-medium">Issue Date:</span> {verificationResult.details.issueDate}</li>
                              <li><span className="font-medium">Blockchain Hash:</span> <span className="font-mono text-xs">{verificationResult.details.blockchainHash}</span></li>
                            </ul>
                          </div>
                        )}
                      </div>
                    ) : (
                      <p>{verificationResult.message}</p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 text-center"
        >
          <h2 className="text-2xl font-semibold text-white mb-4">How Verification Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">1</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Enter Certificate ID</h3>
              <p className="text-blue-100">Input the unique certificate ID provided on your certificate document</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">2</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">Blockchain Verification</h3>
              <p className="text-blue-100">Our system checks the certificate against blockchain records</p>
            </div>
            <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg p-6 rounded-xl border border-white border-opacity-20">
              <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold">3</span>
              </div>
              <h3 className="text-lg font-medium text-white mb-2">View Results</h3>
              <p className="text-blue-100">Get instant verification results with certificate details</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default VerificationPage;