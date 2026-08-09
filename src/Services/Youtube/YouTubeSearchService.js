const SearchProvider = require('./Providers/SearchProvider');

class YouTubeSearchService {
    static async execute(query) {
        return await SearchProvider.search(query, 10);
    }
}

module.exports = YouTubeSearchService;