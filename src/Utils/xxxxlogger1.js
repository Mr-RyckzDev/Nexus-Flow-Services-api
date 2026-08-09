const log = (level, message, context = '') => {
    const timestamp = new Date().toISOString();
    const contextString = context ? ` [${context}]` : '';
    console.log(`[${level}] ${timestamp}${contextString} - ${message}`);
};

const logger = {
    info: (msg, ctx) => log('INFO', msg, ctx),
    warn: (msg, ctx) => log('WARN', msg, ctx),
    error: (msg, ctx) => log('ERROR', msg, ctx),
    debug: (msg, ctx) => log('DEBUG', msg, ctx)
};

module.exports = logger;