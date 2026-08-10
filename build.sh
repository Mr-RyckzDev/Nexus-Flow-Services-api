
#!/usr/bin/env bash
set -o errexit

# 1. Instala dependências do Node
npm install

# 2. Prepara as pastas bin e config
mkdir -p bin
mkdir -p config/yt-dlp

# 3. Instala ffmpeg e ffprobe se necessário
if [ ! -f bin/ffmpeg ]; then
  echo "Baixando ffmpeg..."
  curl -L https://johnvansickle.com/ffmpeg/releases/ffmpeg-release-amd64-static.tar.xz | tar -xJ --strip-components=1 -C bin/
fi

# 4. Instala yt-dlp
echo "Baixando yt-dlp..."
curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp -o bin/yt-dlp
chmod +x bin/yt-dlp

# 5. GERAR O ARQUIVO DE COOKIES A PARTIR DA VARIÁVEL DA RENDER
if [ -n "$YOUTUBE_COOKIES_CONTENT" ]; then
  echo "Gerando arquivo de cookies..."
  echo "$YOUTUBE_COOKIES_CONTENT" > config/yt-dlp/cookies.txt
  echo "Cookies criados com sucesso!"
else
  echo "AVISO: YOUTUBE_COOKIES_CONTENT não foi definida nas variáveis de ambiente."
fi