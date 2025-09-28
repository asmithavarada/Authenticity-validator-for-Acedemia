const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const universitySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  address: {
    type: String,
    required: true,
    trim: true
  },
  officialEmail: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  universityCode: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  contactNumber: {
    type: String,
    required: true
  },
  website: {
    type: String,
    trim: true
  },
  universityType: {
    type: String,
    enum: ['public', 'private', 'community_college', 'technical_institute', 'research_university', 'other'],
    required: true
  },
  accreditationNumber: {
    type: String,
    required: true,
    trim: true
  },
  letterheadPdf: {
    filename: {
      type: String
    },
    path: {
      type: String
    },
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  approvalStatus: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  approvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  },
  approvedAt: {
    type: Date
  },
  rejectionReason: {
    type: String,
    trim: true
  },
  flags: {
    totalFlags: { type: Number, default: 0 },
    lastFlaggedAt: { type: Date },
    reasons: [{ type: String }]
  },
  walletAddress: {
    type: String,
    unique: true,
    sparse: true
  },
  walletSetup: {
    isSetup: {
      type: Boolean,
      default: false
    },
    setupAt: {
      type: Date
    }
  },
  certificatesCount: {
    type: Number,
    default: 0
  },
  lastLogin: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
universitySchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
universitySchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('University', universitySchema);
