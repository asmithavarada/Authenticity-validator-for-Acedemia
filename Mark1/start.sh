#!/bin/bash

echo "🚀 Starting CertVerify Certificate Verification System"
echo "=================================================="

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js first."
    exit 1
fi

# Check if MongoDB is running
if ! pgrep -x "mongod" > /dev/null; then
    echo "⚠️  MongoDB is not running. Please start MongoDB first."
    echo "   You can start it with: mongod"
    echo "   Or use MongoDB Atlas for cloud database"
fi

# Install server dependencies
echo "📦 Installing server dependencies..."
cd server
npm install

# Install client dependencies
echo "📦 Installing client dependencies..."
cd ../client
npm install

# Go back to root directory
cd ..

echo ""
echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start MongoDB (if not already running): mongod"
echo "2. Start the server: cd server && npm run dev"
echo "3. Start the client: cd client && npm start"
echo ""
echo "The application will be available at:"
echo "  Frontend: http://localhost:3000"
echo "  Backend:  http://localhost:5000"
echo ""
echo "📋 Sample CSV file is available at: sample_certificates.csv"
echo "📖 Documentation: README.md"
echo ""
echo "🎯 For SIH Demo:"
echo "1. Register a university"
echo "2. Upload the sample CSV file"
echo "3. Go to public verification page"
echo "4. Upload a certificate image to test verification"
echo ""
echo "Good luck with your SIH presentation! 🎉"
