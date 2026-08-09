const ClientStore = require('./ClientStore');

const registerUsage = (apiKey) => {
    const client = ClientStore.getClient(apiKey);
    if (!client) return false;

    const requests = (client.requests || 0) + 1;

    ClientStore.updateClient(apiKey, {
        requests,
        lastRequestAt: Date.now()
    });

    return true;
};

const checkLimit = (apiKey) => {
    const client = ClientStore.getClient(apiKey);
    if (!client) return false;
    
    if (client.limits && client.requests >= client.limits.maxRequests) {
        return false;
    }

    if (client.expiresAt && Date.now() > client.expiresAt) {
        return false;
    }

    return true;
};

module.exports = { registerUsage, checkLimit };