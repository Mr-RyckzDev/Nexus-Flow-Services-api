const AppError = require('../../Errors/AppError');
const HttpStatus = require('../../Errors/HttpStatus');

class YouTubeError extends AppError {
    constructor(message, code, statusCode = HttpStatus.BAD_REQUEST) {
        super(message, statusCode, code);
    }
}

module.exports = { YouTubeError };