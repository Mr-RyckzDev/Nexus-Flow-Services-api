#!/usr/bin/env bash

set -u

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
CONFIG_DIR="$PROJECT_DIR/config/yt-dlp"
COOKIE_FILE="$CONFIG_DIR/cookies.txt"
ENV_FILE="$PROJECT_DIR/.env"
GITIGNORE="$PROJECT_DIR/.gitignore"

NODE_BIN="/data/data/org.smartide.code/files/usr/bin/node"
TEST_URL="https://www.youtube.com/watch?v=L5CV53wCWO0"

printf '\n'
printf '╭──────────────────────────────────────────────╮\n'
printf '│        Nexus Flow • YouTube Setup            │\n'
printf '╰──────────────────────────────────────────────╯\n\n'

fail() {
    printf '\n[ERROR] %s\n' "$1"
    exit 1
}

info() {
    printf '[INFO] %s\n' "$1"
}

ok() {
    printf '[ OK ] %s\n' "$1"
}

# --------------------------------------------------
# Diretório
# --------------------------------------------------

cd "$PROJECT_DIR" || fail "Não foi possível acessar a pasta da API."

info "Projeto: $PROJECT_DIR"

# --------------------------------------------------
# Dependências
# --------------------------------------------------

command -v yt-dlp >/dev/null 2>&1 \
    || fail "yt-dlp não encontrado no PATH."

ok "yt-dlp encontrado: $(command -v yt-dlp)"

if [ -x "$NODE_BIN" ]; then
    ok "Node.js encontrado: $NODE_BIN"
else
    fail "Node.js não encontrado em: $NODE_BIN"
fi

# --------------------------------------------------
# Atualizar yt-dlp
# --------------------------------------------------

info "Verificando versão do yt-dlp..."

YTDLP_VERSION="$(yt-dlp --version 2>/dev/null || true)"

if [ -n "$YTDLP_VERSION" ]; then
    ok "yt-dlp versão: $YTDLP_VERSION"
else
    fail "Não foi possível obter a versão do yt-dlp."
fi

# --------------------------------------------------
# Estrutura
# --------------------------------------------------

mkdir -p "$CONFIG_DIR"

chmod 700 "$CONFIG_DIR"

ok "Diretório criado: config/yt-dlp"

# --------------------------------------------------
# .gitignore
# --------------------------------------------------

touch "$GITIGNORE"

if ! grep -qxF "config/yt-dlp/cookies.txt" "$GITIGNORE"; then
    printf '\n# YouTube authentication cookies\nconfig/yt-dlp/cookies.txt\n' >> "$GITIGNORE"
    ok "cookies.txt protegido no .gitignore"
else
    ok "cookies.txt já está protegido no .gitignore"
fi

# --------------------------------------------------
# .env
# --------------------------------------------------

touch "$ENV_FILE"

add_env() {
    local key="$1"
    local value="$2"

    if ! grep -qE "^${key}=" "$ENV_FILE"; then
        printf '%s=%s\n' "$key" "$value" >> "$ENV_FILE"
    fi
}

add_env "YTDLP_COOKIES" "./config/yt-dlp/cookies.txt"
add_env "YTDLP_NODE_PATH" "$NODE_BIN"

ok ".env configurado"

# --------------------------------------------------
# Cookies
# --------------------------------------------------

if [ ! -f "$COOKIE_FILE" ]; then

    printf '\n'
    printf '┌──────────────────────────────────────────────┐\n'
    printf '│ Cookies do YouTube não encontrados           │\n'
    printf '└──────────────────────────────────────────────┘\n\n'

    printf 'Coloque seu arquivo cookies.txt em:\n\n'
    printf '  %s\n\n' "$COOKIE_FILE"

    printf 'O arquivo NÃO será criado automaticamente,\n'
    printf 'porque ele contém credenciais da sua sessão.\n\n'

    printf 'Depois execute novamente:\n\n'
    printf '  ./setup-youtube.sh\n\n'

    exit 0
fi

chmod 600 "$COOKIE_FILE"

ok "cookies.txt encontrado"
ok "Permissões dos cookies ajustadas para 600"

# --------------------------------------------------
# Verificação básica do cookies.txt
# --------------------------------------------------

if [ ! -s "$COOKIE_FILE" ]; then
    fail "cookies.txt existe, mas está vazio."
fi

if ! head -n 20 "$COOKIE_FILE" | grep -qE '(^# Netscape HTTP Cookie File|^[^#[:space:]]+[[:space:]]+TRUE[[:space:]]+)'; then
    printf '\n[WARNING] O arquivo não parece estar no formato Netscape cookies.txt.\n'
    printf '[WARNING] Verifique a exportação dos cookies.\n'
else
    ok "Formato de cookies reconhecido"
fi

# --------------------------------------------------
# Teste yt-dlp
# --------------------------------------------------

TMP_FILE="$(mktemp)"

cleanup() {
    rm -f "$TMP_FILE"
}

trap cleanup EXIT

printf '\n'
printf '────────────────────────────────────────────────\n'
printf ' Testando acesso ao YouTube\n'
printf '────────────────────────────────────────────────\n\n'

yt-dlp \
    --cookies "$COOKIE_FILE" \
    --js-runtimes "node:$NODE_BIN" \
    --no-playlist \
    --dump-json \
    "$TEST_URL" \
    > "$TMP_FILE" \
    2> "$TMP_FILE.error"

STATUS=$?

if [ "$STATUS" -ne 0 ]; then

    printf '\n[ERROR] O yt-dlp não conseguiu acessar o vídeo.\n\n'

    printf 'Principais informações:\n\n'

    grep -Ei \
        '429|403|LOGIN_REQUIRED|bot|PO Token|Visitor Data|ERROR|WARNING' \
        "$TMP_FILE.error" \
        | head -n 40 \
        || cat "$TMP_FILE.error"

    printf '\n'
    printf 'Teste completo salvo temporariamente durante a execução.\n'

    exit "$STATUS"
fi

# --------------------------------------------------
# Resultado
# --------------------------------------------------

if ! command -v jq >/dev/null 2>&1; then
    printf '\n[ OK ] yt-dlp conseguiu acessar o vídeo.\n'
    printf '[INFO] jq não instalado; mostrando JSON bruto:\n\n'
    cat "$TMP_FILE"
    exit 0
fi

printf '\n'
printf '╭──────────────────────────────────────────────╮\n'
printf '│          YouTube funcionando                 │\n'
printf '╰──────────────────────────────────────────────╯\n\n'

jq '{
    id,
    title,
    uploader,
    channel,
    duration,
    webpage_url
}' "$TMP_FILE"

printf '\n[ OK ] Autenticação do yt-dlp funcionando.\n'
printf '[ OK ] Node.js runtime funcionando.\n'
printf '[ OK ] Cookies carregados.\n'
printf '[ OK ] YouTube respondeu corretamente.\n'

printf '\nPróximo passo:\n'
printf 'integrar essa configuração ao YouTubeInfoService,\n'
printf 'YouTubeAudioService e YouTubeVideoService.\n\n'
