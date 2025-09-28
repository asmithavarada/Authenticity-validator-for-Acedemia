import React, { useState } from 'react';
import { useMutation } from 'react-query';
import { certificatesAPI } from '../services/api';
import toast from 'react-hot-toast';

const UploadCertificates = () => {
  const [file, setFile] = useState(null);
  const [pdfFiles, setPdfFiles] = useState([]);

  const uploadMutation = useMutation(
    async () => {
      if (!file) throw new Error('Please choose a CSV file');
      return certificatesAPI.uploadCertificates(file);
    },
    {
      onSuccess: (data) => {
        toast.success(`Uploaded: ${data?.summary?.successful || 0}, Errors: ${data?.summary?.errors || 0}`);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'Upload failed');
      }
    }
  );

  const uploadPdfsMutation = useMutation(
    async () => {
      if (!pdfFiles || pdfFiles.length === 0) throw new Error('Please choose PDF files');
      return certificatesAPI.uploadCertificatePdfs(pdfFiles);
    },
    {
      onSuccess: (data) => {
        toast.success(`PDFs processed: ${data?.createdCount || 0}, Errors: ${data?.errorsCount || 0}`);
      },
      onError: (err) => {
        toast.error(err?.response?.data?.message || 'PDF upload failed');
      }
    }
  );

  return (
    <div className="max-w-xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold mb-6">Upload Certificates</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold">CSV Upload</h2>
          <input type="file" accept=".csv" onChange={(e) => setFile(e.target.files?.[0] || null)} />
          <button className="btn-primary" onClick={() => uploadMutation.mutate()} disabled={uploadMutation.isLoading}>
            {uploadMutation.isLoading ? 'Uploading...' : 'Upload CSV'}
          </button>
          <div className="text-sm text-gray-600">
            Expected columns: studentName, rollNumber, course, graduationYear, marks, certificateNumber, issueDate
          </div>
        </div>
        <div className="card space-y-4">
          <h2 className="text-lg font-semibold">PDF Upload (Multiple)</h2>
          <input multiple type="file" accept="application/pdf" onChange={(e) => setPdfFiles(Array.from(e.target.files || []))} />
          <button className="btn-secondary" onClick={() => uploadPdfsMutation.mutate()} disabled={uploadPdfsMutation.isLoading}>
            {uploadPdfsMutation.isLoading ? 'Processing...' : 'Upload PDFs'}
          </button>
          <div className="text-sm text-gray-600">
            Upload multiple certificate PDFs. Each file will be hashed and added.
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadCertificates;



