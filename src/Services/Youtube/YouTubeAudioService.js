const YouTubeValidator = require('./YouTubeValidator');
const YouTubeNormalizer = require('./YouTubeNormalizer');
const YouTubeInfoService = require('./YouTubeInfoService');
const YtDlpProvider = require('./Providers/YtDlpProvider');
const FormatSelector = require('./Utils/formatSelector');
const TempManager = require('../../Temp/TempManager');
const { createFfmpegStream } = require('../../Media/MediaConverter');
const SystemCapabilities = require('../../Bootstrap/SystemCapabilities');
const ConcurrencyManager = require('./Utils/ConcurrencyManager');
const Config = require('../../Config');
const { YouTubeError } = require('./YouTubeErrors');

const concurrencyLimit = new ConcurrencyManager(Config.youtube.concurrency);

class YouTubeAudioService {
    static async processStream(url, signal = null) {
        if (!SystemCapabilities.getDependency('ffmpeg')) {
            throw new YouTubeError('FFmpeg unavailable', 'FFMPEG_UNAVAILABLE', 503);
        }

        const videoId = YouTubeValidator.validateUrl(url);
        const normalizedUrl = YouTubeNormalizer.formatUrl(videoId);
        
        const metadata = await YouTubeInfoService.execute(normalizedUrl, signal);
       // YouTubeValidator.validateLimits(metadata);
YouTubeValidator.validateLimits(metadata, {
    checkFilesize: false
});
        await concurrencyLimit.acquire();
        const tempPath = TempManager.createTempPath('webm');

        try {
            const format = FormatSelector.getAudioFormat();
            await YtDlpProvider.download(normalizedUrl, format, tempPath, signal);
            
            const ffmpegArgs = ['-vn', '-acodec', 'libmp3lame', '-q:a', '2', '-f', 'mp3'];
            const stream = createFfmpegStream(tempPath, ffmpegArgs, signal);
            
            stream.on('end', () => TempManager.removeTemp(tempPath));
            stream.on('error', () => TempManager.removeTemp(tempPath));
            stream.on('close', () => TempManager.removeTemp(tempPath));

            return stream;
        } catch (error) {
            await TempManager.removeTemp(tempPath);
            throw error;
        } finally {
            concurrencyLimit.release();
        }
    }
}

module.exports = YouTubeAudioService;