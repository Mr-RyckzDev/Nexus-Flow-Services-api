const express = require('express');
const router = express.Router();
const YouTubeController = require('../Controllers/youtubeController');
const asyncHandler = require('../Middlewares/asyncHandler');
const apiKeyAuth = require('../Middlewares/apiKeyAuth');

router.use(apiKeyAuth);

router.get('/search', asyncHandler(YouTubeController.search));
router.get('/info', asyncHandler(YouTubeController.info));
router.get('/audio', asyncHandler(YouTubeController.audio));
router.get('/video', asyncHandler(YouTubeController.video));

module.exports = router;