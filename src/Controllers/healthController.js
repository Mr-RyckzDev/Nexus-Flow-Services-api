const { formatSuccess } = require('../Utils/responseFormatter');
const HttpStatus = require('../Errors/HttpStatus');

const check = (req, res) => {
    const data = {
        name: 'Nexus Flow Services',
        status: 'online',
        uptime: process.uptime(),
        environment: process.env.NODE_ENV
    };
    
    res.status(HttpStatus.OK).json(formatSuccess(HttpStatus.OK, 'API operacional.', data));
};

module.exports = { check };