const mongoose = require('mongoose');

const verificationLogSchema = new mongoose.Schema({
  agencyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Agency',
    required: false
  },
  agencyName: {
    type: String,
    required: false
  },
  certificateId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Certificate',
    required: false
  },
  studentName: {
    type: String,
    required: true
  },
  rollNumber: {
    type: String,
    required: true
  },
  universityName: {
    type: String,
    required: true
  },
  universityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University'
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'fake', 'suspicious', 'not_found'],
    required: true
  },
  verificationMethod: {
    type: String,
    enum: ['ocr', 'manual', 'hash_match'],
    required: true
  },
  ocrConfidence: {
    type: Number,
    min: 0,
    max: 100
  },
  blockchainHash: {
    type: String
  },
  blockchainTransactionId: {
    type: String
  },
  issuedYear: {
    type: Number
  },
  uploadDate: {
    type: Date
  },
  verificationDate: {
    type: Date,
    default: Date.now
  },
  suspiciousFlags: [{
    type: String,
    enum: ['tampered_seal', 'signature_mismatch', 'photo_swap', 'format_inconsistency', 'data_mismatch']
  }],
  notes: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String
  },
  userAgent: {
    type: String
  }
});

// Index for efficient queries
verificationLogSchema.index({ agencyId: 1, verificationDate: -1 });
verificationLogSchema.index({ certificateId: 1 });
verificationLogSchema.index({ verificationStatus: 1 });
verificationLogSchema.index({ verificationDate: -1 });

module.exports = mongoose.model('VerificationLog', verificationLogSchema);