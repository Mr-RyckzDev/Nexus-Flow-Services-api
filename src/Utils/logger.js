const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

const WHITE = '\x1b[97m';
const GRAY = '\x1b[90m';
const GREEN = '\x1b[92m';
const YELLOW = '\x1b[93m';
const RED = '\x1b[91m';
const CYAN = '\x1b[96m';

const SYMBOLS = {
    INFO: '›',
    WARN: '⚠',
    ERROR: '✖',
    DEBUG: '•'
};

const COLORS = {
    INFO: GREEN,
    WARN: YELLOW,
    ERROR: RED,
    DEBUG: GRAY
};

const pad = (value, size) =>
    String(value).padStart(size, '0');

const time = () => {
    const now = new Date();

    return `${pad(now.getHours(), 2)}:${pad(now.getMinutes(), 2)}:${pad(now.getSeconds(), 2)}`;
};

const log = (level, message, context = '') => {
    const color = COLORS[level] || WHITE;
    const symbol = SYMBOLS[level] || '›';
    const ctx = context ? `${GRAY}[${context}]${RESET} ` : '';

    console.log(
        `${GRAY}${time()}${RESET} ${color}${BOLD}${symbol} ${level}${RESET} ${ctx}${WHITE}${message}${RESET}`
    );
};

const banner = () => {
    console.log(`
${GREEN}${BOLD}╔══════════════════════════════════════╗
║                                      ║
║          ███╗   ██╗███████╗          ║
║          ████╗  ██║██╔════╝          ║
║          ██╔██╗ ██║█████╗            ║
║          ██║╚██╗██║██╔══╝            ║
║          ██║ ╚████║███████╗          ║
║          ╚═╝  ╚═══╝╚══════╝          ║
║                                      ║
║             N E X U S   A P I        ║
║                                      ║
╚══════════════════════════════════════╝${RESET}
`);
};

const separator = () => {
    console.log(`${GRAY}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${RESET}`);
};

const logger = {
    info: (msg, ctx) => log('INFO', msg, ctx),
    warn: (msg, ctx) => log('WARN', msg, ctx),
    error: (msg, ctx) => log('ERROR', msg, ctx),
    debug: (msg, ctx) => log('DEBUG', msg, ctx),

    banner,
    separator
};

module.exports = logger;