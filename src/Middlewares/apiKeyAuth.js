const AppError = require('../Errors/AppError');
const HttpStatus = require('../Errors/HttpStatus');
const ErrorCodes = require('../Errors/ErrorCodes');
const ClientManager = require('../Clients/ClientManager');

module.exports = (req, res, next) => {
    const apiKey = req.header('x-api-key');

    if (!apiKey) {
        return next(new AppError('API Key ausente', HttpStatus.UNAUTHORIZED, ErrorCodes.UNAUTHORIZED));
    }

    const authResult = ClientManager.authenticate(apiKey);

    if (!authResult.success) {
        let status = HttpStatus.FORBIDDEN;
        let code = ErrorCodes.FORBIDDEN;
        let message = 'API Key inválida ou sem permissão';

        if (authResult.reason === 'LIMIT_EXCEEDED') {
            status = HttpStatus.TOO_MANY_REQUESTS;
            code = ErrorCodes.RATE_LIMIT;
            message = 'Limite da conta excedido ou chave expirada';
        }

        return next(new AppError(message, status, code));
    }

    req.client = authResult.client;
    next();
};