const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');
const { auth: roleAuth, requireUniversity } = require('../middleware/roleAuth');
const upload = require('../middleware/upload');
const { computeContentHash } = require('../utils/hash');
const Certificate = require('../models/Certificate');
const University = require('../models/University');

const router = express.Router();

// map req.user (roleAuth) to req.university for backward compatibility
const attachUniversity = (req, res, next) => {
  if (req.user) req.university = req.user;
  next();
};

// @route   POST /api/certificates/upload
// @desc    Upload certificates via CSV
// @access  Private (University only)
router.post('/upload', roleAuth, requireUniversity, attachUniversity, upload.single('csvFile'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No CSV file uploaded'
      });
    }

    const certificates = [];
    const errors = [];

    // Read CSV file
    fs.createReadStream(req.file.path)
      .pipe(csv())
      .on('data', (row) => {
        certificates.push({
          studentName: row.studentName || row['Student Name'],
          rollNumber: row.rollNumber || row['Roll Number'],
          course: row.course || row['Course'],
          graduationYear: parseInt(row.graduationYear || row['Graduation Year']),
          marks: row.marks || row['Marks'],
          certificateNumber: row.certificateNumber || row['Certificate Number'],
          issueDate: new Date(row.issueDate || row['Issue Date']),
          universityID: req.university._id,
          universityName: req.university.name,
          universityCode: req.university.universityCode
        });
      })
      .on('end', async () => {
        try {
          let successCount = 0;
          let errorCount = 0;

          // Process each certificate
          for (const certData of certificates) {
            try {
              // Check if certificate already exists
              const existingCert = await Certificate.findOne({ certificateNumber: certData.certificateNumber });

              if (existingCert) {
                errors.push(`Certificate ${certData.certificateNumber} already exists`);
                errorCount++;
                continue;
              }

              // Create new certificate
              const created = new Certificate({
                ...certData,
                blockchainHash: computeContentHash(certData),
                onChain: false
              });
              await created.save();
              successCount++;

            } catch (error) {
              errors.push(`Error processing ${certData.certificateNumber}: ${error.message}`);
              errorCount++;
            }
          }

          // Update university certificate count
          await University.findByIdAndUpdate(req.university._id, {
            $inc: { certificatesCount: successCount }
          });

          // Clean up uploaded file
          fs.unlinkSync(req.file.path);

          res.json({
            success: true,
            message: 'CSV processing completed',
            summary: {
              total: certificates.length,
              successful: successCount,
              errors: errorCount
            },
            errors: errors.slice(0, 10) // Limit error messages
          });

        } catch (error) {
          console.error('CSV processing error:', error);
          res.status(500).json({
            success: false,
            message: 'Error processing CSV file'
          });
        }
      })
      .on('error', (error) => {
        console.error('CSV read error:', error);
        res.status(500).json({
          success: false,
          message: 'Error reading CSV file'
        });
      });

  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during upload'
    });
  }
});

// @route   POST /api/certificates/upload-pdfs
// @desc    Upload multiple certificate PDFs; create entries and hash each file
// @access  Private (University)
router.post('/upload-pdfs', roleAuth, requireUniversity, attachUniversity, upload.array('certificateFiles', 50), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    const created = [];
    const errors = [];
    for (const f of req.files) {
      try {
        // Use file content hash as blockchainHash basis
        const content = fs.readFileSync(f.path);
        const digest = require('crypto').createHash('sha256').update(content).digest('hex');
        const blockchainHash = '0x' + digest;

        // Derive a simple certificateNumber if not from CSV (filename based)
        const certificateNumber = `PDF-${Date.now()}-${Math.floor(Math.random()*1e6)}`;

        const certDoc = new Certificate({
          studentName: 'Unknown',
          rollNumber: certificateNumber,
          course: 'Unknown',
          graduationYear: new Date().getFullYear(),
          marks: '-',
          certificateNumber,
          issueDate: new Date(),
          universityID: req.university._id,
          universityName: req.university.name,
          blockchainHash,
          status: 'active'
        });
        await certDoc.save();
        created.push({ id: certDoc._id, certificateNumber, blockchainHash, filename: f.originalname });
      } catch (e) {
        errors.push(`${f.originalname}: ${e.message}`);
      } finally {
        try { fs.unlinkSync(f.path); } catch {}
      }
    }

    return res.json({ success: true, createdCount: created.length, errorsCount: errors.length, created, errors });
  } catch (error) {
    console.error('Upload PDFs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to process PDFs' });
  }
});

// @route   POST /api/certificates/seed-samples
// @desc    Seed sample certificates for the logged-in university
// @access  Private
router.post('/seed-samples', roleAuth, requireUniversity, attachUniversity, async (req, res) => {
  try {
    // If university already has certificates, don't duplicate unless forced
    const existingCount = await Certificate.countDocuments({ universityID: req.university._id });
    if (existingCount > 0) {
      return res.json({ success: true, message: 'Certificates already exist. Skipping seed.', added: 0 });
    }

    const baseDate = new Date('2023-06-15');
    const samples = [
      {
        studentName: 'John Doe',
        rollNumber: `CS${new Date().getFullYear()}001`,
        course: 'Computer Science',
        graduationYear: 2023,
        marks: '85%',
        certificateNumber: `CERT-${Date.now()}-001`,
        issueDate: baseDate,
        universityID: req.university._id,
        universityName: req.university.name,
        blockchainHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3'
      },
      {
        studentName: 'Jane Smith',
        rollNumber: `CS${new Date().getFullYear()}002`,
        course: 'Computer Science',
        graduationYear: 2023,
        marks: '92%',
        certificateNumber: `CERT-${Date.now()}-002`,
        issueDate: baseDate,
        universityID: req.university._id,
        universityName: req.university.name,
        blockchainHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4'
      },
      {
        studentName: 'Mike Johnson',
        rollNumber: `EE${new Date().getFullYear()}001`,
        course: 'Electrical Engineering',
        graduationYear: 2023,
        marks: '78%',
        certificateNumber: `CERT-${Date.now()}-003`,
        issueDate: baseDate,
        universityID: req.university._id,
        universityName: req.university.name,
        blockchainHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5'
      }
    ];

    let added = 0;
    for (const s of samples) {
      const doc = new Certificate(s);
      await doc.save();
      added++;
    }

    await University.findByIdAndUpdate(req.university._id, { $inc: { certificatesCount: added } });

    return res.json({ success: true, message: 'Sample certificates added', added });
  } catch (error) {
    console.error('Seed samples error:', error);
    return res.status(500).json({ success: false, message: 'Failed to seed samples' });
  }
});

// @route   GET /api/certificates/university
// @desc    Get certificates for logged-in university
// @access  Private
router.get('/university', roleAuth, requireUniversity, attachUniversity, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const [certificates, total] = await Promise.all([
      Certificate.find({ universityID: req.university._id })
        .sort({ uploadTimestamp: -1 })
        .limit(limit)
        .skip((page - 1) * limit),
      Certificate.countDocuments({ universityID: req.university._id })
    ]);

    res.json({
      success: true,
      certificates,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });

  } catch (error) {
    console.error('Get certificates error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// @route   GET /api/certificates/search/:rollNumber
// @desc    Search certificate by roll number
// @access  Public
router.get('/search/:rollNumber', async (req, res) => {
  try {
    const { rollNumber } = req.params;

    const certificate = await Certificate.findOne({ rollNumber });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found'
      });
    }

    res.json({
      success: true,
      certificate: {
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
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

module.exports = router;
