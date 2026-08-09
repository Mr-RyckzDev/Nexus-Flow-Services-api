#!/usr/bin/env bash

OUTPUT="api_source.txt"

echo "Gerando ficha técnica da Nexus Flow API..."

{
    echo "============================================================"
    echo "             NEXUS FLOW SERVICES API"
    echo "              COMPLETE TECHNICAL AUDIT"
    echo "============================================================"
    echo
    echo "Generated: $(date '+%Y-%m-%d %H:%M:%S')"
    echo "Root: $(pwd)"
    echo

    echo "============================================================"
    echo "1. PROJECT STRUCTURE"
    echo "============================================================"

    find . -maxdepth 4 -type d \
        ! -path './node_modules*' \
        ! -path './.git*' \
        ! -path './Temp*' \
        ! -path './src/Temp*' \
        | sort

    echo
    echo "============================================================"
    echo "2. PROJECT FILES"
    echo "============================================================"

    find . -maxdepth 4 -type f \
        ! -path './node_modules/*' \
        ! -path './.git/*' \
        ! -path './Temp/*' \
        ! -path './src/Temp/*' \
        ! -name '.env' \
        ! -name 'cookies.txt' \
        | sort

    echo
    echo "============================================================"
    echo "3. PACKAGE.JSON"
    echo "============================================================"

    cat package.json 2>/dev/null || true

    echo
    echo "============================================================"
    echo "4. ROOT INDEX.JS"
    echo "============================================================"

    cat index.js 2>/dev/null || true

    echo
    echo "============================================================"
    echo "5. SOURCE CODE"
    echo "============================================================"

    find src config \
        -type f \
        ! -path '*/Temp/*' \
        ! -name '.env' \
        ! -name 'cookies.txt' \
        | sort |
    while IFS= read -r file; do

        case "$file" in
            *.js|*.json|*.mjs|*.cjs)
                ;;
            *)
                continue
                ;;
        esac

        echo
        echo
        echo "------------------------------------------------------------"
        echo "FILE: $file"
        echo "SIZE: $(wc -c < "$file") bytes"
        echo "LINES: $(wc -l < "$file")"
        echo "------------------------------------------------------------"

        cat "$file"

    done

    echo
    echo "============================================================"
    echo "6. IMPORT / REQUIRE MAP"
    echo "============================================================"

    grep -RInE \
        "require[[:space:]]*\\(|from[[:space:]]+['\"]|import[[:space:]]+" \
        src index.js \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "7. EXPORT MAP"
    echo "============================================================"

    grep -RInE \
        "module\\.exports|exports\\.|export[[:space:]]+default|export[[:space:]]*\\{" \
        src index.js \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "8. ROUTE MAP"
    echo "============================================================"

    grep -RInE \
        "router\\.(get|post|put|patch|delete|use)|app\\.(get|post|put|patch|delete|use)|Router\\(" \
        src \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "9. HTTP ENDPOINTS / PATHS"
    echo "============================================================"

    grep -RInE \
        "['\"][^'\"]*/(health|youtube|api|v1)[^'\"]*['\"]" \
        src \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "10. CONTROLLERS"
    echo "============================================================"

    find src/Controllers -type f 2>/dev/null | sort

    grep -RInE \
        "class |async |function |=>|module\\.exports" \
        src/Controllers \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "11. SERVICES"
    echo "============================================================"

    find src/Services -type f 2>/dev/null | sort

    grep -RInE \
        "class |async |function |=>|module\\.exports" \
        src/Services \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "12. MIDDLEWARES"
    echo "============================================================"

    find src/Middlewares -type f 2>/dev/null | sort

    grep -RInE \
        "module\\.exports|async |function |next\\(|req\\.|res\\." \
        src/Middlewares \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "13. CLIENT MANAGEMENT"
    echo "============================================================"

    find src/Clients -type f 2>/dev/null | sort

    grep -RInE \
        "class |async |function |=>|module\\.exports|apiKey|client|limit|usage" \
        src/Clients \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "14. BOOTSTRAP"
    echo "============================================================"

    find src/Bootstrap -type f 2>/dev/null | sort

    grep -RInE \
        "class |async |function |initialize|capabilit|dependency|environment|module\\.exports" \
        src/Bootstrap \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "15. CONFIGURATION"
    echo "============================================================"

    cat src/Config.js 2>/dev/null || true

    echo
    echo "Environment references:"
    grep -RInE \
        "process\\.env|dotenv" \
        src index.js \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "16. CACHE"
    echo "============================================================"

    find src/Cache -type f 2>/dev/null | sort

    grep -RInE \
        "cache|Cache|ttl|TTL|set\\(|get\\(|delete\\(|clear\\(" \
        src/Cache \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "17. MEDIA PIPELINE"
    echo "============================================================"

    find src/Media -type f 2>/dev/null | sort

    grep -RInE \
        "ffmpeg|ffprobe|stream|audio|video|convert|pipe|Media" \
        src/Media src/Services \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "18. YOUTUBE PIPELINE"
    echo "============================================================"

    find src/Services/Youtube -type f 2>/dev/null | sort

    grep -RInEi \
        "youtube|yt-dlp|yt_search|yt-search|ffmpeg|audio|video|info|search|stream" \
        src \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "19. ERROR SYSTEM"
    echo "============================================================"

    find src/Errors -type f 2>/dev/null | sort

    grep -RInE \
        "Error|error|status|code|message|throw|catch" \
        src/Errors src/Middlewares \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "20. RESPONSE FORMATTER"
    echo "============================================================"

    cat src/Utils/responseFormatter.js 2>/dev/null || true

    echo
    echo "============================================================"
    echo "21. LOGGER SYSTEM"
    echo "============================================================"

    find src/Utils -type f 2>/dev/null | sort

    grep -RInEi \
        "logger|console\\.log|console\\.error|console\\.warn|info|error|debug|banner|separator" \
        src/Utils src/Middlewares \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "22. SECURITY"
    echo "============================================================"

    grep -RInEi \
        "helmet|cors|api.?key|authorization|bearer|token|rate.?limit|auth|security|sanitize|validation" \
        src index.js \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "23. RATE LIMITING"
    echo "============================================================"

    find src/Middlewares -type f 2>/dev/null | grep -Ei \
        "rate|limit|throttle" || true

    grep -RInEi \
        "rateLimit|rate.?limit|windowMs|max:|limit:" \
        src \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "24. TIMEOUTS"
    echo "============================================================"

    grep -RInEi \
        "timeout|setTimeout|AbortController|signal" \
        src index.js \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "25. EXTERNAL DEPENDENCIES"
    echo "============================================================"

    grep -RInE \
        "require\\(['\"][^./][^'\"]*['\"]\\)" \
        src index.js \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "26. EXTERNAL URLS"
    echo "============================================================"

    grep -RInE \
        "https?://|http://|www\\." \
        src config \
        --include="*.js" \
        --include="*.json" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "27. FILESYSTEM / TEMPORARY DATA"
    echo "============================================================"

    grep -RInE \
        "fs\\.|readFile|writeFile|existsSync|mkdir|readdir|unlink|path\\.|Temp|temp|temporary" \
        src index.js \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "28. FUNCTIONS / CLASSES"
    echo "============================================================"

    grep -RInE \
        "class[[:space:]]|function[[:space:]]|async[[:space:]]+function|=>[[:space:]]*\\{" \
        src index.js \
        --include="*.js" \
        2>/dev/null || true

    echo
    echo "============================================================"
    echo "29. API BOOT FLOW"
    echo "============================================================"

    echo "index.js"
    echo "  -> Config"
    echo "  -> ClientStore"
    echo "  -> TempManager"
    echo "  -> Logger"
    echo "  -> SystemCapabilities"
    echo "  -> src/api.js"
    echo "  -> Routes"
    echo "  -> Controllers"
    echo "  -> Services"
    echo "  -> External dependencies"

    echo
    echo "============================================================"
    echo "30. GITIGNORE"
    echo "============================================================"

    cat .gitignore 2>/dev/null || true

    echo
    echo "============================================================"
    echo "31. END OF AUDIT"
    echo "============================================================"

} > "$OUTPUT"

echo
echo "============================================================"
echo "✓ NEXUS API AUDIT CONCLUÍDA"
echo "============================================================"
echo "Arquivo: $OUTPUT"
echo "Tamanho: $(du -h "$OUTPUT" | cut -f1)"
echo "Linhas:  $(wc -l < "$OUTPUT")"
echo "============================================================"
