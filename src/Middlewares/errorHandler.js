const { formatError } = require('../Utils/responseFormatter');
const logger = require('../Utils/logger');
const HttpStatus = require('../Errors/HttpStatus');
const ErrorCodes = require('../Errors/ErrorCodes');

module.exports = (err, req, res, next) => {
    const status = err.statusCode || HttpStatus.INTERNAL_SERVER_ERROR;
    const message = err.message || 'Erro interno do servidor';
    const code = err.errorCode || ErrorCodes.INTERNAL_ERROR;

    if (status === HttpStatus.INTERNAL_SERVER_ERROR) {
        logger.error(err.stack, req.id);
    } else {
        logger.warn(`${message} - ${code}`, req.id);
    }

    res.status(status).json(formatError(status, message, code));
};