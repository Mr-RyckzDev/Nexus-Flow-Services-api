const rateLimit = require('express-rate-limit');
const Config = require('../Config');
const { formatError } = require('../Utils/responseFormatter');
const HttpStatus = require('../Errors/HttpStatus');
const ErrorCodes = require('../Errors/ErrorCodes');

const rateLimiter = rateLimit({
    windowMs: Config.security.rateLimitWindow,
    max: Config.security.rateLimitMax,
    handler: (req, res) => {
        res.status(HttpStatus.TOO_MANY_REQUESTS).json(
            formatError(
                HttpStatus.TOO_MANY_REQUESTS,
                'Limite de requisições excedido.',
                ErrorCodes.RATE_LIMIT
            )
        );
    }
});

module.exports = rateLimiter;