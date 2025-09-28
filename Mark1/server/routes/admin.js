const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const path = require('path');
const fs = require('fs');
const config = require('../config');
const { auth, requireAdmin } = require('../middleware/roleAuth');
const Admin = require('../models/Admin');
const University = require('../models/University');
const Agency = require('../models/Agency');
const VerificationLog = require('../models/VerificationLog');
const Certificate = require('../models/Certificate');

const router = express.Router();

// @route   POST /api/admin/login
// @desc    Admin login
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find admin by email
    const admin = await Admin.findOne({ email, isActive: true });
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Update last login
    admin.lastLogin = new Date();
    await admin.save();

    // Generate JWT token
    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      config.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      admin: {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        permissions: admin.permissions
      }
    });

  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
});

// @route   GET /api/admin/dashboard
// @desc    Get admin dashboard data
// @access  Private (Admin)
router.get('/dashboard', auth, requireAdmin, async (req, res) => {
  try {
    // Get pending university approvals
    const pendingUniversities = await University.find({ approvalStatus: 'pending' })
      .select('name officialEmail universityCode contactNumber universityType accreditationNumber letterheadPdf createdAt')
      .sort({ createdAt: -1 });

    // Get totals and aggregates
    const [
      totalUniversities,
      approvedUniversities,
      totalAgencies,
      totalCertificates,
      totalVerifications,
      certificatesPerUniversity,
      verificationsPerAgency
    ] = await Promise.all([
      University.countDocuments(),
      University.countDocuments({ approvalStatus: 'approved' }),
      Agency.countDocuments({ isActive: true }),
      Certificate.countDocuments(),
      VerificationLog.countDocuments(),
      Certificate.aggregate([
        { $group: { _id: '$universityID', count: { $sum: 1 } } }
      ]),
      VerificationLog.aggregate([
        { $match: { agencyId: { $exists: true, $ne: null } } },
        { $group: { _id: '$agencyId', count: { $sum: 1 } } }
      ])
    ]);

    // Get recent verification activity
    const recentVerifications = await VerificationLog.find()
      .populate('agencyId', 'name organization')
      .populate('certificateId', 'studentName rollNumber universityName')
      .sort({ verificationDate: -1 })
      .limit(10);

    // Get verification statistics
    const verificationStats = await VerificationLog.aggregate([
      { $group: { _id: '$verificationStatus', count: { $sum: 1 } } }
    ]);

    res.json({
      success: true,
      data: {
        pendingUniversities,
        statistics: {
          totalUniversities,
          approvedUniversities,
          totalAgencies,
          totalCertificates,
          totalVerifications,
          certificatesPerUniversity,
          verificationsPerAgency
        },
        recentVerifications,
        verificationStats
      }
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching dashboard data'
    });
  }
});

// @route   GET /api/admin/universities
// @desc    Get all universities with approval status
// @access  Private (Admin)
router.get('/universities', auth, requireAdmin, async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    
    const query = {};
    if (status) {
      query.approvalStatus = status;
    }

    const universities = await University.find(query)
      .populate('approvedBy', 'name email')
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await University.countDocuments(query);

    // Aggregate certificate counts per university
    const uniIds = universities.map(u => u._id);
    const [certCounts, verificationCounts] = await Promise.all([
      Certificate.aggregate([
        { $match: { universityID: { $in: uniIds } } },
        { $group: { _id: '$universityID', count: { $sum: 1 } } }
      ]),
      VerificationLog.aggregate([
        { $match: { universityId: { $in: uniIds } } },
        { $group: { _id: '$universityId', count: { $sum: 1 } } }
      ])
    ]);

    const certMap = new Map(certCounts.map(c => [String(c._id), c.count]));
    const verifMap = new Map(verificationCounts.map(c => [String(c._id), c.count]));

    const enriched = universities.map(u => ({
      id: u._id,
      name: u.name,
      officialEmail: u.officialEmail,
      contactNumber: u.contactNumber,
      address: u.address,
      universityType: u.universityType,
      accreditationNumber: u.accreditationNumber,
      approvalStatus: u.approvalStatus,
      flags: u.flags,
      certificates: certMap.get(String(u._id)) || 0,
      verifications: verifMap.get(String(u._id)) || 0,
      createdAt: u.createdAt
    }));

    res.json({
      success: true,
      data: {
        universities: enriched,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get universities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching universities'
    });
  }
});

// Detailed agencies listing with verification counts
router.get('/agencies/detailed', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const agencies = await Agency.find({ isActive: true })
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const counts = await VerificationLog.aggregate([
      { $match: { agencyId: { $exists: true, $ne: null } } },
      { $group: { _id: '$agencyId', count: { $sum: 1 }, verified: { $sum: { $cond: [{ $eq: ['$verificationStatus', 'verified'] }, 1, 0] } } } }
    ]);

    const map = new Map(counts.map(c => [String(c._id), c]));
    const enriched = agencies.map(a => {
      const c = map.get(String(a._id)) || { count: 0, verified: 0 };
      return {
        id: a._id,
        name: a.name,
        email: a.email,
        contactNumber: a.contactNumber,
        organization: a.organization,
        organizationType: a.organizationType,
        totalVerifications: c.count,
        verifiedCount: c.verified
      };
    });

    const total = await Agency.countDocuments({ isActive: true });

    res.json({ success: true, data: { agencies: enriched, pagination: { current: parseInt(page), pages: Math.ceil(total / limit), total } } });
  } catch (e) {
    console.error('Get detailed agencies error:', e);
    res.status(500).json({ success: false, message: 'Server error fetching agencies' });
  }
});

// Flag a university based on verification issues
router.post('/universities/:id/flag', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    const uni = await University.findById(id);
    if (!uni) return res.status(404).json({ success: false, message: 'University not found' });
    uni.flags = uni.flags || { totalFlags: 0, reasons: [] };
    uni.flags.totalFlags += 1;
    uni.flags.lastFlaggedAt = new Date();
    if (reason) uni.flags.reasons.push(reason);
    await uni.save();
    res.json({ success: true, message: 'University flagged', flags: uni.flags });
  } catch (e) {
    console.error('Flag university error:', e);
    res.status(500).json({ success: false, message: 'Server error flagging university' });
  }
});

// @route   GET /api/admin/universities/:id/letterhead
// @desc    View university letterhead PDF
// @access  Private (Admin)
router.get('/universities/:id/letterhead', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    if (!university.letterheadPdf || !university.letterheadPdf.path) {
      return res.status(404).json({
        success: false,
        message: 'Letterhead PDF not found'
      });
    }

    const filePath = path.join(__dirname, '..', university.letterheadPdf.path);
    
    // Check if file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Letterhead PDF file not found on server'
      });
    }

    // Set appropriate headers for PDF
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${university.letterheadPdf.filename}"`);
    
    // Stream the file
    const fileStream = fs.createReadStream(filePath);
    fileStream.pipe(res);

  } catch (error) {
    console.error('View letterhead error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error viewing letterhead'
    });
  }
});

// @route   PUT /api/admin/universities/:id/approve
// @desc    Approve or reject university
// @access  Private (Admin)
router.put('/universities/:id/approve', auth, requireAdmin, async (req, res) => {
  try {
    const { action, rejectionReason } = req.body;
    const { id } = req.params;

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be "approve" or "reject"'
      });
    }

    const university = await University.findById(id);
    if (!university) {
      return res.status(404).json({
        success: false,
        message: 'University not found'
      });
    }

    if (action === 'approve') {
      university.approvalStatus = 'approved';
      university.approvedBy = req.user._id;
      university.approvedAt = new Date();
      university.isVerified = true;
      university.rejectionReason = undefined;
    } else {
      university.approvalStatus = 'rejected';
      university.rejectionReason = rejectionReason || 'No reason provided';
    }

    await university.save();

    res.json({
      success: true,
      message: `University ${action}d successfully`,
      data: {
        id: university._id,
        name: university.name,
        approvalStatus: university.approvalStatus,
        approvedAt: university.approvedAt,
        rejectionReason: university.rejectionReason
      }
    });

  } catch (error) {
    console.error('University approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing approval'
    });
  }
});

// @route   GET /api/admin/agencies
// @desc    Get all agencies
// @access  Private (Admin)
router.get('/agencies', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const agencies = await Agency.find({ isActive: true })
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Agency.countDocuments({ isActive: true });

    res.json({
      success: true,
      data: {
        agencies,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get agencies error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching agencies'
    });
  }
});

// @route   GET /api/admin/verification-logs
// @desc    Get verification logs for audit
// @access  Private (Admin)
router.get('/verification-logs', auth, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      agencyId, 
      startDate, 
      endDate 
    } = req.query;

    const query = {};
    if (status) query.verificationStatus = status;
    if (agencyId) query.agencyId = agencyId;
    if (startDate || endDate) {
      query.verificationDate = {};
      if (startDate) query.verificationDate.$gte = new Date(startDate);
      if (endDate) query.verificationDate.$lte = new Date(endDate);
    }

    const logs = await VerificationLog.find(query)
      .populate('agencyId', 'name organization organizationType')
      .populate('universityId', 'name universityCode')
      .sort({ verificationDate: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await VerificationLog.countDocuments(query);

    res.json({
      success: true,
      data: {
        logs,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get verification logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching verification logs'
    });
  }
});

// @route   GET /api/admin/legacy-uploads
// @desc    Get pending legacy certificate uploads
// @access  Private (Admin)
router.get('/legacy-uploads', auth, requireAdmin, async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;

    const legacyUploads = await Certificate.find({ 
      isLegacyUpload: true,
      legacyApprovedBy: { $exists: false }
    })
      .populate('universityID', 'name universityCode')
      .sort({ uploadTimestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Certificate.countDocuments({ 
      isLegacyUpload: true,
      legacyApprovedBy: { $exists: false }
    });

    res.json({
      success: true,
      data: {
        legacyUploads,
        pagination: {
          current: parseInt(page),
          pages: Math.ceil(total / limit),
          total
        }
      }
    });

  } catch (error) {
    console.error('Get legacy uploads error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching legacy uploads'
    });
  }
});

// @route   PUT /api/admin/legacy-uploads/:id/approve
// @desc    Approve legacy certificate upload
// @access  Private (Admin)
router.put('/legacy-uploads/:id/approve', auth, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const certificate = await Certificate.findById(id);
    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    if (!certificate.isLegacyUpload) {
      return res.status(400).json({
        success: false,
        message: 'This is not a legacy upload'
      });
    }

    certificate.legacyApprovedBy = req.user._id;
    certificate.legacyApprovedAt = new Date();

    await certificate.save();

    res.json({
      success: true,
      message: 'Legacy certificate approved successfully',
      data: {
        id: certificate._id,
        certificateNumber: certificate.certificateNumber,
        studentName: certificate.studentName,
        approvedAt: certificate.legacyApprovedAt
      }
    });

  } catch (error) {
    console.error('Legacy approval error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error processing legacy approval'
    });
  }
});

module.exports = router;

