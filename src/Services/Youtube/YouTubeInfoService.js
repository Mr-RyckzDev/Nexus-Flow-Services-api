const YouTubeValidator = require('./YouTubeValidator');
const YouTubeNormalizer = require('./YouTubeNormalizer');
const YtDlpProvider = require('./Providers/YtDlpProvider');
const CacheManager = require('../../Cache/CacheManager');

const inFlight = new Map();

class YouTubeInfoService {
    static async execute(url, signal = null) {
        const videoId = YouTubeValidator.validateUrl(url);
        const cacheKey = `youtube:info:${videoId}`;
        
        const cached = CacheManager.get(cacheKey);
        if (cached) return cached;

        if (inFlight.has(cacheKey)) {
            return inFlight.get(cacheKey);
        }

        const fetchPromise = (async () => {
            try {
                const normalizedUrl = YouTubeNormalizer.formatUrl(videoId);
                const rawInfo = await YtDlpProvider.getInfo(normalizedUrl, signal);
                
                const info = {
                    id: rawInfo.id,
                    title: rawInfo.title,
                    channel: rawInfo.uploader,
                    duration: rawInfo.duration,
                    thumbnail: rawInfo.thumbnail,
                    filesize: rawInfo.filesize || rawInfo.filesize_approx
                };

                CacheManager.set(cacheKey, info, 86400000);
                return info;
            } finally {
                inFlight.delete(cacheKey);
            }
        })();

        inFlight.set(cacheKey, fetchPromise);
        return fetchPromise;
    }
}

module.exports = YouTubeInfoService;