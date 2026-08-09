const { Router } = require('express');
const healthController = require('../Controllers/healthController');
const asyncHandler = require('../Middlewares/asyncHandler');

const router = Router();

router.get('/', asyncHandler(healthController.check));

module.exports = router;