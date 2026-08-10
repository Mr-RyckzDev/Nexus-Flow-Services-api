require('dotenv').config();

const toInt = (value, fallback) => {
    const parsed = Number.parseInt(value, 10);
    return Number.isFinite(parsed) && parsed > 0
        ? parsed
        : fallback;
};

const Config = {
    server: {
        port: Number(process.env.PORT) || 3000,
        env: process.env.NODE_ENV || 'development',
        apiPrefix: process.env.API_PREFIX || '/api/v1'
    },

    security: {
        globalApiKey:
            process.env.GLOBAL_API_KEY || 'nexus-default-key-123',

        timeout: toInt(
            process.env.REQUEST_TIMEOUT,
            120000
        ),

        corsOrigin:
            process.env.CORS_ORIGIN || '*',

        bodyLimit:
            process.env.BODY_LIMIT || '10mb',

        rateLimitWindow:
            toInt(
                process.env.RATE_LIMIT_WINDOW,
                900000
            ),

        rateLimitMax:
            toInt(
                process.env.RATE_LIMIT_MAX,
                100
            )
    },

    youtube: {
        ytdlpPath:
            process.env.YTDLP_PATH || null,

        ffmpegPath:
            process.env.FFMPEG_PATH || null,

        ffprobePath:
            process.env.FFPROBE_PATH || null,

        cookiesPath:
            process.env.YTDLP_COOKIES || null,

        jsRuntime:
            process.env.YOUTUBE_JS_RUNTIME || 'node',

        searchTimeout:
            toInt(
                process.env.YOUTUBE_SEARCH_TIMEOUT,
                30000
            ),

        metadataTimeout:
            toInt(
                process.env.YOUTUBE_METADATA_TIMEOUT,
                60000
            ),

        downloadTimeout:
            toInt(
                process.env.YOUTUBE_DOWNLOAD_TIMEOUT,
                120000
            ),

        maxDuration:
            toInt(
                process.env.YOUTUBE_MAX_DURATION,
                3600
            ),

        maxFileSize:
            toInt(
                process.env.YOUTUBE_MAX_FILE_SIZE,
                104857600
            ),

        concurrency:
            toInt(
                process.env.YOUTUBE_CONCURRENCY,
                1
            )
    }
};

const validateConfig = () => {
    if (Config.security.timeout <= 0) {
        throw new Error('INVALID_CONFIG: REQUEST_TIMEOUT');
    }

    if (Config.security.rateLimitMax <= 0) {
        throw new Error('INVALID_CONFIG: RATE_LIMIT_MAX');
    }

    if (Config.youtube.concurrency <= 0) {
        throw new Error('INVALID_CONFIG: YOUTUBE_CONCURRENCY');
    }
};

validateConfig();

module.exports = Config;