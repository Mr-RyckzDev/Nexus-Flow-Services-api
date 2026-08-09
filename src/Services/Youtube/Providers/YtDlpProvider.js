
const fs = require('fs');
const path = require('path');
const { runProcess } = require('../Utils/processRunner');
const SystemCapabilities = require('../../../Bootstrap/SystemCapabilities');
const Config = require('../../../Config');
const { YouTubeError } = require('../YouTubeErrors');

class YtDlpProvider {
    static getBin() {
        const bin = SystemCapabilities.getDependency('ytdlp');

        if (!bin) {
            throw new YouTubeError(
                'yt-dlp is not available',
                'YTDLP_UNAVAILABLE',
                503
            );
        }

        return bin;
    }

    static getCommonArgs() {
        const args = ['--no-playlist'];

        if (Config.youtube.jsRuntime) {
            args.push('--js-runtimes', Config.youtube.jsRuntime);
        }

        if (Config.youtube.cookiesPath) {
            args.push('--cookies', Config.youtube.cookiesPath);
        }

        return args;
    }

    static async getInfo(url, signal = null) {
        const args = [
            '--dump-json',
            ...this.getCommonArgs(),
            url
        ];

        try {
            const output = await runProcess(
                this.getBin(),
                args,
                Config.youtube.metadataTimeout,
                signal
            );

            return JSON.parse(output);
        } catch (error) {
            throw new YouTubeError(
                `Failed to retrieve metadata: ${error.message}`,
                'METADATA_FAILED'
            );
        }
    }
    
    static async download(url, format, outputPath, signal = null) {
    const args = [
        '-f',
        format,
        '--merge-output-format',
        'mp4',
        '-o',
        outputPath,
        ...this.getCommonArgs(),
        url
    ];

    try {
        await runProcess(
            this.getBin(),
            args,
            Config.youtube.downloadTimeout,
            signal
        );

        return outputPath;
    } catch (error) {
        throw new YouTubeError(
            `Download failed: ${error.message}`,
            'DOWNLOAD_FAILED'
        );
    }
}
/*
    static async download(url, format, outputPath, signal = null) {
        const directory = path.dirname(outputPath);
        const baseName = path.basename(outputPath, path.extname(outputPath));
        const outputTemplate = path.join(directory, `${baseName}.%(ext)s`);

        const args = [
            '-f',
            format,
            '-o',
            outputTemplate,
            '--merge-output-format',
            'mp4',
            ...this.getCommonArgs(),
            url
        ];

        try {
            await runProcess(
                this.getBin(),
                args,
                Config.youtube.downloadTimeout,
                signal
            );

            const files = await fs.promises.readdir(directory);

            const candidates = files
                .filter(file => file.startsWith(`${baseName}.`))
                .map(file => path.join(directory, file))
                .filter(file => {
                    try {
                        return fs.statSync(file).isFile();
                    } catch {
                        return false;
                    }
                });

            const mp4 = candidates.find(file => file.endsWith('.mp4'));

            if (!mp4) {
                throw new Error('yt-dlp did not produce an MP4 file');
            }

            return mp4;
        } catch (error) {
            throw new YouTubeError(
                `Download failed: ${error.message}`,
                'DOWNLOAD_FAILED'
            );
        }
    }
    */
}

module.exports = YtDlpProvider;