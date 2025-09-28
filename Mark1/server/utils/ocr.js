const Tesseract = require('tesseract.js');
const pdfParse = require('pdf-parse');
const fs = require('fs');

class OCRProcessor {
  constructor() {
    this.tesseractOptions = {
      logger: m => console.log(m)
    };
  }

  async extractTextFromImage(imagePath) {
    try {
      const { data: { text } } = await Tesseract.recognize(
        imagePath,
        'eng',
        this.tesseractOptions
      );
      
      return this.parseCertificateData(text);
    } catch (error) {
      console.error('OCR Error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  async extractTextFromPDF(pdfPath) {
    try {
      const dataBuffer = fs.readFileSync(pdfPath);
      const data = await pdfParse(dataBuffer);
      
      return this.parseCertificateData(data.text);
    } catch (error) {
      console.error('PDF Parse Error:', error);
      throw new Error('Failed to extract text from PDF');
    }
  }

  parseCertificateData(text) {
    const extractedData = {
      studentName: null,
      rollNumber: null,
      certificateNumber: null,
      course: null,
      marks: null,
      year: null,
      university: null
    };

    // Common patterns for certificate data
    const patterns = {
      rollNumber: /(?:roll\s*no|registration\s*no|enrollment\s*no)[\s:]*([A-Z0-9\-]+)/i,
      studentName: /(?:name|student\s*name)[\s:]*([A-Za-z\s]+)/i,
      certificateNumber: /(?:certificate\s*no|cert\s*no)[\s:]*([A-Z0-9\-]+)/i,
      course: /(?:course|program|degree)[\s:]*([A-Za-z\s&]+)/i,
      marks: /(?:marks|grade|cgpa|percentage)[\s:]*([0-9\.]+(?:\s*%|\s*out\s*of\s*[0-9]+)?)/i,
      year: /(?:year|graduation\s*year)[\s:]*([0-9]{4})/i,
      university: /(?:university|institute|college)[\s:]*([A-Za-z\s&]+)/i
    };

    // Extract data using patterns
    Object.keys(patterns).forEach(key => {
      const match = text.match(patterns[key]);
      if (match) {
        extractedData[key] = match[1].trim();
      }
    });

    // Additional fallback patterns
    if (!extractedData.rollNumber) {
      const rollMatch = text.match(/([A-Z]{2,4}[0-9]{4,8})/);
      if (rollMatch) extractedData.rollNumber = rollMatch[1];
    }

    if (!extractedData.studentName) {
      const nameMatch = text.match(/([A-Z][a-z]+\s+[A-Z][a-z]+)/);
      if (nameMatch) extractedData.studentName = nameMatch[1];
    }

    return extractedData;
  }

  calculateConfidence(extractedData) {
    let confidence = 0;
    const fields = ['studentName', 'rollNumber', 'certificateNumber', 'course'];
    
    fields.forEach(field => {
      if (extractedData[field]) confidence += 25;
    });

    return Math.min(confidence, 100);
  }
}

module.exports = new OCRProcessor();
