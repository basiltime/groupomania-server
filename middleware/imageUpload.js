const multer = require('multer');
const aws = require('aws-sdk');
const multerS3 = require('multer-s3');
const dotenv = require('dotenv').config({ path: '../.env' });

const MIME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif'
}
const s3 = new aws.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: "us-east-2",
});

const upload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'groupomania-images',
      metadata: (req, file, callback) => {
        callback(null, {fieldName: file.fieldname});
      },
      key: function (req, file, callback) {
        const extension = MIME_TYPES[file.mimetype];
        callback(null, Date.now() + '.' + extension);
    }
})
})




module.exports = upload.single('image');