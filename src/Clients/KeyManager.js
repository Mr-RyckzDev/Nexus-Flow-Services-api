const crypto = require('crypto');

const generateKey = (prefix = 'nfs') => {
    const random = crypto.randomBytes(16).toString('hex');
    return `${prefix}-${random}`;
};

const isValidFormat = (key) => {
    return typeof key === 'string' && key.length > 5;
};

module.exports = { generateKey, isValidFormat };