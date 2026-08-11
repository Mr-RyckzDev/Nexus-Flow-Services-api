FROM node:20-bookworm-slim

ENV NODE_ENV=production \
    DEBIAN_FRONTEND=noninteractive \
    YTDLP_PATH=/usr/local/bin/yt-dlp \
    FFMPEG_PATH=/usr/bin/ffmpeg \
    FFPROBE_PATH=/usr/bin/ffprobe \
    YTDLP_NODE_PATH=/usr/local/bin/node \
    PATH=/usr/local/bin:/usr/bin:/bin

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        ffmpeg \
        python3 \
        python-is-python3 \
        build-essential \
        pkg-config \
        git \
    && rm -rf /var/lib/apt/lists/* \
    && python --version \
    && python3 --version \
    && node --version \
    && npm --version \
    && ffmpeg -version \
    && ffprobe -version

RUN curl -fsSL \
    https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp \
    && chmod 755 /usr/local/bin/yt-dlp \
    && yt-dlp --version

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm config set fetch-retries 5 \
    && npm config set fetch-retry-factor 2 \
    && npm config set fetch-retry-mintimeout 20000 \
    && npm config set fetch-retry-maxtimeout 120000 \
    && npm ci --omit=dev --no-audit --no-fund

COPY . .

RUN mkdir -p \
        /app/config/yt-dlp \
        /app/Temp \
        /app/src/Temp \
    && chmod 755 /app/config/yt-dlp \
    && printf '%s\n' \
        '#!/bin/sh' \
        'set -eu' \
        '' \
        'mkdir -p /app/config/yt-dlp' \
        '' \
        'if [ -n "${YOUTUBE_COOKIES_BASE64:-}" ]; then' \
        '    printf "%s" "$YOUTUBE_COOKIES_BASE64" | base64 -d > /app/config/yt-dlp/cookies.txt' \
        '    chmod 600 /app/config/yt-dlp/cookies.txt' \
        'elif [ -n "${YOUTUBE_COOKIES_CONTENT:-}" ]; then' \
        '    printf "%s" "$YOUTUBE_COOKIES_CONTENT" > /app/config/yt-dlp/cookies.txt' \
        '    chmod 600 /app/config/yt-dlp/cookies.txt' \
        'fi' \
        '' \
        'if [ -f /etc/secrets/cookies.txt ]; then' \
        '    cp /etc/secrets/cookies.txt /app/config/yt-dlp/cookies.txt' \
        '    chmod 600 /app/config/yt-dlp/cookies.txt' \
        'fi' \
        '' \
        'exec "$@"' \
        > /entrypoint.sh \
    && chmod 755 /entrypoint.sh

RUN chown -R node:node /app /entrypoint.sh

USER node

EXPOSE 10000

ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "start"]
