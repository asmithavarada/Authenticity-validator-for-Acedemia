const express = require('express');
const upload = require('../middleware/upload');
const ocrProcessor = require('../utils/ocr');
const path = require('path');
const fs = require('fs');
const Certificate = require('../models/Certificate');
const VerificationLog = require('../models/VerificationLog');

const router = express.Router();

// @route   POST /api/verify/ocr
// @desc    Verify certificate using OCR
// @access  Public
router.post('/ocr', upload.single('certificateFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No certificate file uploaded'
      });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();
    
    let extractedData;
    let confidence = 0;

    // Process file based on type
    if (fileExtension === '.pdf') {
      extractedData = await ocrProcessor.extractTextFromPDF(filePath);
    } else {
      extractedData = await ocrProcessor.extractTextFromImage(filePath);
    }

    confidence = ocrProcessor.calculateConfidence(extractedData);

    // Search for certificate in database
    let certificate = null;
    let verificationResult = 'not_found';

    if (extractedData.rollNumber) {
      certificate = await Certificate.findOne({ rollNumber: extractedData.rollNumber });
    }

    if (certificate) {
      verificationResult = 'verified';
      
      // Update verification count
      await Certificate.findByIdAndUpdate(certificate._id, {
        $inc: { verificationCount: 1 },
        lastVerified: new Date()
      });
    }

    // Log verification attempt
    await VerificationLog.create({
      certificateId: certificate ? certificate._id : undefined,
      rollNumber: extractedData.rollNumber || 'unknown',
      studentName: extractedData.studentName || 'unknown',
      universityName: certificate ? certificate.universityName : 'unknown',
      universityId: certificate ? certificate.universityID : undefined,
      verificationMethod: 'ocr',
      verificationStatus: verificationResult,
      ocrConfidence: confidence,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    // Clean up uploaded file
    fs.unlinkSync(filePath);

    // Prepare response
    const response = {
      success: true,
      verificationResult,
      confidence,
      extractedData,
      timestamp: new Date()
    };

    if (certificate) {
      response.certificate = {
        studentName: certificate.studentName,
        rollNumber: certificate.rollNumber,
        course: certificate.course,
        graduationYear: certificate.graduationYear,
        marks: certificate.marks,
        universityName: certificate.universityName,
        universityCode: certificate.universityCode,
        issueDate: certificate.issueDate,
        status: certificate.status,
        blockchainHash: certificate.blockchainHash,
        onChain: certificate.onChain,
        txHash: certificate.txHash
      };
    }

    res.json(response);

  } catch (error) {
    console.error('OCR verification error:', error);
    
    // Clean up file if it exists
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }

    res.status(500).json({
      success: false,
      message: 'Error processing certificate verification',
      error: error.message
    });
  }
});

// @route   POST /api/verify/manual
// @desc    Verify certificate manually by roll number
// @access  Public
router.post('/manual', async (req, res) => {
  try {
    const { rollNumber, studentName } = req.body;

    if (!rollNumber) {
      return res.status(400).json({
        success: false,
        message: 'Roll number is required'
      });
    }

    // Search for certificate
    const certificate = await Certificate.findOne({ rollNumber: rollNumber });

    let verificationResult = 'not_found';

    if (certificate) {
      verificationResult = 'verified';
      
      // Update verification count
      await Certificate.findByIdAndUpdate(certificate._id, {
        $inc: { verificationCount: 1 },
        lastVerified: new Date()
      });
    }

    // Log verification attempt
    await VerificationLog.create({
      certificateId: certificate ? certificate._id : undefined,
      rollNumber: rollNumber.toUpperCase(),
      studentName: studentName || 'unknown',
      universityName: certificate ? certificate.universityName : 'unknown',
      universityId: certificate ? certificate.universityID : undefined,
      verificationMethod: 'manual',
      verificationStatus: verificationResult,
      ocrConfidence: certificate ? 100 : 0,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });

    const response = {
      success: true,
      verificationResult,
      timestamp: new Date()
    };

    if (certificate) {
      response.certificate = {
        studentName: certificate.studentName,
        rollNumber: certificate.rollNumber,
        course: certificate.course,
        graduationYear: certificate.graduationYear,
        marks: certificate.marks,
        universityName: certificate.universityName,
        issueDate: certificate.issueDate,
        status: certificate.status,
        blockchainHash: certificate.blockchainHash
      };
    }

    res.json(response);

  } catch (error) {
    console.error('Manual verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during verification'
    });
  }
});

// @route   GET /api/verify/stats
// @desc    Get verification statistics
// @access  Public
router.get('/stats', async (req, res) => {
  try {
    const [totalVerifications, verifiedCountAgg, notFoundCountAgg, suspiciousCountAgg, totalCertificates, activeCertificates] = await Promise.all([
      VerificationLog.countDocuments(),
      VerificationLog.countDocuments({ verificationStatus: 'verified' }),
      VerificationLog.countDocuments({ verificationStatus: 'not_found' }),
      VerificationLog.countDocuments({ verificationStatus: 'suspicious' }),
      Certificate.countDocuments(),
      Certificate.countDocuments({ status: 'active' })
    ]);

    const verifiedCount = verifiedCountAgg;
    const notFoundCount = notFoundCountAgg;
    const suspiciousCount = suspiciousCountAgg;

    res.json({
      success: true,
      stats: {
        totalVerifications,
        verifiedCount,
        notFoundCount,
        suspiciousCount,
        totalCertificates,
        activeCertificates,
        verificationRate: totalVerifications > 0 ? Number(((verifiedCount / totalVerifications) * 100).toFixed(2)) : 0
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
