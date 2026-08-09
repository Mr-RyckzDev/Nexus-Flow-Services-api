class ConcurrencyManager {
    constructor(limit) {
        this.limit = limit;
        this.active = 0;
        this.queue = [];
    }

    async acquire() {
        if (this.active < this.limit) {
            this.active++;
            return Promise.resolve();
        }
        return new Promise(resolve => this.queue.push(resolve));
    }

    release() {
        if (this.queue.length > 0) {
            const next = this.queue.shift();
            next();
        } else {
            this.active--;
        }
    }
}

module.exports = ConcurrencyManager;