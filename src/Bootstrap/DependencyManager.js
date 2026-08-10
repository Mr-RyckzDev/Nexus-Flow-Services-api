const fs = require('fs');
const { execSync } = require('child_process');
const Config = require('../Config');

class DependencyManager {
    static checkBinary(pathOrCommand) {
        if (!pathOrCommand) return null;

        try {
            if (fs.existsSync(pathOrCommand)) {
                fs.accessSync(pathOrCommand, fs.constants.X_OK);
                return pathOrCommand;
            }
        } catch {}

        try {
            const cmd = process.platform === 'win32' ? 'where' : 'command -v';
            const result = execSync(`${cmd} ${pathOrCommand}`, { stdio: 'pipe' }).toString().trim();
            
            if (result) {
                const firstResult = result.split(/\r?\n/)[0].trim();
                if (fs.existsSync(firstResult)) {
                    return firstResult;
                }
            }
        } catch {}

        return null;
    }

    static async locate() {
        return {
            ytdlp: this.checkBinary(Config.youtube.ytdlpPath || 'yt-dlp'),
            ffmpeg: this.checkBinary(Config.youtube.ffmpegPath || 'ffmpeg'),
            ffprobe: this.checkBinary(Config.youtube.ffprobePath || 'ffprobe')
        };
    }
}

module.exports = DependencyManager;
