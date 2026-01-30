const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { getConfig } = require('../config/services');

const servicesConfig = getConfig();
const uploadsRoot = path.join(__dirname, '..', 'uploads');
const complaintsUploadPath = path.join(uploadsRoot, 'complaints');
const verificationsUploadPath = path.join(uploadsRoot, 'verifications');

// Ensure upload directories exist
fs.mkdirSync(complaintsUploadPath, { recursive: true });
fs.mkdirSync(verificationsUploadPath, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, complaintsUploadPath),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const fileFilter = (_req, file, cb) => {
  const allowed = servicesConfig.gemini.supportedFormats || [];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: servicesConfig.gemini.maxImageSize || 10 * 1024 * 1024
  }
});

// Storage for verification images
const verificationStorage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, verificationsUploadPath),
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    const safeName = file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.\-_]/g, '');
    cb(null, `${timestamp}-${safeName}`);
  }
});

const verificationUpload = multer({
  storage: verificationStorage,
  fileFilter,
  limits: {
    fileSize: servicesConfig.gemini.maxImageSize || 10 * 1024 * 1024
  }
});

module.exports = {
  upload,
  verificationUpload,
  complaintsUploadPath,
  verificationsUploadPath
};

