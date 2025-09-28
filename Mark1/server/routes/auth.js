const express = require('express');
const jwt = require('jsonwebtoken');
const config = require('../config');
const { auth, requireUniversity } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');
const University = require('../models/University');

const router = express.Router();

// @route   POST /api/auth/university/register
// @desc    Register a new university
// @access  Public
router.post('/university/register', upload.single('letterheadPdf'), async (req, res) => {
  try {
    const { 
      email, 
      password, 
      universityName, 
      universityType, 
      contactNumber, 
      address, 
      website, 
      accreditationNumber 
    } = req.body;

    // Validation
    if (!email || !password || !universityName || !universityType || !contactNumber || !address || !accreditationNumber) {
      return res.status(400).json({
        success: false,
        message: 'All required fields must be provided'
      });
    }

    // Check if university already exists
    const existingUniversity = await University.findOne({ officialEmail: email });

    if (existingUniversity) {
      return res.status(400).json({
        success: false,
        message: 'University with this email already exists'
      });
    }

    // Generate university code from name
    const universityCode = universityName
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 8)
      .toUpperCase();

    // Check if university code already exists
    const existingCode = await University.findOne({ universityCode });
    if (existingCode) {
      return res.status(400).json({
        success: false,
        message: 'University code already exists. Please try again.'
      });
    }

    // Create new university
    const university = new University({
      name: universityName,
      address,
      officialEmail: email,
      password,
      universityCode,
      contactNumber,
      website,
      universityType,
      accreditationNumber,
      letterheadPdf: req.file ? {
        filename: req.file.filename,
        path: req.file.path,
        uploadedAt: new Date()
      } : null,
      approvalStatus: 'pending'
    });

    await university.save();

    res.status(201).json({
      success: true,
      message: 'University registered successfully. Your application is pending admin approval.',
      university: {
        id: university._id,
        name: university.name,
        officialEmail: university.officialEmail,
        universityCode: university.universityCode,
        approvalStatus: university.approvalStatus
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
});

// @route   POST /api/auth/university/login
// @desc    Login university
// @access  Public
router.post('/university/login', async (req, res) => {
  try {
    const { officialEmail, password } = req.body;

    // Find university by email
    const university = await University.findOne({ officialEmail });
    if (!university) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await university.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    university.lastLogin = new Date();
    await university.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: university._id, role: 'university' },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      university: {
        id: university._id,
        name: university.name,
        officialEmail: university.officialEmail,
        universityCode: university.universityCode,
        certificatesCount: university.certificatesCount,
        approvalStatus: university.approvalStatus,
        walletSetup: university.walletSetup
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/auth/university/profile
// @desc    Get university profile
// @access  Private
router.get('/university/profile', auth, requireUniversity, async (req, res) => {
  try {
    const university = await University.findById(req.user._id)
      .populate('approvedBy', 'name email')
      .select('-password');
    
    res.json({
      success: true,
      university
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
