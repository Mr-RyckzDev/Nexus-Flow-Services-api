const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { promisify } = require('util');

const unlinkAsync = promisify(fs.unlink);
const TEMP_DIR = path.join(process.cwd(), 'Temp');

if (!fs.existsSync(TEMP_DIR)) {
    fs.mkdirSync(TEMP_DIR, { recursive: true });
}

const createTempPath = (extension = 'tmp') => {
    const filename = crypto.randomUUID();
    return path.join(TEMP_DIR, `${filename}.${extension}`);
};

const removeTemp = async (filePath) => {
    try {
        if (fs.existsSync(filePath)) {
            await unlinkAsync(filePath);
        }
    } catch (error) {}
};

const cleanupTemp = () => {
    fs.readdir(TEMP_DIR, (err, files) => {
        if (err) return;
        
        files.forEach((file) => {
            const filePath = path.join(TEMP_DIR, file);
            
            fs.stat(filePath, (err, stats) => {
                if (err) return;
                
                const now = Date.now();
                const endTime = new Date(stats.mtime).getTime() + 3600000;
                
                if (now > endTime) {
                    removeTemp(filePath);
                }
            });
        });
    });
};

const cleanupAllSync = () => {
    try {
        if (fs.existsSync(TEMP_DIR)) {
            const files = fs.readdirSync(TEMP_DIR);
            files.forEach(file => {
                try {
                    fs.unlinkSync(path.join(TEMP_DIR, file));
                } catch (e) {}
            });
        }
    } catch (e) {}
};

setInterval(cleanupTemp, 3600000);

module.exports = { createTempPath, removeTemp, cleanupTemp, cleanupAllSync, TEMP_DIR };