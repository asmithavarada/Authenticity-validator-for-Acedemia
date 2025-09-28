const mongoose = require('mongoose');
const crypto = require('crypto');

const certificateSchema = new mongoose.Schema({
  studentName: {
    type: String,
    required: true,
    trim: true
  },
  rollNumber: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  },
  universityID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'University',
    required: true
  },
  universityName: {
    type: String,
    required: true
  },
  graduationYear: {
    type: Number,
    required: true
  },
  marks: {
    type: String,
    required: true
  },
  certificateNumber: {
    type: String,
    required: true,
    unique: true
  },
  blockchainHash: {
    type: String,
    required: true,
    unique: true
  },
  issueDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'revoked', 'suspended'],
    default: 'active'
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  lastVerified: {
    type: Date
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  blockchainTransactionId: {
    type: String
  },
  uploadTimestamp: {
    type: Date,
    default: Date.now
  },
  isLegacyUpload: {
    type: Boolean,
    default: false
  },
  legacyApprovedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  legacyApprovedAt: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate blockchain hash before saving
certificateSchema.pre('save', function(next) {
  if (!this.blockchainHash) {
    const data = `${this.studentName}-${this.rollNumber}-${this.certificateNumber}-${this.universityID}-${Date.now()}`;
    this.blockchainHash = crypto.createHash('sha256').update(data).digest('hex');
  }
  next();
});

// Index for faster searches
certificateSchema.index({ rollNumber: 1 });
certificateSchema.index({ certificateNumber: 1 });
certificateSchema.index({ blockchainHash: 1 });
certificateSchema.index({ universityID: 1 });

module.exports = mongoose.model('Certificate', certificateSchema);
