const YouTubeValidator = require('./YouTubeValidator');
const YouTubeNormalizer = require('./YouTubeNormalizer');
const YouTubeInfoService = require('./YouTubeInfoService');
const YtDlpProvider = require('./Providers/YtDlpProvider');
const FormatSelector = require('./Utils/formatSelector');
const TempManager = require('../../Temp/TempManager');
const fs = require('fs');
const ConcurrencyManager = require('./Utils/ConcurrencyManager');
const Config = require('../../Config');
const { YouTubeError } = require('./YouTubeErrors');

const concurrencyLimit = new ConcurrencyManager(Config.youtube.concurrency);

class YouTubeVideoService {
    static async processFile(url, quality, signal = null) {
        const videoId = YouTubeValidator.validateUrl(url);
        const normalizedUrl = YouTubeNormalizer.formatUrl(videoId);

        const metadata = await YouTubeInfoService.execute(
            normalizedUrl,
            signal
        );

        YouTubeValidator.validateLimits(metadata);

        await concurrencyLimit.acquire();

        const tempPath = TempManager.createTempPath('mp4');

        try {
            const format = FormatSelector.getVideoFormat(quality);

            await YtDlpProvider.download(
                normalizedUrl,
                format,
                tempPath,
                signal
            );

            if (!fs.existsSync(tempPath)) {
                throw new YouTubeError(
                    'Downloaded video file was not created',
                    'VIDEO_FILE_NOT_FOUND',
                    500
                );
            }

            const stream = fs.createReadStream(tempPath);

            const cleanup = () => {
                TempManager.removeTemp(tempPath);
            };

            stream.once('end', cleanup);
            stream.once('error', cleanup);
            stream.once('close', cleanup);

            if (signal) {
                signal.addEventListener(
                    'abort',
                    () => {
                        stream.destroy();
                    },
                    { once: true }
                );
            }

            return stream;
        } catch (error) {
            await TempManager.removeTemp(tempPath);
            throw error;
        } finally {
            concurrencyLimit.release();
        }
    }
}

module.exports = YouTubeVideoService;