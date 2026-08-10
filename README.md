<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=4b0082&height=250&section=header&text=Nexus%20Flow%20API&fontSize=60&fontColor=b19cd9&animation=fadeIn&desc=O%20Motor%20Sombrio%20e%20Poderoso%20para%20seus%20Bots&descAlignY=70&descAlign=50"/>
</div>

<h1 align="center">🌌 Nexus Flow Services API 🔮</h1>

<div align="center">
  <a href="#"><img src="https://img.shields.io/badge/Status-Em%20Desenvolvimento-8A2BE2?style=for-the-badge&logo=codeforces&logoColor=white" alt="Status"></a>
  <a href="#"><img src="https://img.shields.io/badge/Node.js-Dark%20Magic-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"></a>
  <a href="#"><img src="https://img.shields.io/badge/Autor-Ryckz%20dev.!-4b0082?style=for-the-badge&logo=github&logoColor=white" alt="Autor"></a>
</div>

<br/>

> *"Neste mundo, quem domina a informação, domina a magia. A Nexus Flow é o grimório que seu bot precisava."* 👾✨

Bem-vindo(a) à documentação oficial da **Nexus Flow Services API**. 
Criada com uma estética *Dark Tech & Anime*, esta API foi forjada nas sombras para ser o verdadeiro "pau para toda obra" dos seus projetos. O objetivo? **Fazer todo o trabalho pesado para que seus bots (WhatsApp, Discord, Telegram) apenas recebam o resultado perfeitamente processado.**

Atualmente com foco em processamento de mídia (YouTube, Áudio, Vídeo), a API expandirá seu domínio para IA, Sistemas de RPG e muito mais.

---

## 🖤 Sumário
- [🔮 O Que é a Nexus Flow?](#-o-que-é-a-nexus-flow)
- [⚙️ Como Foi Desenvolvida](#-como-foi-desenvolvida)
- [⛩️ Arquitetura e Fluxo](#-arquitetura-e-fluxo)
- [🔑 Autenticação](#-autenticação)
- [📜 Rotas e Endpoints (Grimório)](#-rotas-e-endpoints-grimório)
- [💻 Uso na Prática (Para Bots)](#-uso-na-prática-para-bots)
- [👤 Autor](#-autor)

---

## 🔮 O Que é a Nexus Flow?
A Nexus Flow é uma API RESTful de alta performance focada em centralizar serviços complexos. Se você desenvolve bots, sabe como é frustrante lidar com *yt-dlp*, *FFmpeg*, conversão de streams e limites de memória. 
A Nexus Flow puxa essa responsabilidade para si: você envia uma URL, ela processa o áudio/vídeo em segundo plano, gerencia a concorrência, limitações de hardware e devolve um *stream* limpo direto para o seu cliente.

**O que ela resolve?**
- Download e processamento de mídias (YouTube).
- (Em breve) Integrações com IAs (Gemini, ChatGPT).
- (Em breve) Sistemas complexos de RPG para bots (dados, fichas, economia).

---

## ⚙️ Como Foi Desenvolvida
Desenvolvida em **Node.js (Express)**, a API possui um design robusto focado em estabilidade e segurança:
- **Segurança Sombria:** Utiliza `Helmet` para proteção de cabeçalhos, `CORS` restrito e `express-rate-limit` para evitar que bots invasores drenem sua mana (DDoS).
- **Gerenciamento de Dependências:** O sistema de `SystemCapabilities` verifica ativamente se o hospedeiro possui os artefatos necessários (`yt-dlp`, `ffmpeg`, `ffprobe`) antes de liberar as rotas.
- **Isolamento de Erros:** Middleware dedicado para `asyncHandler` e formatação padronizada de respostas garantem que, mesmo quando uma magia falha, o erro seja compreensível (JSON limpo).
- **Controle de Sessão:** Gerenciamento de chaves API (`KeyManager` e `UsageTracker`) para limitar requisições e isolar clientes.

---

## ⛩️ Arquitetura e Fluxo

O fluxo de chakra (dados) da aplicação segue o padrão de **Camadas Múltiplas (N-Tier)**:

1. **Client (Seu Bot) 🤖** -> Faz uma requisição com o `x-api-key`.
2. **Gateway (Middlewares) 🛡️** -> Passa pelo `RateLimiter`, ganha um `Request ID` único (para rastreio via Logger), valida o limite de timeout (120s) e autentica a API Key.
3. **Controller 🕹️** -> Valida os parâmetros básicos (ex: `?url=...`).
4. **Service 🧠** -> O coração lógico. Valida durações máximas, checa o Cache (`CacheManager`) e enfileira o processo (`ConcurrencyManager`) para não explodir o servidor.
5. **Media Stream 🎞️** -> Usa Child Processes (`yt-dlp` via pipe para `FFmpeg`) gerando um arquivo temporário (`TempManager`) ou stream, enviando os buffers diretamente para a resposta HTTP (`streamToResponse`) enquanto limpa os rastros do servidor.

---

## 🔑 Autenticação

Para adentrar os portões da Nexus, você precisa do seu selo de autorização.
Todas as rotas (exceto o `/health`) exigem um cabeçalho (Header) com a sua API Key.

**Header Obrigatório:**
```http
x-api-key: nexus-default-key-123
```

---

## 📜 Rotas e Endpoints (Grimório)

*A base URL padrão (prefixo) é `/api/v1`.*

### 🩺 Sistema
| Método | Endpoint | Descrição | Auth |
| :--- | :--- | :--- | :---: |
| `GET` | `/health` | Verifica o pulso da API, uptime e ambiente operacional. | ❌ |

### 🎬 YouTube Services
| Método | Endpoint | Parâmetros (Query) | Descrição | Auth |
| :--- | :--- | :--- | :--- | :---: |
| `GET` | `/youtube/search` | `q` (string) | Retorna os 5-10 primeiros resultados de busca do YouTube. | ✅ |
| `GET` | `/youtube/info` | `url` (string) | Extrai os metadados mágicos (título, thumb, views) de um vídeo. (Usa Cache). | ✅ |
| `GET` | `/youtube/audio` | `url` (string) | Transmuta o vídeo em um **Stream de Áudio (.mp3)** limpo. | ✅ |
| `GET` | `/youtube/video` | `url` (string), `quality` (360, 720) | Retorna o **Stream de Vídeo (.mp4)** mesclado (Áudio + Vídeo). | ✅ |

---

## 💻 Uso na Prática (Para Bots)

Aqui está um exemplo de como invocar a magia da API usando **JavaScript (Node.js/Axios)**, ideal para bots de WhatsApp (como *Baileys* ou *WPPConnect*) ou bots de Discord.

### Exemplo: Comando `/play` (Baixando Áudio do YouTube)

```javascript
const axios = require('axios');
const fs = require('fs');

async function baixarAudioParaBot(videoUrl) {
    const API_URL = 'http://localhost:3000/api/v1/youtube/audio';
    const API_KEY = 'nexus-default-key-123'; // Sua chave sombria

    try {
        console.log('🌌 [Nexus Flow] Invocando stream de áudio...');
        
        const response = await axios({
            method: 'GET',
            url: API_URL,
            params: { url: videoUrl },
            headers: { 'x-api-key': API_KEY },
            responseType: 'stream' // CRÍTICO: Não baixe para a memória RAM!
        });

        const caminhoArquivo = './temp_audio_bot.mp3';
        const writer = fs.createWriteStream(caminhoArquivo);

        response.data.pipe(writer);

        return new Promise((resolve, reject) => {
            writer.on('finish', () => {
                console.log('✨ Áudio materializado com sucesso!');
                // Aqui você envia o caminhoArquivo para o WhatsApp/Discord
                resolve(caminhoArquivo);
            });
            writer.on('error', reject);
        });

    } catch (error) {
        console.error('❌ Falha ao conjurar áudio:', error.response?.data || error.message);
    }
}

// Uso:
// baixarAudioParaBot('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
```

---

## 🛡️ Respostas de Erro
A API usa um padrão claro. Se sua magia falhar, você receberá algo assim:
```json
{
  "success": false,
  "status": 403,
  "message": "API Key inválida ou sem permissão",
  "error": {
    "code": "FORBIDDEN"
  }
}
```

---

## 👤 Autor

<div align="center">
    <img src="https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif" width="150" style="border-radius: 50%; box-shadow: 0 0 15px #8A2BE2;">
    <h3>Ryckz dev.!</h3>
    <p><i>"Transformando café e caos em infraestrutura perfeita."</i> ☕💜💻</p>
</div>
