// Blockchain utilities for certificate verification
import crypto from 'crypto-js';

export const generateBlockchainHash = (certificateData) => {
  const dataString = JSON.stringify({
    studentName: certificateData.studentName,
    rollNumber: certificateData.rollNumber,
    course: certificateData.course,
    graduationYear: certificateData.graduationYear,
    marks: certificateData.marks,
    certificateNumber: certificateData.certificateNumber,
    universityId: certificateData.universityID,
    issueDate: certificateData.issueDate,
    timestamp: new Date().toISOString()
  });
  
  return crypto.SHA256(dataString).toString();
};

export const verifyBlockchainHash = (certificateData, hash) => {
  const generatedHash = generateBlockchainHash(certificateData);
  return generatedHash === hash;
};

export const generateQRCodeData = (certificateData) => {
  return {
    hash: certificateData.blockchainHash,
    rollNumber: certificateData.rollNumber,
    verificationUrl: `${window.location.origin}/verify?hash=${certificateData.blockchainHash}`,
    timestamp: new Date().toISOString()
  };
};

export const formatBlockchainHash = (hash) => {
  if (!hash) return '';
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
};
