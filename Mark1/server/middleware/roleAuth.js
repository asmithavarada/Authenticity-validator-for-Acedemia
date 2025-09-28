const jwt = require('jsonwebtoken');
const config = require('../config');
const Admin = require('../models/Admin');
const University = require('../models/University');
const Agency = require('../models/Agency');

// Generic authentication middleware
const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No token provided, authorization denied' 
      });
    }

    const decoded = jwt.verify(token, config.JWT_SECRET);
    
    // Find user based on role
    let user = null;
    switch (decoded.role) {
      case 'admin':
        user = await Admin.findById(decoded.id);
        break;
      case 'university':
        user = await University.findById(decoded.id);
        break;
      case 'agency':
        user = await Agency.findById(decoded.id);
        break;
      default:
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid token role' 
        });
    }
    
    const requiresActive = decoded.role !== 'university';
    if (!user || (requiresActive && !user.isActive)) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is not valid or user is inactive' 
      });
    }

    req.user = user;
    req.userRole = decoded.role;
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Token is not valid' 
    });
  }
};

// Role-based authorization middleware
const requireRole = (...roles) => {
  return (req, res, next) => {
    if (!req.userRole || !roles.includes(req.userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    }
    next();
  };
};

// Admin-specific middleware
const requireAdmin = (req, res, next) => {
  if (req.userRole !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Admin privileges required.'
    });
  }
  next();
};

// University-specific middleware
const requireUniversity = (req, res, next) => {
  if (req.userRole !== 'university') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. University privileges required.'
    });
  }
  
  // Check if university is approved
  if (req.user.approvalStatus !== 'approved') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. University not approved by admin.'
    });
  }
  next();
};

// Agency-specific middleware
const requireAgency = (req, res, next) => {
  if (req.userRole !== 'agency') {
    return res.status(403).json({
      success: false,
      message: 'Access denied. Agency privileges required.'
    });
  }
  next();
};

module.exports = {
  auth,
  requireRole,
  requireAdmin,
  requireUniversity,
  requireAgency
};

