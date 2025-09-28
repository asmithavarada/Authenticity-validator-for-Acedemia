import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Shield, 
  Hash, 
  Copy, 
  CheckCircle, 
  AlertTriangle,
  RefreshCw,
  Download,
  QrCode,
  Eye,
  Search,
  Filter
} from 'lucide-react';
import { useQuery, useMutation } from 'react-query';
import toast from 'react-hot-toast';
import { certificatesAPI, blockchainAPI } from '../services/api';
import { getRegistryWithSigner } from '../utils/registryConfig';
import { generateBlockchainHash, formatBlockchainHash, copyToClipboard, generateQRCodeData } from '../utils/blockchain';

const BlockchainManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedCertificate, setSelectedCertificate] = useState(null);
  const [isGeneratingHash, setIsGeneratingHash] = useState(false);
  const [preparedItems, setPreparedItems] = useState([]);

  const { data: certificatesData, isLoading, refetch } = useQuery(
    ['university-certificates', 1, 100], // Get all certificates
    () => certificatesAPI.getUniversityCertificates(1, 100),
    {
      refetchOnWindowFocus: false,
    }
  );

  const certificates = certificatesData?.certificates || [];

  const filteredCertificates = certificates.filter(cert => {
    const matchesSearch = 
      cert.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.course.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || cert.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const generateHashForCertificate = async (certificate) => {
    setIsGeneratingHash(true);
    
    try {
      // Simulate API call to generate blockchain hash
      const newHash = generateBlockchainHash(certificate);
      
      // Update certificate with new hash (in real app, this would be an API call)
      toast.success(`Blockchain hash generated for ${certificate.studentName}`);
      
      // Refresh the data
      refetch();
      
    } catch (error) {
      console.error('Error generating hash:', error);
      toast.error('Failed to generate blockchain hash');
    } finally {
      setIsGeneratingHash(false);
    }
  };

  const copyHashToClipboard = async (hash) => {
    const success = await copyToClipboard(hash);
    if (success) {
      toast.success('Blockchain hash copied to clipboard!');
    } else {
      toast.error('Failed to copy hash');
    }
  };

  const downloadCertificateData = (certificate) => {
    const qrData = generateQRCodeData(certificate);
    const dataString = JSON.stringify(qrData, null, 2);
    
    const blob = new Blob([dataString], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate_${certificate.rollNumber}_blockchain_data.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    toast.success('Certificate blockchain data downloaded!');
  };

  // Prepare unpublished hashes for on-chain publish
  const prepareMutation = useMutation(
    async () => {
      const res = await blockchainAPI.prepareForPublish();
      return res.items || [];
    },
    {
      onSuccess: (items) => {
        setPreparedItems(items);
        toast.success(`Prepared ${items.length} item(s) for publishing`);
      },
      onError: () => toast.error('Failed to prepare items')
    }
  );

  // Confirm publish after a manual on-chain tx (temporary until wallet connect)
  const confirmMutation = useMutation(
    async ({ txHash, blockNumber }) => {
      if (!preparedItems.length) throw new Error('Nothing prepared');
      return blockchainAPI.confirmPublish({ txHash, blockNumber, items: preparedItems });
    },
    {
      onSuccess: (res) => {
        toast.success(`Marked ${res.updated || 0} as on-chain`);
        setPreparedItems([]);
        refetch();
      },
      onError: () => toast.error('Failed to confirm publish')
    }
  );

  const publishWithMetaMask = useMutation(
    async () => {
      const res = await blockchainAPI.prepareForPublish();
      const items = res.items || [];
      if (!items.length) throw new Error('Nothing to publish');
      const { contract, provider } = await getRegistryWithSigner();
      const hashes = items.map(i => i.hash);
      const ids = items.map(i => i.certificateNumber || i.id);
      const tx = await contract.batchSetCertificates(hashes, ids);
      const receipt = await tx.wait();
      return { txHash: tx.hash, blockNumber: receipt?.blockNumber, items };
    },
    {
      onSuccess: ({ txHash, blockNumber, items }) => {
        blockchainAPI.confirmPublish({ txHash, blockNumber, items })
          .then(() => {
            toast.success('Published on-chain and marked in system');
            refetch();
          })
          .catch(() => toast.error('On-chain ok, failed to mark server'));
      },
      onError: (e) => toast.error(e?.message || 'Failed to publish')
    }
  );

  const getHashStatus = (certificate) => {
    if (!certificate.blockchainHash) return 'not_generated';
    if (certificate.blockchainHash.length === 64) return 'generated';
    return 'invalid';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'generated':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'not_generated':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'invalid':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'generated':
        return 'bg-green-100 text-green-800';
      case 'not_generated':
        return 'bg-yellow-100 text-yellow-800';
      case 'invalid':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

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
          <div className="flex items-center space-x-4 mb-4">
            <Link
              to="/university/dashboard"
              className="text-gray-600 hover:text-primary-600 transition-colors duration-200"
            >
              <ArrowLeft className="h-6 w-6" />
            </Link>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900">
                Blockchain Management
              </h1>
              <p className="text-gray-600 mt-2">
                Generate and manage blockchain hashes for your certificates
              </p>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Certificates</p>
                <p className="text-2xl font-bold text-gray-900">{certificates.length}</p>
              </div>
              <div className="bg-primary-100 p-3 rounded-lg">
                <Shield className="h-6 w-6 text-primary-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Hash Generated</p>
                <p className="text-2xl font-bold text-green-600">
                  {certificates.filter(c => getHashStatus(c) === 'generated').length}
                </p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  {certificates.filter(c => getHashStatus(c) === 'not_generated').length}
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Coverage</p>
                <p className="text-2xl font-bold text-blue-600">
                  {certificates.length > 0 
                    ? Math.round((certificates.filter(c => getHashStatus(c) === 'generated').length / certificates.length) * 100)
                    : 0}%
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Hash className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="card mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="input-field pl-10"
                  placeholder="Search by student name, roll number, or course..."
                />
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="input-field"
              >
                <option value="all">All Status</option>
                <option value="generated">Hash Generated</option>
                <option value="not_generated">Pending</option>
                <option value="invalid">Invalid</option>
              </select>
            </div>
            <div className="flex items-center gap-3">
              <button
                className="btn-secondary"
                onClick={() => prepareMutation.mutate()}
                disabled={prepareMutation.isLoading}
              >
                {prepareMutation.isLoading ? 'Preparing…' : 'Prepare Unpublished'}
              </button>
              <button
                className="btn-primary"
                onClick={() => publishWithMetaMask.mutate()}
                disabled={publishWithMetaMask.isLoading}
              >
                {publishWithMetaMask.isLoading ? 'Publishing…' : 'Publish with MetaMask'}
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  const txHash = window.prompt('Enter blockchain tx hash');
                  if (!txHash) return;
                  const blockNumber = window.prompt('Enter block number (optional)') || undefined;
                  confirmMutation.mutate({ txHash, blockNumber });
                }}
                disabled={!preparedItems.length || confirmMutation.isLoading}
              >
                {confirmMutation.isLoading ? 'Confirming…' : `Confirm Publish (${preparedItems.length})`}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Certificates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="card"
        >
          {isLoading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : filteredCertificates.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Course
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hash Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blockchain Hash
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCertificates.map((certificate, index) => {
                    const hashStatus = getHashStatus(certificate);
                    return (
                      <motion.tr
                        key={certificate._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="hover:bg-gray-50"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {certificate.studentName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {certificate.rollNumber}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">{certificate.course}</div>
                          <div className="text-sm text-gray-500">{certificate.graduationYear}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(hashStatus)}`}>
                            {getStatusIcon(hashStatus)}
                            <span className="ml-1 capitalize">
                              {hashStatus.replace('_', ' ')}
                            </span>
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center space-x-2">
                            <code className="text-xs text-gray-600 font-mono">
                              {certificate.blockchainHash ? formatBlockchainHash(certificate.blockchainHash) : 'Not generated'}
                            </code>
                            {certificate.blockchainHash && (
                              <button
                                onClick={() => copyHashToClipboard(certificate.blockchainHash)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                <Copy className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            {hashStatus === 'not_generated' && (
                              <button
                                onClick={() => generateHashForCertificate(certificate)}
                                disabled={isGeneratingHash}
                                className="btn-primary text-xs py-1 px-2 disabled:opacity-50"
                              >
                                {isGeneratingHash ? (
                                  <RefreshCw className="h-3 w-3 animate-spin" />
                                ) : (
                                  'Generate Hash'
                                )}
                              </button>
                            )}
                            <button
                              onClick={() => setSelectedCertificate(certificate)}
                              className="text-primary-600 hover:text-primary-900"
                            >
                              <Eye className="h-4 w-4" />
                            </button>
                            {hashStatus === 'generated' && (
                              <button
                                onClick={() => downloadCertificateData(certificate)}
                                className="text-green-600 hover:text-green-900"
                              >
                                <Download className="h-4 w-4" />
                              </button>
                            )}
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-12">
              <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No certificates found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || statusFilter !== 'all' 
                  ? 'Try adjusting your search or filter criteria'
                  : 'No certificates available for blockchain management'
                }
              </p>
            </div>
          )}
        </motion.div>

        {/* Certificate Detail Modal */}
        {selectedCertificate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
            onClick={() => setSelectedCertificate(null)}
          >
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Certificate Details</h3>
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ×
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Student Name</label>
                    <p className="text-sm text-gray-900">{selectedCertificate.studentName}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Roll Number</label>
                    <p className="text-sm text-gray-900">{selectedCertificate.rollNumber}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Course</label>
                    <p className="text-sm text-gray-900">{selectedCertificate.course}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Blockchain Hash</label>
                    <div className="flex items-center space-x-2">
                      <code className="text-xs text-gray-600 font-mono break-all">
                        {selectedCertificate.blockchainHash || 'Not generated'}
                      </code>
                      {selectedCertificate.blockchainHash && (
                        <button
                          onClick={() => copyHashToClipboard(selectedCertificate.blockchainHash)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium text-gray-500">Hash Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(getHashStatus(selectedCertificate))}`}>
                      {getStatusIcon(getHashStatus(selectedCertificate))}
                      <span className="ml-1 capitalize">
                        {getHashStatus(selectedCertificate).replace('_', ' ')}
                      </span>
                    </span>
                  </div>
                </div>
                
                <div className="mt-6 flex justify-end space-x-3">
                  <button
                    onClick={() => setSelectedCertificate(null)}
                    className="btn-secondary"
                  >
                    Close
                  </button>
                  {getHashStatus(selectedCertificate) === 'not_generated' && (
                    <button
                      onClick={() => {
                        generateHashForCertificate(selectedCertificate);
                        setSelectedCertificate(null);
                      }}
                      className="btn-primary"
                    >
                      Generate Hash
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default BlockchainManagement;
