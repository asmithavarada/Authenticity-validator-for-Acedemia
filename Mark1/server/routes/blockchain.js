const express = require('express');
const { auth, requireUniversity } = require('../middleware/roleAuth');
const Certificate = require('../models/Certificate');

const router = express.Router();

// Prepare unpublished certificates for on-chain publishing
router.get('/prepare', auth, requireUniversity, async (req, res) => {
  try {
    const certs = await Certificate.find({ universityID: req.user._id, onChain: { $ne: true } })
      .select('_id certificateNumber blockchainHash');
    const items = certs.map(c => ({ id: c._id, certificateNumber: c.certificateNumber, hash: c.blockchainHash }));
    res.json({ success: true, items });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to prepare items' });
  }
});

// Confirm on-chain publishing (called after wallet tx succeeds)
router.post('/confirm', auth, requireUniversity, async (req, res) => {
  try {
    const { txHash, blockNumber, items } = req.body;
    let updated = 0;
    for (const it of items || []) {
      const cert = await Certificate.findOne({ _id: it.id, universityID: req.user._id });
      if (cert && cert.blockchainHash === it.hash) {
        await Certificate.findByIdAndUpdate(cert._id, { onChain: true, txHash, blockNumber });
        updated++;
      }
    }
    res.json({ success: true, updated });
  } catch (e) {
    res.status(500).json({ success: false, message: 'Failed to confirm on-chain publish' });
  }
});

module.exports = router;





