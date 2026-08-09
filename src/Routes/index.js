const express = require('express');
const router = express.Router();
const healthRoutes = require('./healthRoutes');
const youtubeRoutes = require('./youtubeRoutes');

router.use('/health', healthRoutes);
router.use('/youtube', youtubeRoutes);

module.exports = router;