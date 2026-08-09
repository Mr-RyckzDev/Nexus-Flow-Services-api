const logger = require('../Utils/logger');

module.exports = (req, res, next) => {
    logger.info(`${req.method} ${req.originalUrl}`, req.id);
    next();
};