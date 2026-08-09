
const { runProcess } = require('../Utils/processRunner');
const SystemCapabilities = require('../../../Bootstrap/SystemCapabilities');
const Config = require('../../../Config');
const { YouTubeError } = require('../YouTubeErrors');

class YtDlpProvider {
    static getBin() {
        const bin = SystemCapabilities.getDependency('ytdlp');
        if (!bin) {
            throw new YouTubeError('yt-dlp is not available', 'YTDLP_UNAVAILABLE', 503);
        }
        return bin;
    }

    static async getInfo(url, signal = null) {
        const args = ['--dump-json', '--no-playlist', url];
        try {
            const output = await runProcess(this.getBin(), args, Config.youtube.metadataTimeout, signal);
            return JSON.parse(output);
        } catch (error) {
            throw new YouTubeError(`Failed to retrieve metadata: ${error.message}`, 'METADATA_FAILED');
        }
    }

    static async download(url, format, outputPath, signal = null) {
        const args = ['-f', format, '-o', outputPath, '--no-playlist', url];
        try {
            await runProcess(this.getBin(), args, Config.youtube.downloadTimeout, signal);
            return outputPath;
        } catch (error) {
            throw new YouTubeError(`Download failed: ${error.message}`, 'DOWNLOAD_FAILED');
        }
    }
}

module.exports = YtDlpProvider;