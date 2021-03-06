const util = require('util');
const multer = require('multer');
const config = require('../../config');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `${config.baseDir}/uploads/`);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const uploadFile = multer({
  storage,
}).single('file');

const uploadFileMiddleware = util.promisify(uploadFile);
module.exports = uploadFileMiddleware;
