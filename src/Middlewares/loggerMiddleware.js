const logger = require('../Utils/logger');

module.exports = (req, res, next) => {
    const start = Date.now();

    logger.info(
        `${req.method} ${req.originalUrl}`,
        req.id
    );

    res.on('finish', () => {
        const duration = Date.now() - start;

        const message =
            `${req.method} ${req.originalUrl} → ${res.statusCode} (${duration}ms)`;

        if (res.statusCode >= 500) {
            logger.error(message, req.id);
        } else if (res.statusCode >= 400) {
            logger.warn(message, req.id);
        } else {
            logger.info(message, req.id);
        }
    });

    next();
};