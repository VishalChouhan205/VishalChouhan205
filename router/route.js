const express = require('express');
const uploadController = require('../controller/upload');
const router = express.Router();
const multer = require('multer');
const path = require('path');

/* Multer Config */
const storage = multer.diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.post(
    '/uploads', upload.single('file'),
    uploadController.uploads,
  );

router.post(
    '/fetchUploadedFileByFileId/:fileId',
    uploadController.fetchUploadedFileByFileId,
);  

router.get(
    '/fetchAnalysisTaskByTaskId/:taskId',
    uploadController.fetchAnalysisTaskByTaskId,
);  
  
module.exports = router;
