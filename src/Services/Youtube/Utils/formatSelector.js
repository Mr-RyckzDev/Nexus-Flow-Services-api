class FormatSelector {
    static getAudioFormat() {
        return 'bestaudio';
    }

    static getVideoFormat(quality) {
        const validQualities = ['360', '480', '720', '1080'];
        const q = validQualities.includes(String(quality))
            ? String(quality)
            : '720';

        return `best[ext=mp4][height<=${q}]/best[ext=mp4]/best`;
    }
}

module.exports = FormatSelector;