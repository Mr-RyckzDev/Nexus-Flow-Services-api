const os = require('os');

class EnvironmentManager {
    static detect() {
        const platform = os.platform();
        return {
            os: platform,
            arch: os.arch(),
            isAndroid: platform === 'android' || process.env.PREFIX?.includes('com.termux'),
            isDocker: this.checkDocker()
        };
    }

    static checkDocker() {
        try {
            const fs = require('fs');
            return fs.existsSync('/.dockerenv');
        } catch {
            return false;
        }
    }
}

module.exports = EnvironmentManager;