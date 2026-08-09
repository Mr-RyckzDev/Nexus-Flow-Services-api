const cache = new Map();

const set = (key, value, ttl = 3600000) => {
    const expiresAt = Date.now() + ttl;
    cache.set(key, { value, expiresAt });
};

const get = (key) => {
    const item = cache.get(key);
    
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
        cache.delete(key);
        return null;
    }
    
    return item.value;
};

const del = (key) => {
    cache.delete(key);
};

const cleanup = () => {
    const now = Date.now();
    for (const [key, item] of cache.entries()) {
        if (now > item.expiresAt) {
            cache.delete(key);
        }
    }
};

setInterval(cleanup, 600000);

module.exports = { set, get, del, cleanup };