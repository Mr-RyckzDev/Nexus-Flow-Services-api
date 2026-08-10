'use strict';

/*
 * Nexus Flow Services
 * NFS Logger
 *
 * Tema:
 *   • Violeta / Roxo escuro
 *   • Branco
 *   • Verde
 *   • Amarelo
 *   • Vermelho
 *
 * API compatível:
 *   logger.info()
 *   logger.success()
 *   logger.warn()
 *   logger.error()
 *   logger.debug()
 *   logger.banner()
 *   logger.separator()
 */

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';

const WHITE = '\x1b[97m';
const GRAY = '\x1b[90m';

const PURPLE = '\x1b[35m';
const VIOLET = '\x1b[95m';

const GREEN = '\x1b[92m';
const YELLOW = '\x1b[93m';
const RED = '\x1b[91m';

const COLORS = {
    INFO: WHITE,
    SUCCESS: GREEN,
    WARN: YELLOW,
    ERROR: RED,
    DEBUG: GRAY
};

const SYMBOLS = {
    INFO: '›',
    SUCCESS: '✓',
    WARN: '!',
    ERROR: '×',
    DEBUG: '·'
};

const pad = (value, size = 2) =>
    String(value).padStart(size, '0');

const time = () => {
    const now = new Date();

    return [
        pad(now.getHours()),
        pad(now.getMinutes()),
        pad(now.getSeconds())
    ].join(':');
};

const formatMessage = (message) => {
    if (message instanceof Error) {
        return message.stack || message.message;
    }

    if (typeof message === 'object' && message !== null) {
        try {
            return JSON.stringify(message);
        } catch {
            return String(message);
        }
    }

    return String(message);
};

const context = (ctx) => {
    if (!ctx) return '';

    return `${PURPLE}${BOLD}${ctx}${RESET}`;
};

/*
 * LOG PRINCIPAL
 *
 * Exemplo:
 *
 * 10:02:14  › INFO     API started
 * 10:02:15  ✓ SUCCESS  Server listening on port 3000
 * 10:02:16  ! WARN     Rate limit approaching
 * 10:02:17  × ERROR    Request failed
 */

const log = (level, message, ctx = '') => {
    const color = COLORS[level] || WHITE;
    const symbol = SYMBOLS[level] || '›';

    const labels = {
        INFO: 'INFO',
        SUCCESS: 'SUCCESS',
        WARN: 'WARN',
        ERROR: 'ERROR',
        DEBUG: 'DEBUG'
    };

    const label = labels[level] || level;

    const formattedContext = context(ctx);
    const text = formatMessage(message);

    console.log(
        `${GRAY}${time()}${RESET} ` +
        `${color}${BOLD}${symbol}${RESET} ` +
        `${color}${BOLD}${label.padEnd(7)}${RESET} ` +
        `${formattedContext ? `${formattedContext} ${GRAY}›${RESET} ` : ''}` +
        `${color === WHITE ? WHITE : color}${text}${RESET}`
    );
};

/*
 * ============================================================
 * BANNER
 * ============================================================
 *
 * NFS
 * Nexus Flow Services
 */


const banner = () => {
    console.log('');

    console.log(
        `${PURPLE}${BOLD}
╔══════════════════════════════════════════════════════════╗
║                                                          ║
║                  ███╗   ██╗███████╗███████╗             ║
║                  ████╗  ██║██╔════╝██╔════╝             ║
║                  ██╔██╗ ██║█████╗  ███████╗             ║
║                  ██║╚██╗██║██╔══╝  ╚════██║             ║
║                  ██║ ╚████║██║     ███████║             ║
║                  ╚═╝  ╚═══╝╚═╝     ╚══════╝             ║
║                                                          ║
║                 Nexus Flow Services                      ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
${RESET}`
    );

    console.log('');
};

/*
 * ============================================================
 * SEPARATOR
 * ============================================================
 */

const separator = () => {
    console.log(
        `${PURPLE}${DIM}──────────────────────────────────────────────────────────${RESET}`
    );
};

/*
 * ============================================================
 * STARTUP
 * ============================================================
 *
 * Painel compacto para inicialização.
 *
 * Não usa logger.info() para cada linha.
 */

const startup = ({
    environment = 'unknown',
    runtime = process.version,
    api = {},
    bootstrap = {},
    services = {}
} = {}) => {

    const rows = [];

    rows.push(
        ['ENV', environment],
        ['NODE', runtime]
    );

    if (api.name) rows.push(['API', api.name]);
    if (api.version) rows.push(['VERSION', api.version]);
    if (api.mode) rows.push(['MODE', api.mode]);
    if (api.port) rows.push(['PORT', api.port]);
    if (api.prefix) rows.push(['PREFIX', api.prefix]);

    console.log(
        `${PURPLE}${DIM}╭─ SYSTEM ───────────────────────────────────────────────╮${RESET}`
    );

    for (const [label, value] of rows) {
        console.log(
            `${PURPLE}${BOLD}│${RESET} ` +
            `${GRAY}${label.padEnd(8)}${RESET} ` +
            `${WHITE}${value}${RESET}`
        );
    }

    if (Object.keys(bootstrap).length) {
        console.log(
            `${PURPLE}${DIM}├─ BOOTSTRAP ────────────────────────────────────────────┤${RESET}`
        );

        for (const [name, ready] of Object.entries(bootstrap)) {
            const symbol = ready
                ? `${GREEN}✓${RESET}`
                : `${RED}×${RESET}`;

            const value = ready
                ? `${GREEN}ready${RESET}`
                : `${RED}failed${RESET}`;

            console.log(
                `${PURPLE}${BOLD}│${RESET} ` +
                `${GRAY}${name.padEnd(16)}${RESET} ` +
                `${symbol} ${value}`
            );
        }
    }

    if (Object.keys(services).length) {
        console.log(
            `${PURPLE}${DIM}├─ SERVICES ─────────────────────────────────────────────┤${RESET}`
        );

        for (const [name, online] of Object.entries(services)) {
            const symbol = online
                ? `${GREEN}✓${RESET}`
                : `${RED}×${RESET}`;

            const value = online
                ? `${GREEN}online${RESET}`
                : `${RED}offline${RESET}`;

            console.log(
                `${PURPLE}${BOLD}│${RESET} ` +
                `${GRAY}${name.padEnd(16)}${RESET} ` +
                `${symbol} ${value}`
            );
        }
    }

    console.log(
        `${PURPLE}${DIM}╰────────────────────────────────────────────────────────╯${RESET}`
    );

    console.log('');
};

/*
 * ============================================================
 * EXPORT
 * ============================================================
 */

const logger = {
    info: (msg, ctx) =>
        log('INFO', msg, ctx),

    success: (msg, ctx) =>
        log('SUCCESS', msg, ctx),

    warn: (msg, ctx) =>
        log('WARN', msg, ctx),

    error: (msg, ctx) =>
        log('ERROR', msg, ctx),

    debug: (msg, ctx) =>
        log('DEBUG', msg, ctx),

    banner,

    startup,

    separator
};

module.exports = logger;