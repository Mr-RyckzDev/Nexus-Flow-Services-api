class YouTubeNormalizer {
    static extractVideoId(url) {
        if (!url || typeof url !== 'string') return null;
        const regex = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/|youtube\.com\/shorts\/)([^"&?\/\s]{11})/i;
        const match = url.match(regex);
        return match ? match[1] : null;
    }

    static formatUrl(videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
    }
}

module.exports = YouTubeNormalizer;