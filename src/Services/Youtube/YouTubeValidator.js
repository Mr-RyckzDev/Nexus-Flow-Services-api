/*const { YouTubeError } = require('./YouTubeErrors');
const YouTubeNormalizer = require('./YouTubeNormalizer');
const Config = require('../../Config');

class YouTubeValidator {
    static validateUrl(url) {
        const videoId = YouTubeNormalizer.extractVideoId(url);
        if (!videoId) {
            throw new YouTubeError('Invalid YouTube URL', 'INVALID_YOUTUBE_URL');
        }
        return videoId;
    }

    static validateLimits(metadata) {
        if (metadata.duration > Config.youtube.maxDuration) {
            throw new YouTubeError('Video exceeds maximum allowed duration', 'VIDEO_TOO_LONG');
        }
        if (metadata.filesize && metadata.filesize > Config.youtube.maxFileSize) {
            throw new YouTubeError('Video exceeds maximum allowed file size', 'FILE_TOO_LARGE');
        }
    }
}

module.exports = YouTubeValidator;
*/
const { YouTubeError } = require('./YouTubeErrors');
const YouTubeNormalizer = require('./YouTubeNormalizer');
const Config = require('../../Config');

class YouTubeValidator {
    static validateUrl(url) {
        const videoId = YouTubeNormalizer.extractVideoId(url);

        if (!videoId) {
            throw new YouTubeError(
                'Invalid YouTube URL',
                'INVALID_YOUTUBE_URL'
            );
        }

        return videoId;
    }

    static validateLimits(metadata, options = {}) {
        const {
            checkDuration = true,
            checkFilesize = true
        } = options;

        if (
            checkDuration &&
            metadata.duration &&
            metadata.duration > Config.youtube.maxDuration
        ) {
            throw new YouTubeError(
                'Video exceeds maximum allowed duration',
                'VIDEO_TOO_LONG'
            );
        }

        if (
            checkFilesize &&
            metadata.filesize &&
            metadata.filesize > Config.youtube.maxFileSize
        ) {
            throw new YouTubeError(
                'Video exceeds maximum allowed file size',
                'FILE_TOO_LARGE'
            );
        }
    }
}

module.exports = YouTubeValidator;