const formatSuccess = (status, message, data = {}) => ({
    success: true,
    status,
    message,
    data
});

const formatError = (status, message, code) => ({
    success: false,
    status,
    message,
    error: { code }
});

module.exports = { formatSuccess, formatError };