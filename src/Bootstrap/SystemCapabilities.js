const EnvironmentManager = require('./EnvironmentManager');
const DependencyManager = require('./DependencyManager');

class SystemCapabilities {
    static #capabilities = {
        environment: null,
        dependencies: null,
        ready: false,
        features: {
            youtubeSearch: true,
            youtubeInfo: false,
            youtubeAudio: false,
            youtubeVideo: false
        }
    };

    static async initialize() {
        this.#capabilities.environment = EnvironmentManager.detect();
        this.#capabilities.dependencies = await DependencyManager.locate();

        const deps = this.#capabilities.dependencies;
        this.#capabilities.features.youtubeInfo = !!deps.ytdlp;
        this.#capabilities.features.youtubeAudio = !!(deps.ytdlp && deps.ffmpeg);
        this.#capabilities.features.youtubeVideo = !!(deps.ytdlp && deps.ffmpeg);

        this.#capabilities.ready = this.#capabilities.features.youtubeAudio && this.#capabilities.features.youtubeVideo;
    }

    static getCapabilities() {
        return this.#capabilities;
    }

    static getDependency(name) {
        return this.#capabilities.dependencies[name];
    }
}

module.exports = SystemCapabilities;