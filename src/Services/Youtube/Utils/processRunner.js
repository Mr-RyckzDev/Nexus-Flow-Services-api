const { execFile } = require('child_process');

const runProcess = (command, args, timeout = 30000, signal = null) => {
    return new Promise((resolve, reject) => {
        const child = execFile(command, args, {
            maxBuffer: 20 * 1024 * 1024,
            timeout: timeout,
            killSignal: 'SIGKILL'
        }, (error, stdout, stderr) => {
            if (error) {
                if (error.killed) return reject(new Error('PROCESS_KILLED_OR_TIMEOUT'));
                return reject(new Error(`PROCESS_ERROR: ${error.message} | ${stderr ? stderr.trim() : ''}`));
            }
            resolve(stdout.trim());
        });

        if (signal) {
            signal.addEventListener('abort', () => {
                if (!child.killed) child.kill('SIGKILL');
                reject(new Error('PROCESS_ABORTED_BY_CLIENT'));
            }, { once: true });
        }
    });
};

module.exports = { runProcess };