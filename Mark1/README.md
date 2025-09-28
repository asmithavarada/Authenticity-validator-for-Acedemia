# CertVerify - Certificate Verification System

A secure, blockchain-powered certificate verification system that helps institutions and employers verify academic credentials instantly and reliably.

## 🚀 Features

### Core Features
- **Blockchain Security**: Certificates are secured using blockchain technology ensuring tamper-proof verification
- **Instant Verification**: Verify certificates in seconds using advanced OCR technology and automated matching
- **Bulk Upload**: Universities can upload certificates in bulk via CSV files
- **OCR Processing**: Automatic text extraction from certificate images and PDFs
- **Real-time Analytics**: Track verification statistics and certificate management
- **Secure Authentication**: JWT-based authentication for university portals

### Technical Features
- **Modern Tech Stack**: React.js frontend with Node.js/Express backend
- **Database**: MongoDB for flexible data storage
- **Security**: Helmet.js, rate limiting, CORS protection
- **File Processing**: Multer for file uploads, Tesseract.js for OCR
- **Responsive Design**: Beautiful UI/UX with Tailwind CSS and Framer Motion

## 📋 System Workflow

### Simple Workflow Description

1. **University Registration**: Universities register and get access to their portal
2. **Certificate Upload**: Universities upload student certificates in bulk via CSV
3. **Blockchain Storage**: Certificates are stored with unique blockchain hashes
4. **Public Verification**: Anyone can verify certificates by uploading images/PDFs
5. **OCR Processing**: System extracts data using AI-powered OCR
6. **Instant Results**: Users get immediate verification results with certificate details

### Modules Involved

#### Backend Modules
- **Authentication Module**: University registration, login, JWT management
- **Certificate Management**: CRUD operations for certificates, bulk upload
- **OCR Processing**: Text extraction from images and PDFs
- **Verification Engine**: Certificate matching and validation
- **Blockchain Integration**: Hash generation and verification
- **Analytics Module**: Statistics and reporting
- **Security Module**: Rate limiting, validation, error handling

#### Frontend Modules
- **Public Portal**: Certificate verification interface
- **University Portal**: Dashboard, certificate management, analytics
- **Authentication**: Login/register forms with validation
- **File Upload**: Drag-and-drop CSV and certificate upload
- **Results Display**: Verification results with detailed information
- **Responsive UI**: Mobile-friendly design with animations

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start MongoDB** (if running locally):
   ```bash
   mongod
   ```

4. **Start the server**:
   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm start
   ```

   The client will run on `http://localhost:3000`

## 📁 Project Structure

```
SIH/
├── server/                 # Backend Node.js application
│   ├── models/            # MongoDB models
│   │   ├── University.js
│   │   ├── Certificate.js
│   │   ├── User.js
│   │   └── VerificationLog.js
│   ├── routes/            # API routes
│   │   ├── auth.js
│   │   ├── certificates.js
│   │   └── verify.js
│   ├── middleware/         # Custom middleware
│   │   ├── auth.js
│   │   └── upload.js
│   ├── utils/             # Utility functions
│   │   └── ocr.js
│   ├── config.js          # Configuration
│   ├── server.js          # Main server file
│   └── package.json
├── client/                # Frontend React application
│   ├── src/
│   │   ├── components/   # Reusable components
│   │   ├── pages/        # Page components
│   │   ├── services/     # API services
│   │   ├── utils/       # Utility functions
│   │   ├── App.js       # Main app component
│   │   └── index.js     # Entry point
│   ├── public/          # Static files
│   └── package.json
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/university/register` - Register new university
- `POST /api/auth/university/login` - University login
- `GET /api/auth/university/profile` - Get university profile

### Certificates
- `POST /api/certificates/upload` - Upload certificates via CSV
- `GET /api/certificates/university` - Get university certificates
- `GET /api/certificates/search/:rollNumber` - Search certificate

### Verification
- `POST /api/verify/ocr` - Verify certificate using OCR
- `POST /api/verify/manual` - Manual verification
- `GET /api/verify/stats` - Get verification statistics

## 🎨 UI/UX Features

### Design Principles
- **Modern & Clean**: Minimalist design with focus on usability
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: WCAG compliant with proper contrast and navigation
- **Fast**: Optimized performance with lazy loading and caching

### Key UI Components
- **Hero Section**: Eye-catching landing page with clear value proposition
- **Verification Interface**: Intuitive drag-and-drop file upload
- **Dashboard**: Comprehensive analytics and management tools
- **Results Display**: Clear verification results with detailed information
- **Navigation**: Smooth navigation with breadcrumbs and search

### Color Scheme
- **Primary**: Blue (#3b82f6) - Trust and security
- **Secondary**: Green (#22c55e) - Success and verification
- **Accent**: Red (#ef4444) - Alerts and errors
- **Neutral**: Gray scale for text and backgrounds

## 🔒 Security Features

### Data Protection
- **Encryption**: All sensitive data encrypted at rest and in transit
- **Authentication**: JWT-based secure authentication
- **Authorization**: Role-based access control
- **Rate Limiting**: Protection against brute force attacks

### Blockchain Security
- **Hash Generation**: SHA-256 hashes for each certificate
- **Tamper Detection**: Immutable blockchain records
- **Verification**: Cryptographic proof of authenticity

### Privacy
- **Data Minimization**: Only necessary data is collected
- **Secure Storage**: Files are processed and deleted securely
- **Access Control**: Strict access controls and audit logs

## 📊 Demo Workflow

### For SIH Demo

1. **Show University Portal**:
   - Register a new university
   - Login to the dashboard
   - Show the clean, professional interface

2. **Upload Sample Data**:
   - Download CSV template
   - Upload 5-10 sample student records
   - Show successful upload confirmation

3. **Public Verification**:
   - Go to the public verification page
   - Upload a certificate image that matches uploaded data
   - Show instant "✅ Verified" result with certificate details

4. **Fraud Detection**:
   - Upload a different certificate image
   - Show "❌ Not Found" result
   - Demonstrate fraud detection capability

## 🚀 Deployment

### Frontend (Vercel)
1. Connect your GitHub repository to Vercel
2. Set build command: `npm run build`
3. Set output directory: `build`
4. Deploy automatically on push

### Backend (Render/Heroku)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add MongoDB connection string to environment variables

### Environment Variables
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/certificate_verification
JWT_SECRET=your_super_secret_jwt_key_here
NODE_ENV=production
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📞 Support

For support and questions:
- Email: support@certverify.com
- Phone: +91 98765 43210
- Documentation: [Link to docs]

## 🎯 Future Enhancements

- **Mobile App**: Native iOS and Android applications
- **AI Enhancement**: Improved OCR accuracy with machine learning
- **Integration**: APIs for third-party systems
- **Analytics**: Advanced reporting and insights
- **Multi-language**: Support for multiple languages
- **QR Codes**: QR code generation for certificates

---

**Built with ❤️ for SIH 2024**
