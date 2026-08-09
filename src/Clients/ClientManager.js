const ClientStore = require('./ClientStore');
const KeyManager = require('./KeyManager');
const UsageTracker = require('./UsageTracker');

const createClient = (id, limits = {}, expiresAt = null) => {
    const apiKey = KeyManager.generateKey();
    
    const newClient = {
        id,
        apiKey,
        status: 'active',
        createdAt: Date.now(),
        expiresAt,
        requests: 0,
        limits: {
            maxRequests: limits.maxRequests || Infinity,
            ...limits
        }
    };

    ClientStore.saveClient(newClient);
    return newClient;
};

const authenticate = (apiKey) => {
    if (!KeyManager.isValidFormat(apiKey)) {
        return { success: false, reason: 'INVALID_FORMAT' };
    }

    const client = ClientStore.getClient(apiKey);

    if (!client) {
        return { success: false, reason: 'NOT_FOUND' };
    }

    if (client.status !== 'active') {
        return { success: false, reason: 'INACTIVE' };
    }

    if (!UsageTracker.checkLimit(apiKey)) {
        return { success: false, reason: 'LIMIT_EXCEEDED' };
    }

    UsageTracker.registerUsage(apiKey);

    return { success: true, client };
};

module.exports = { createClient, authenticate };