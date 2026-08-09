const YouTubeSearchService = require('../Services/Youtube/YouTubeSearchService');
const YouTubeInfoService = require('../Services/Youtube/YouTubeInfoService');
const YouTubeAudioService = require('../Services/Youtube/YouTubeAudioService');
const YouTubeVideoService = require('../Services/Youtube/YouTubeVideoService');
const { formatSuccess } = require('../Utils/responseFormatter');
const { streamToResponse } = require('../Media/MediaStream');

class YouTubeController {
    static async search(req, res) {
        const { q } = req.query;
        if (!q) throw new Error('Query parameter "q" is required');

        const data = await YouTubeSearchService.execute(q);
        res.json(formatSuccess(200, 'Busca realizada com sucesso.', data));
    }

    static async info(req, res) {
        const { url } = req.query;
        if (!url) throw new Error('Query parameter "url" is required');

        const abortController = new AbortController();
        req.on('close', () => abortController.abort());

        const data = await YouTubeInfoService.execute(url, abortController.signal);
        res.json(formatSuccess(200, 'Informações obtidas com sucesso.', data));
    }

    static async audio(req, res) {
        const { url } = req.query;
        if (!url) throw new Error('Query parameter "url" is required');

        const abortController = new AbortController();
        req.on('close', () => abortController.abort());

        const stream = await YouTubeAudioService.processStream(url, abortController.signal);
        const headers = {
            'Content-Disposition': 'attachment; filename="audio.mp3"'
        };

        await streamToResponse(stream, res, 'audio/mpeg', headers);
    }

    static async video(req, res) {
        const { url, quality } = req.query;
        if (!url) throw new Error('Query parameter "url" is required');

        const abortController = new AbortController();
        req.on('close', () => abortController.abort());

        const stream = await YouTubeVideoService.processFile(url, quality, abortController.signal);
        const headers = {
            'Content-Disposition': 'attachment; filename="video.mp4"'
        };

        await streamToResponse(stream, res, 'video/mp4', headers);
    }
}

module.exports = YouTubeController;