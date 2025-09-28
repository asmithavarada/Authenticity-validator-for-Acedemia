// Mock database for demo purposes
class MockDatabase {
  constructor() {
    this.universities = [];
    this.certificates = [];
    this.verificationLogs = [];
    this.users = [];
  }

  // University operations
  async createUniversity(data) {
    const university = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date(),
      certificatesCount: 0,
      isVerified: true
    };
    this.universities.push(university);
    return university;
  }

  async findUniversityByEmail(email) {
    return this.universities.find(u => u.officialEmail === email);
  }

  async findUniversityById(id) {
    return this.universities.find(u => u._id === id);
  }

  async updateUniversity(id, update) {
    const index = this.universities.findIndex(u => u._id === id);
    if (index !== -1) {
      this.universities[index] = { ...this.universities[index], ...update };
      return this.universities[index];
    }
    return null;
  }

  // Certificate operations
  async createCertificate(data) {
    const certificate = {
      _id: this.generateId(),
      ...data,
      createdAt: new Date(),
      verificationCount: 0,
      status: 'active'
    };
    this.certificates.push(certificate);
    return certificate;
  }

  async findCertificateByRollNumber(rollNumber) {
    return this.certificates.find(c => c.rollNumber === rollNumber.toUpperCase());
  }

  async findCertificatesByUniversity(universityId, page = 1, limit = 10) {
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const certificates = this.certificates.filter(c => c.universityID === universityId);
    
    return {
      certificates: certificates.slice(startIndex, endIndex),
      pagination: {
        current: page,
        pages: Math.ceil(certificates.length / limit),
        total: certificates.length
      }
    };
  }

  async updateCertificate(id, update) {
    const index = this.certificates.findIndex(c => c._id === id);
    if (index !== -1) {
      this.certificates[index] = { ...this.certificates[index], ...update };
      return this.certificates[index];
    }
    return null;
  }

  async countCertificates() {
    return this.certificates.length;
  }

  // Verification log operations
  async createVerificationLog(data) {
    const log = {
      _id: this.generateId(),
      ...data,
      timestamp: new Date()
    };
    this.verificationLogs.push(log);
    return log;
  }

  async countVerificationLogs() {
    return this.verificationLogs.length;
  }

  async countVerifiedLogs() {
    return this.verificationLogs.filter(l => l.verificationResult === 'verified').length;
  }

  async countNotFoundLogs() {
    return this.verificationLogs.filter(l => l.verificationResult === 'not_found').length;
  }

  async countSuspiciousLogs() {
    return this.verificationLogs.filter(l => l.verificationResult === 'suspicious').length;
  }

  // Utility methods
  generateId() {
    return Math.random().toString(36).substr(2, 9);
  }

  // Initialize with sample data
  async initializeSampleData() {
    // Create sample university with properly hashed password
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('demo123', 10);
    
    const university = await this.createUniversity({
      name: 'Demo University',
      address: '123 Education Street, Demo City',
      officialEmail: 'demo@university.edu',
      password: hashedPassword,
      universityCode: 'DEMO001',
      contactNumber: '+91 98765 43210'
    });

    // Create sample certificates
    const sampleCertificates = [
      {
        studentName: 'John Doe',
        rollNumber: 'CS2021001',
        course: 'Computer Science',
        graduationYear: 2023,
        marks: '85%',
        certificateNumber: 'CERT001',
        issueDate: new Date('2023-06-15'),
        universityID: university._id,
        universityName: university.name,
        blockchainHash: 'a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0'
      },
      {
        studentName: 'Jane Smith',
        rollNumber: 'CS2021002',
        course: 'Computer Science',
        graduationYear: 2023,
        marks: '92%',
        certificateNumber: 'CERT002',
        issueDate: new Date('2023-06-15'),
        universityID: university._id,
        universityName: university.name,
        blockchainHash: 'b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1'
      },
      {
        studentName: 'Mike Johnson',
        rollNumber: 'EE2021001',
        course: 'Electrical Engineering',
        graduationYear: 2023,
        marks: '78%',
        certificateNumber: 'CERT003',
        issueDate: new Date('2023-06-15'),
        universityID: university._id,
        universityName: university.name,
        blockchainHash: 'c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2'
      }
    ];

    for (const cert of sampleCertificates) {
      await this.createCertificate(cert);
    }

    // Update university certificate count
    await this.updateUniversity(university._id, { certificatesCount: sampleCertificates.length });

    console.log('✅ Sample data initialized successfully');
    return university;
  }
}

module.exports = new MockDatabase();
