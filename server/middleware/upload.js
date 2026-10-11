const multer = require('multer');

// Memory storage: we sniff the bytes before anything touches disk or the cloud.
module.exports = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024, files: 1 },
  fileFilter: (req, file, cb) => {
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.mimetype)) {
      return cb(Object.assign(new Error('Logo must be a PNG, JPG or WebP image.'), { code: 'BAD_FILE_TYPE' }));
    }
    cb(null, true);
  },
});
