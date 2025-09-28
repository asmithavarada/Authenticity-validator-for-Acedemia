# CertVerify - Modular Certificate Verification System

A comprehensive, blockchain-powered certificate verification system with separate modules for Admin, University, and Agency/Employer management.

## 🏗️ System Architecture

### 1️⃣ Admin Module
**Purpose**: System administration and oversight
- **Register & Approve Universities**: Universities apply → Admin verifies credentials → Approves/Rejects
- **Monitor Agencies**: Track which agencies/employers are using the platform for verification
- **Audit Dashboard**: Monitor total uploads, verification attempts, failed checks, suspicious activity
- **Manage Legacy Uploads**: Approve bulk upload of past certificates by universities

**Access**: `/admin/login`
**Default Credentials**: 
- Email: `admin@certverify.com`
- Password: `admin123`

### 2️⃣ University Module
**Purpose**: Certificate issuance and management
- **Registration & Wallet Setup**: After admin approval, university gets a verified wallet identity
- **Certificate Upload (New)**: Upload new student certificates → system generates hash per PDF → uploads to blockchain
- **Certificate Upload (Old/Legacy)**: Bulk import old certificates via CSV/ERP dump with OCR support
- **Dashboard**: Track uploaded certificates, blockchain confirmation status, verification logs

**Access**: `/university/login` or `/university/register`
**Approval Required**: Yes, by Admin

### 3️⃣ Agency/Employer Module
**Purpose**: Certificate verification and background checks
- **Verification Interface**: Upload certificate (PDF/scan) → Platform generates hash → checks blockchain record
- **OCR Processing**: Extract details using AI → compare with university database
- **Result Display**: Shows student name, roll number, cert ID, issued year, upload date, verification status
- **Verification Logs**: Track all verification activities for audit purposes

**Access**: `/agency/login` or `/agency/register`
**Approval Required**: No, self-registration

### 4️⃣ Blockchain Module
**Smart Contract Storage**:
- Certificate hash
- Certificate ID
- University wallet address (issuer identity)
- Issued year (from university DB)
- Upload timestamp (auto from blockchain)

**Features**: Immutable ledger → no tampering, permanent proof

### 5️⃣ OCR + AI Module
**Capabilities**:
- **OCR Extraction**: For scanned/legacy PDFs
- **AI Anomaly Detection**: Detect tampered seals, signatures, photo swaps
- **Format Validation**: Flag formatting inconsistencies
- **Cross-check**: Validate against university database

### 6️⃣ Database Module (MongoDB)
**Collections**:
- **Users**: Admin, University, Agency accounts
- **VerificationLogs**: Who verified what, when, results
- **Certificates**: Certificate data with blockchain mapping
- **Legacy Data**: Historical certificate information

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd SIH
```

2. **Install dependencies**
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

3. **Environment Setup**
```bash
# Create .env file in server directory
cd server
cp .env.example .env
# Edit .env with your MongoDB connection string and JWT secret
```

4. **Create default admin user**
```bash
cd server
npm run create-admin
```

5. **Start the application**
```bash
# Start server (from server directory)
npm run dev

# Start client (from client directory)
npm start
```

## 🔐 Authentication & Authorization

### Role-Based Access Control
- **Admin**: Full system access, university approvals, audit logs
- **University**: Certificate upload, student management (after approval)
- **Agency**: Certificate verification, verification history

### JWT Token System
- Tokens include user role for authorization
- 7-day expiration
- Role-based route protection

## 📊 Key Features

### Admin Features
- University approval workflow
- Agency monitoring
- Verification audit logs
- Legacy upload approval
- System statistics dashboard

### University Features
- Certificate upload (new & legacy)
- Student record management
- Blockchain integration
- Verification tracking
- Wallet setup (post-approval)

### Agency Features
- Certificate verification
- OCR processing
- Verification history
- Result reporting
- Suspicious activity flagging

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/university/register` - University registration
- `POST /api/auth/university/login` - University login
- `POST /api/admin/login` - Admin login
- `POST /api/agency/register` - Agency registration
- `POST /api/agency/login` - Agency login

### Admin Routes
- `GET /api/admin/dashboard` - Admin dashboard data
- `GET /api/admin/universities` - List universities
- `PUT /api/admin/universities/:id/approve` - Approve/reject university
- `GET /api/admin/agencies` - List agencies
- `GET /api/admin/verification-logs` - Audit logs
- `GET /api/admin/legacy-uploads` - Pending legacy uploads

### Agency Routes
- `GET /api/agency/dashboard` - Agency dashboard
- `POST /api/agency/verify` - Verify certificate
- `GET /api/agency/verification-history` - Verification history
- `GET /api/agency/profile` - Agency profile

### University Routes
- `GET /api/auth/university/profile` - University profile
- `POST /api/certificates/upload` - Upload certificates
- `GET /api/certificates/university` - University certificates

## 🎨 Frontend Structure

### Pages
- **HomePage**: Landing page with module navigation
- **AdminLogin/AdminDashboard**: Admin interface
- **UniversityLogin/UniversityDashboard**: University interface
- **AgencyLogin/AgencyRegister/AgencyDashboard**: Agency interface

### Components
- **Role-based Navbar**: Dynamic navigation based on user role
- **ProtectedRoute**: Route protection based on authentication and role
- **Authentication utilities**: Role-based auth management

## 🔒 Security Features

- **Password Hashing**: bcrypt with salt
- **JWT Authentication**: Secure token-based auth
- **Role-based Authorization**: Granular access control
- **Rate Limiting**: API protection
- **CORS Configuration**: Cross-origin security
- **Helmet.js**: Security headers

## 📈 Monitoring & Analytics

### Admin Dashboard Metrics
- Total universities (approved/pending)
- Total agencies
- Total certificates
- Total verifications
- Verification success rates
- Suspicious activity flags

### Agency Dashboard Metrics
- Total verifications performed
- Verification success rate
- Recent verification history
- Suspicious certificate flags

## 🚀 Deployment

### Production Setup
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Run admin creation script
4. Deploy server to your hosting platform
5. Deploy client to your frontend hosting

### Environment Variables
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certverify
JWT_SECRET=your-super-secret-jwt-key
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

---

**Note**: This system implements a comprehensive certificate verification platform with proper role separation, security measures, and audit capabilities. The modular design allows for easy maintenance and feature expansion.

