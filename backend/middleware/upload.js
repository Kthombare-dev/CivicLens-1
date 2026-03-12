const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { getConfig } = require('../config/services');

const servicesConfig = getConfig();

// Transitioned to Memory Storage for seamless Supabase buffer piping
const storage = multer.memoryStorage();

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

// We can reuse the same memory storage for verifications
const verificationUpload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: servicesConfig.gemini.maxImageSize || 10 * 1024 * 1024
  }
});

module.exports = {
  upload,
  verificationUpload
};

