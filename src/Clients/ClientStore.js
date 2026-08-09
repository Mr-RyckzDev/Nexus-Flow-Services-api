const clients = new Map();

const saveClient = (client) => {
    clients.set(client.apiKey, client);
};

const getClient = (apiKey) => {
    return clients.get(apiKey);
};

const updateClient = (apiKey, data) => {
    if (clients.has(apiKey)) {
        const current = clients.get(apiKey);
        clients.set(apiKey, { ...current, ...data });
    }
};

module.exports = { saveClient, getClient, updateClient };