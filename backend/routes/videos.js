const express = require('express');
const { uploadVideo, rewardUploader, fetchVideo } = require('../controllers/videos');

const router = express.Router();

router.post('/upload', uploadVideo);
router.post('/reward', rewardUploader);
router.get('/fetch', fetchVideo);

module.exports = router;