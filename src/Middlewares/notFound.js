const AppError = require('../Errors/AppError');
const HttpStatus = require('../Errors/HttpStatus');
const ErrorCodes = require('../Errors/ErrorCodes');

module.exports = (req, res, next) => {
    next(new AppError('Rota não encontrada', HttpStatus.NOT_FOUND, ErrorCodes.NOT_FOUND));
};