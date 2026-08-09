/*const { exec } = require('child_process');
const Config = require('../Config');

class DependencyManager {
    static async checkCommand(command) {
        return new Promise((resolve) => {
            exec(`${command} --version`, (error) => {
                resolve(!error);
            });
        });
    }

    static async locate() {
        const ytdlp = Config.youtube.ytdlpPath || 'yt-dlp';
        const ffmpeg = Config.youtube.ffmpegPath || 'ffmpeg';
        const ffprobe = Config.youtube.ffprobePath || 'ffprobe';

        const [hasYtdlp, hasFfmpeg, hasFfprobe] = await Promise.all([
            this.checkCommand(ytdlp),
            this.checkCommand(ffmpeg),
            this.checkCommand(ffprobe)
        ]);

        return {
            ytdlp: hasYtdlp ? ytdlp : null,
            ffmpeg: hasFfmpeg ? ffmpeg : null,
            ffprobe: hasFfprobe ? ffprobe : null
        };
    }
}

module.exports = DependencyManager;
*/

const { execFile } = require('child_process');
const Config = require('../Config');

class DependencyManager {
    static checkCommand(command, versionArg = '--version') {
        return new Promise((resolve) => {
            execFile(command, [versionArg], { timeout: 5000 }, (error) => {
                resolve(!error);
            });
        });
    }

    static async locateBinary(configured, command, versionArg = '--version') {
        const candidate = configured || command;

        if (await this.checkCommand(candidate, versionArg)) {
            return candidate;
        }

        return null;
    }

    static async locate() {
        const [ytdlp, ffmpeg, ffprobe] = await Promise.all([
            this.locateBinary(
                Config.youtube.ytdlpPath,
                'yt-dlp',
                '--version'
            ),
            this.locateBinary(
                Config.youtube.ffmpegPath,
                'ffmpeg',
                '-version'
            ),
            this.locateBinary(
                Config.youtube.ffprobePath,
                'ffprobe',
                '-version'
            )
        ]);

        return {
            ytdlp,
            ffmpeg,
            ffprobe
        };
    }
}

module.exports = DependencyManager;