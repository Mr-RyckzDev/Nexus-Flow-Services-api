const AppError = require('../Errors/AppError');
const HttpStatus = require('../Errors/HttpStatus');
const ErrorCodes = require('../Errors/ErrorCodes');
const Config = require('../Config');

module.exports = (req, res, next) => {
    const timer = setTimeout(() => {
        if (!res.headersSent) {
            next(new AppError('Tempo limite de requisição excedido', HttpStatus.REQUEST_TIMEOUT, ErrorCodes.TIMEOUT));
        }
    }, Config.security.timeout);

    res.on('finish', () => clearTimeout(timer));
    
    next();
};