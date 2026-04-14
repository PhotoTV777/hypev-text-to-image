const MODELS = [
	{ id: "@cf/stabilityai/stable-diffusion-xl-base-1.0", label: "Stable Diffusion XL" },
	{ id: "@cf/bytedance/stable-diffusion-xl-lightning", label: "SDXL Lightning (Fast)" },
	{ id: "@cf/lykon/dreamshaper-8-lcm", label: "DreamShaper 8 LCM" },
	{ id: "@cf/runwayml/stable-diffusion-v1-5-inpainting", label: "Stable Diffusion 1.5" },
];

const HTML = `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Text to Image · Hypev AI</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --bg: #0a0a0f;
      --surface: #12121a;
      --surface2: #1a1a26;
      --border: #2a2a3d;
      --accent: #7c6af7;
      --accent2: #a78bfa;
      --text: #e8e8f0;
      --muted: #8888aa;
      --radius: 14px;
      --shadow: 0 8px 40px rgba(124,106,247,0.15);
    }

    body {
      min-height: 100dvh;
      background: var(--bg);
      color: var(--text);
      font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 2rem 1rem 4rem;
    }

    header {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: .5rem;
      margin-bottom: 2.5rem;
    }

    .logo {
      font-size: 2rem;
      font-weight: 800;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      letter-spacing: -1px;
    }

    header p {
      color: var(--muted);
      font-size: .95rem;
    }

    .card {
      width: 100%;
      max-width: 680px;
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.75rem;
      display: flex;
      flex-direction: column;
      gap: 1.25rem;
      box-shadow: var(--shadow);
    }

    label {
      font-size: .8rem;
      font-weight: 600;
      color: var(--muted);
      letter-spacing: .05em;
      text-transform: uppercase;
      display: block;
      margin-bottom: .4rem;
    }

    textarea {
      width: 100%;
      min-height: 110px;
      resize: vertical;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-size: 1rem;
      padding: .85rem 1rem;
      outline: none;
      transition: border-color .2s;
      font-family: inherit;
    }

    textarea:focus {
      border-color: var(--accent);
    }

    .row {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
    }

    .field { flex: 1; min-width: 160px; }

    select, input[type="number"] {
      width: 100%;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 10px;
      color: var(--text);
      font-size: .95rem;
      padding: .7rem 1rem;
      outline: none;
      transition: border-color .2s;
      font-family: inherit;
    }

    select:focus, input[type="number"]:focus {
      border-color: var(--accent);
    }

    select option { background: var(--surface2); }

    button#generateBtn {
      width: 100%;
      padding: .9rem;
      background: linear-gradient(135deg, var(--accent), var(--accent2));
      border: none;
      border-radius: 10px;
      color: #fff;
      font-size: 1.05rem;
      font-weight: 700;
      cursor: pointer;
      transition: opacity .2s, transform .1s;
      letter-spacing: .02em;
    }

    button#generateBtn:hover:not(:disabled) { opacity: .88; }
    button#generateBtn:active:not(:disabled) { transform: scale(.98); }
    button#generateBtn:disabled { opacity: .5; cursor: not-allowed; }

    .result-area {
      width: 100%;
      max-width: 680px;
      margin-top: 1.75rem;
      display: none;
    }

    .result-area.visible { display: block; }

    .skeleton {
      width: 100%;
      aspect-ratio: 1 / 1;
      background: linear-gradient(90deg, var(--surface) 25%, var(--surface2) 50%, var(--surface) 75%);
      background-size: 200% 100%;
      animation: shimmer 1.4s infinite;
      border-radius: var(--radius);
      border: 1px solid var(--border);
    }

    @keyframes shimmer {
      0% { background-position: 200% 0; }
      100% { background-position: -200% 0; }
    }

    .image-wrapper {
      position: relative;
      border-radius: var(--radius);
      overflow: hidden;
      border: 1px solid var(--border);
      box-shadow: var(--shadow);
    }

    .image-wrapper img {
      width: 100%;
      display: block;
    }

    .image-actions {
      display: flex;
      gap: .75rem;
      margin-top: .9rem;
    }

    .btn-secondary {
      flex: 1;
      padding: .65rem 1rem;
      background: var(--surface2);
      border: 1px solid var(--border);
      border-radius: 9px;
      color: var(--text);
      font-size: .9rem;
      font-weight: 600;
      cursor: pointer;
      transition: border-color .2s, background .2s;
      text-align: center;
      text-decoration: none;
      display: inline-block;
    }

    .btn-secondary:hover { border-color: var(--accent); background: var(--surface); }

    .error-box {
      background: rgba(239, 68, 68, .12);
      border: 1px solid rgba(239, 68, 68, .4);
      color: #fca5a5;
      border-radius: 10px;
      padding: .85rem 1rem;
      font-size: .9rem;
      display: none;
    }

    .error-box.visible { display: block; }

    .badge {
      display: inline-block;
      background: rgba(124,106,247,.18);
      color: var(--accent2);
      border-radius: 6px;
      padding: .1rem .5rem;
      font-size: .72rem;
      font-weight: 700;
      vertical-align: middle;
      margin-left: .35rem;
      letter-spacing: .04em;
    }

    .prompt-meta {
      font-size: .78rem;
      color: var(--muted);
      margin-top: .4rem;
    }

    footer {
      margin-top: 3rem;
      color: var(--muted);
      font-size: .8rem;
      text-align: center;
    }

    footer a { color: var(--accent2); text-decoration: none; }
    footer a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <div class="logo">Hypev AI</div>
    <p>Generuj obrazy z tekstu za pomocą Workers AI</p>
  </header>

  <div class="card">
    <div>
      <label for="prompt">Prompt <span class="badge">PL / EN</span></label>
      <textarea id="prompt" placeholder="np. cyberpunkowy kot w neonowym mieście, fotorealistyczny, 4K…"></textarea>
      <div class="prompt-meta">Opisz obraz szczegółowo — im więcej detali, tym lepszy wynik.</div>
    </div>

    <div class="row">
      <div class="field">
        <label for="model">Model AI</label>
        <select id="model">
          ${MODELS.map(m => `<option value="${m.id}">${m.label}</option>`).join("\n          ")}
        </select>
      </div>
      <div class="field">
        <label for="steps">Kroki (steps)</label>
        <input type="number" id="steps" value="20" min="1" max="50" />
      </div>
    </div>

    <div id="errorBox" class="error-box"></div>

    <button id="generateBtn" type="button">Generuj obraz</button>
  </div>

  <div class="result-area" id="resultArea">
    <div class="skeleton" id="skeleton" style="display:none"></div>
    <div class="image-wrapper" id="imageWrapper" style="display:none">
      <img id="generatedImg" alt="Wygenerowany obraz" />
    </div>
    <div class="image-actions" id="imageActions" style="display:none">
      <a id="downloadLink" class="btn-secondary" download="hypev-image.png">Pobierz PNG</a>
      <button class="btn-secondary" id="copyPromptBtn" type="button">Kopiuj prompt</button>
    </div>
  </div>

  <footer>
    Powered by <a href="https://developers.cloudflare.com/workers-ai/" target="_blank">Cloudflare Workers AI</a>
  </footer>

  <script>
    const btn = document.getElementById('generateBtn');
    const promptEl = document.getElementById('prompt');
    const modelEl = document.getElementById('model');
    const stepsEl = document.getElementById('steps');
    const resultArea = document.getElementById('resultArea');
    const skeleton = document.getElementById('skeleton');
    const imageWrapper = document.getElementById('imageWrapper');
    const generatedImg = document.getElementById('generatedImg');
    const imageActions = document.getElementById('imageActions');
    const downloadLink = document.getElementById('downloadLink');
    const copyPromptBtn = document.getElementById('copyPromptBtn');
    const errorBox = document.getElementById('errorBox');

    let lastPrompt = '';

    btn.addEventListener('click', async () => {
      const prompt = promptEl.value.trim();
      if (!prompt) { showError('Wpisz prompt przed generowaniem.'); return; }

      lastPrompt = prompt;
      hideError();
      setLoading(true);

      resultArea.classList.add('visible');
      skeleton.style.display = 'block';
      imageWrapper.style.display = 'none';
      imageActions.style.display = 'none';

      try {
        const res = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            prompt,
            model: modelEl.value,
            steps: Number(stepsEl.value),
          }),
        });

        if (!res.ok) {
          const err = await res.json().catch(() => ({ error: 'Nieznany błąd' }));
          throw new Error(err.error || \`HTTP \${res.status}\`);
        }

        const blob = await res.blob();
        const url = URL.createObjectURL(blob);
        generatedImg.src = url;
        downloadLink.href = url;

        skeleton.style.display = 'none';
        imageWrapper.style.display = 'block';
        imageActions.style.display = 'flex';
      } catch (e) {
        skeleton.style.display = 'none';
        resultArea.classList.remove('visible');
        showError('Błąd: ' + e.message);
      } finally {
        setLoading(false);
      }
    });

    copyPromptBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(lastPrompt).then(() => {
        copyPromptBtn.textContent = 'Skopiowano!';
        setTimeout(() => { copyPromptBtn.textContent = 'Kopiuj prompt'; }, 1800);
      });
    });

    function setLoading(val) {
      btn.disabled = val;
      btn.textContent = val ? 'Generowanie…' : 'Generuj obraz';
    }

    function showError(msg) {
      errorBox.textContent = msg;
      errorBox.classList.add('visible');
    }

    function hideError() {
      errorBox.classList.remove('visible');
    }
  </script>
</body>
</html>`;

export default {
	async fetch(request: Request, env: Env): Promise<Response> {
		const url = new URL(request.url);

		// Serve HTML UI
		if (request.method === "GET" && url.pathname === "/") {
			return new Response(HTML, {
				headers: { "content-type": "text/html;charset=UTF-8" },
			});
		}

		// Image generation API
		if (request.method === "POST" && url.pathname === "/api/generate") {
			let body: { prompt?: string; model?: string; steps?: number };
			try {
				body = await request.json();
			} catch {
				return Response.json({ error: "Invalid JSON body" }, { status: 400 });
			}

			const prompt = (body.prompt ?? "").trim();
			if (!prompt) {
				return Response.json({ error: "Prompt is required" }, { status: 400 });
			}

			const model = MODELS.some(m => m.id === body.model)
				? body.model!
				: MODELS[0].id;

			const steps = Math.min(Math.max(Number(body.steps) || 20, 1), 50);

			try {
				const response = await (env.AI as any).run(model, { prompt, num_steps: steps });
				return new Response(response, {
					headers: { "content-type": "image/png" },
				});
			} catch (err: any) {
				const msg = err?.message ?? "AI generation failed";
				return Response.json({ error: msg }, { status: 500 });
			}
		}

		return new Response("Not Found", { status: 404 });
	},
} satisfies ExportedHandler<Env>;
