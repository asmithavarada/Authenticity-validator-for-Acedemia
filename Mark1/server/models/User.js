const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  organization: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['employer', 'government', 'educational_institution', 'other'],
    required: true
  },
  verificationCount: {
    type: Number,
    default: 0
  },
  lastVerification: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('User', userSchema);
