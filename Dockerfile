# 1. Imagem base oficial do Node.js
FROM node:20-slim

# 2. Instala dependências do sistema: ffmpeg, python3 (pro yt-dlp) e curl
RUN apt-get update && apt-get install -y --no-install-recommends \
    ffmpeg \
    python3 \
    curl \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# 3. Baixa a versão mais recente do yt-dlp e coloca no PATH global
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o /usr/local/bin/yt-dlp \
    && chmod a+rx /usr/local/bin/yt-dlp

# 4. Define o diretório de trabalho
WORKDIR /app

# 5. Instala as dependências do Node.js primeiro (aproveita cache de build)
COPY package*.json ./
RUN npm install --omit=dev

# 6. Copia o código-fonte
COPY . .

# 7. Prepara as pastas necessárias e o script de entrada para injetar os cookies
RUN mkdir -p config/yt-dlp

# 8. Script para injetar a variável de cookies no arquivo antes de dar start
RUN echo '#!/bin/sh\n\
if [ -n "$YOUTUBE_COOKIES_CONTENT" ]; then\n\
  echo "Gerando cookies.txt via Docker..."\n\
  echo "$YOUTUBE_COOKIES_CONTENT" > config/yt-dlp/cookies.txt\n\
  chmod 600 config/yt-dlp/cookies.txt\n\
fi\n\
exec "$@"' > /entrypoint.sh && chmod +x /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]

# 9. Porta e Comando de Inicialização
EXPOSE 10000
CMD ["npm", "start"]