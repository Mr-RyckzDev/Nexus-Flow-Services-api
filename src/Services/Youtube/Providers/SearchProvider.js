const ytSearch = require('yt-search');
const { YouTubeError } = require('../YouTubeErrors');

class SearchProvider {
    static async search(query, limit = 5) {
        try {
            const results = await ytSearch(query);
            const videos = results.videos.slice(0, limit);
            
            return videos.map(v => ({
                id: v.videoId,
                title: v.title,
                url: v.url,
                thumbnail: v.thumbnail,
                duration: v.timestamp,
                durationSeconds: v.seconds,
                channel: v.author.name,
                views: v.views
            }));
        } catch (error) {
            throw new YouTubeError('Search failed', 'SEARCH_FAILED');
        }
    }
}

module.exports = SearchProvider;