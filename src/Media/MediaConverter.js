const { spawn } = require('child_process');
const SystemCapabilities = require('../Bootstrap/SystemCapabilities');

const createFfmpegStream = (input, args, signal = null) => {
    const ffmpegBin = SystemCapabilities.getDependency('ffmpeg') || 'ffmpeg';
    const ffmpeg = spawn(ffmpegBin, ['-i', input, ...args, 'pipe:1']);
    
    ffmpeg.stderr.on('data', () => {});

    if (signal) {
        signal.addEventListener('abort', () => {
            if (!ffmpeg.killed) ffmpeg.kill('SIGKILL');
        }, { once: true });
    }
    
    return ffmpeg.stdout;
};

module.exports = { createFfmpegStream };