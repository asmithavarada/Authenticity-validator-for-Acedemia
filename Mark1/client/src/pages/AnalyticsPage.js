import React from 'react';
import { useQuery } from 'react-query';
import { verificationAPI } from '../services/api';

const AnalyticsPage = () => {
  const { data, isLoading, error } = useQuery('verification-stats', verificationAPI.getVerificationStats);
  const stats = data?.stats || {};

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Verification Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card">
          <div className="text-sm text-gray-600">Total Verifications</div>
          <div className="text-2xl font-bold">{isLoading ? '...' : stats.totalVerifications || 0}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Verified</div>
          <div className="text-2xl font-bold">{isLoading ? '...' : stats.verifiedCount || 0}</div>
        </div>
        <div className="card">
          <div className="text-sm text-gray-600">Not Found</div>
          <div className="text-2xl font-bold">{isLoading ? '...' : stats.notFoundCount || 0}</div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;



