FROM node:20-bookworm-slim

ENV NODE_ENV=production

RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN curl -L \
    https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp \
    && chmod 755 /usr/local/bin/yt-dlp

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev

COPY . .

RUN mkdir -p /app/config/yt-dlp

RUN printf '%s\n' \
    '#!/bin/sh' \
    'set -e' \
    '' \
    'if [ -n "$YOUTUBE_COOKIES_CONTENT" ]; then' \
    '    echo "Configurando cookies do YouTube..."' \
    '    printf "%s" "$YOUTUBE_COOKIES_CONTENT" > /app/config/yt-dlp/cookies.txt' \
    '    chmod 600 /app/config/yt-dlp/cookies.txt' \
    'fi' \
    '' \
    'exec "$@"' \
    > /entrypoint.sh \
    && chmod 755 /entrypoint.sh

ENV YTDLP_PATH=/usr/local/bin/yt-dlp
ENV FFMPEG_PATH=/usr/bin/ffmpeg
ENV FFPROBE_PATH=/usr/bin/ffprobe
ENV YTDLP_NODE_PATH=/usr/local/bin/node

EXPOSE 10000

ENTRYPOINT ["/entrypoint.sh"]

CMD ["npm", "start"]