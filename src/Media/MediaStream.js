const streamToResponse = (readableStream, res, contentType, headers = {}) => {
    return new Promise((resolve, reject) => {
        res.setHeader('Content-Type', contentType);

        Object.keys(headers).forEach(key => {
            res.setHeader(key, headers[key]);
        });

        let settled = false;

        const cleanup = () => {
            if (!settled) {
                settled = true;
                resolve();
            }
        };

        readableStream.on('error', err => {
            if (!res.headersSent) {
                res.status(500).json({
                    success: false,
                    message: 'STREAM_ERROR'
                });
            } else {
                res.destroy();
            }

            if (!settled) {
                settled = true;
                reject(err);
            }
        });

        readableStream.on('end', cleanup);

        res.on('close', () => {
            if (!readableStream.destroyed) {
                readableStream.destroy();
            }

            cleanup();
        });

        readableStream.pipe(res);
    });
};

module.exports = { streamToResponse };