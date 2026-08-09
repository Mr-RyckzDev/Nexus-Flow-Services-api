const app = require('./src/api');
const Config = require('./src/Config');
const ClientStore = require('./src/Clients/ClientStore');
const TempManager = require('./src/Temp/TempManager');
const logger = require('./src/Utils/logger');
const SystemCapabilities = require('./src/Bootstrap/SystemCapabilities');

ClientStore.saveClient({
    id: 'admin',
    apiKey: Config.security.globalApiKey,
    status: 'active',
    createdAt: Date.now(),
    expiresAt: null,
    requests: 0,
    limits: { maxRequests: Infinity }
});

logger.banner();

const bootstrap = async () => {
    logger.info('Initializing System Capabilities...', 'BOOTSTRAP');
    await SystemCapabilities.initialize();
    const caps = SystemCapabilities.getCapabilities();
    
    logger.info(`Environment: ${caps.environment.os} (${caps.environment.arch})`, 'BOOTSTRAP');
    logger.info(`YouTube Engine:`, 'BOOTSTRAP');
    logger.info(`- yt-dlp:  ${caps.dependencies.ytdlp ? '✓' : '✗'}`, 'BOOTSTRAP');
    logger.info(`- FFmpeg:  ${caps.dependencies.ffmpeg ? '✓' : '✗'}`, 'BOOTSTRAP');
    logger.info(`- FFprobe: ${caps.dependencies.ffprobe ? '✓' : '✗'}`, 'BOOTSTRAP');
    logger.info(`Status: ${caps.ready ? 'READY' : 'DEGRADED'}`, 'BOOTSTRAP');

    const server = app.listen(Config.server.port, () => {
        logger.info(`Server running in ${Config.server.env} mode`, 'BOOT');
        logger.info(`Port: ${Config.server.port}`, 'BOOT');
        logger.info(`Prefix: ${Config.server.apiPrefix}`, 'BOOT');
    });

    const handleShutdown = (signal) => {
        logger.info(`Signal ${signal} received. Closing HTTP server...`, 'SHUTDOWN');
        server.close(() => {
            logger.info('HTTP server closed.', 'SHUTDOWN');
            TempManager.cleanupAllSync();
            logger.info('Temporary files cleaned up.', 'SHUTDOWN');
            process.exit(0);
        });

        setTimeout(() => {
            logger.error('Forced shutdown execution.', 'SHUTDOWN');
            process.exit(1);
        }, 10000);
    };

    process.on('SIGTERM', () => handleShutdown('SIGTERM'));
    process.on('SIGINT', () => handleShutdown('SIGINT'));
};

process.on('unhandledRejection', (reason) => {
    logger.error(`Unhandled Rejection: ${reason.stack || reason}`, 'CRITICAL');
});

process.on('uncaughtException', (error) => {
    logger.error(`Uncaught Exception: ${error.stack}`, 'CRITICAL');
});

bootstrap();
logger.info('Nexus API iniciada');
logger.separator();