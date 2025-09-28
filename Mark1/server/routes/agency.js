const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { auth, requireAgency } = require('../middleware/roleAuth');
const Agency = require('../models/Agency');
const Certificate = require('../models/Certificate');
const VerificationLog = require('../models/VerificationLog');
const University = require('../models/University');
const crypto = require('crypto');

const router = express.Router();

// @route   POST /api/agency/register
// @desc    Register a new agency
// @access  Public
router.post('/register', async (req, res) => {
  try {
    const { 
      name, 
      email, 
      password, 
      organization, 
      organizationType, 
      contactNumber, 
      address, 
      website 
    } = req.body;

    // Check if agency already exists
    const existingAgency = await Agency.findOne({ email });
    if (existingAgency) {
      return res.status(400).json({
        success: false,
        message: 'Agency with this email already exists'
      });
    }

    // Create new agency
    const agency = new Agency({
      name,
      email,
      password,
      organization,
      organizationType,
      contactNumber,
      address,
      website
    });

    await agency.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: agency._id, role: 'agency' },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Agency registered successfully',
      token,
      agency: {
        id: agency._id,
        name: agency.name,
        email: agency.email,
        organization: agency.organization,
        organizationType: agency.organizationType
      }
    });

  } catch (error) {
    console.error('Agency registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/agency/login
// @desc    Agency login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find agency by email
    const agency = await Agency.findOne({ email, isActive: true });
    if (!agency) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await agency.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    agency.lastLogin = new Date();
    await agency.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: agency._id, role: 'agency' },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      agency: {
        id: agency._id,
        name: agency.name,
        email: agency.email,
        organization: agency.organization,
        organizationType: agency.organizationType,
        verificationCount: agency.verificationCount
      }
    });

  } catch (error) {
    console.error('Agency login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/agency/dashboard
// @desc    Get agency dashboard data
// @access  Private (Agency)
router.get('/dashboard', auth, requireAgency, async (req, res) => {
  try {
    const agencyId = req.user._id;

    // Get verification statistics
    const totalVerifications = await VerificationLog.countDocuments({ agencyId });
    const verifiedCount = await VerificationLog.countDocuments({ 
      agencyId, 
      verificationStatus: 'verified' 
    });
    const fakeCount = await VerificationLog.countDocuments({ 
      agencyId, 
      verificationStatus: 'fake' 
    });
    const suspiciousCount = await VerificationLog.countDocuments({ 
      agencyId, 
      verificationStatus: 'suspicious' 
    });

    // Get recent verifications
    const recentVerifications = await VerificationLog.find({ agencyId })
      .populate('universityId', 'name universityCode')
      .sort({ verificationDate: -1 })
      .limit(10);

    res.json({
      success: true,
      data: {
        statistics: {
          totalVerifications,
          verifiedCount,
          fakeCount,
          suspiciousCount
        },
        recentVerifications
      }
    });

  } catch (error) {
    console.error('Agency dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// @route   POST /api/agency/verify
// @desc    Verify a certificate
// @access  Private (Agency)
router.post('/verify', auth, requireAgency, async (req, res) => {
  try {
    const { 
      certificateFile, 
      studentName, 
      rollNumber, 
      verificationMethod = 'ocr' 
    } = req.body;

    const agencyId = req.user._id;
    const ipAddress = req.ip || req.connection.remoteAddress;
    const userAgent = req.get('User-Agent');

    // Generate hash from uploaded file (in real implementation, this would be from the actual file)
    const fileHash = crypto.createHash('sha256')
      .update(`${studentName}-${rollNumber}-${Date.now()}`)
      .digest('hex');

    // Search for certificate in database
    let certificate = null;
    let verificationStatus = 'not_found';
    let suspiciousFlags = [];
    let ocrConfidence = 0;

    // Try to find certificate by roll number and student name
    certificate = await Certificate.findOne({
      rollNumber: rollNumber,
      studentName: { $regex: new RegExp(studentName, 'i') }
    }).populate('universityID', 'name universityCode');

    if (certificate) {
      // Check if the hash matches (in real implementation, this would compare actual file hashes)
      if (certificate.blockchainHash === fileHash) {
        verificationStatus = 'verified';
        ocrConfidence = 95; // High confidence for exact match
      } else {
        // Check for potential tampering
        verificationStatus = 'suspicious';
        suspiciousFlags.push('data_mismatch');
        ocrConfidence = 60;
      }

      // Update certificate verification count
      certificate.verificationCount += 1;
      certificate.lastVerified = new Date();
      await certificate.save();
    }

    // Create verification log
    const verificationLog = new VerificationLog({
      agencyId,
      agencyName: req.user.name,
      certificateId: certificate ? certificate.certificateNumber : 'N/A',
      studentName,
      rollNumber,
      universityName: certificate ? certificate.universityName : 'Unknown',
      universityId: certificate ? certificate.universityID._id : null,
      verificationStatus,
      verificationMethod,
      ocrConfidence,
      blockchainHash: certificate ? certificate.blockchainHash : null,
      blockchainTransactionId: certificate ? certificate.blockchainTransactionId : null,
      issuedYear: certificate ? certificate.graduationYear : null,
      uploadDate: certificate ? certificate.uploadTimestamp : null,
      suspiciousFlags,
      ipAddress,
      userAgent
    });

    await verificationLog.save();

    // Update agency verification count
    req.user.verificationCount += 1;
    req.user.lastVerification = new Date();
    await req.user.save();

    res.json({
      success: true,
      message: 'Verification completed',
      data: {
        verificationStatus,
        certificate: certificate ? {
          studentName: certificate.studentName,
          rollNumber: certificate.rollNumber,
          certificateNumber: certificate.certificateNumber,
          course: certificate.course,
          universityName: certificate.universityName,
          universityCode: certificate.universityID?.universityCode,
          graduationYear: certificate.graduationYear,
          marks: certificate.marks,
          issueDate: certificate.issueDate,
          blockchainHash: certificate.blockchainHash,
          uploadDate: certificate.uploadTimestamp
        } : null,
        verificationDetails: {
          method: verificationMethod,
          confidence: ocrConfidence,
          suspiciousFlags,
          verificationDate: verificationLog.verificationDate
        }
      }
    });

  } catch (error) {
    console.error('Certificate verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

// @route   GET /api/agency/verification-history
// @desc    Get agency verification history
// @access  Private (Agency)
router.get('/verification-history', auth, requireAgency, async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    const agencyId = req.user._id;

    const query = { agencyId };
    if (status) query.verificationStatus = status;

    const verifications = await VerificationLog.find(query)
      .populate('universityId', 'name universityCode')
      .sort({ verificationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await VerificationLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        verifications,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get verification history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching verification history'
    });
  }
});

// @route   GET /api/agency/profile
// @desc    Get agency profile
// @access  Private (Agency)
router.get('/profile', auth, requireAgency, async (req, res) => {
  try {
    const agency = await Agency.findById(req.user._id).select('-password');
    
    res.json({
      success: true,
      data: agency
    });

  } catch (error) {
    console.error('Get agency profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching profile'
    });
  }
});

// @route   PUT /api/agency/profile
// @desc    Update agency profile
// @access  Private (Agency)
router.put('/profile', auth, requireAgency, async (req, res) => {
  try {
    const { name, organization, contactNumber, address, website } = req.body;
    
    const agency = await Agency.findById(req.user._id);
    
    if (name) agency.name = name;
    if (organization) agency.organization = organization;
    if (contactNumber) agency.contactNumber = contactNumber;
    if (address) agency.address = address;
    if (website) agency.website = website;

    await agency.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: agency._id,
        name: agency.name,
        email: agency.email,
        organization: agency.organization,
        contactNumber: agency.contactNumber,
        address: agency.address,
        website: agency.website
      }
    });

  } catch (error) {
    console.error('Update agency profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error updating profile'
    });
  }
});

module.exports = router;

