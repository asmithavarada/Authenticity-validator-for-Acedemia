const crypto = require('crypto');

const normalizeCertificate = (c) => {
  return {
    studentName: (c.studentName || '').trim(),
    rollNumber: (c.rollNumber || '').trim().toUpperCase(),
    course: (c.course || '').trim(),
    graduationYear: Number(c.graduationYear) || 0,
    marks: (c.marks || '').toString().trim(),
    certificateNumber: (c.certificateNumber || '').trim(),
    universityID: (c.universityID || '').toString(),
    universityName: (c.universityName || '').trim(),
    universityCode: (c.universityCode || '').trim(),
    issueDate: c.issueDate ? new Date(c.issueDate).toISOString().slice(0, 10) : ''
  };
};

const computeContentHash = (c) => {
  const normalized = normalizeCertificate(c);
  const json = JSON.stringify(normalized);
  const digest = crypto.createHash('sha256').update(json).digest('hex');
  return '0x' + digest;
};

module.exports = {
  normalizeCertificate,
  computeContentHash,
};





