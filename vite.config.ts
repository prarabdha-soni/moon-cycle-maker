import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import type { IncomingMessage, ServerResponse } from "node:http";

const SYSTEM_PROMPT = `You are Petal AI, a knowledgeable and empathetic women's health and cycle coach. You help users understand their menstrual cycle, hormonal health, fertility, pregnancy, nutrition, and overall wellbeing.

Guidelines:
- Keep responses concise (2–4 sentences) and warm
- Be evidence-based but easy to understand
- Use 1 relevant emoji per response
- Never diagnose or prescribe — always recommend consulting a healthcare provider for medical concerns
- You can reference cycle phases (Period, Follicular, Fertile window, Ovulation, Luteal) when relevant`;

/**
 * Dev-only Vite plugin that handles /api/chat locally so you can run
 * `npm run dev` without needing `vercel dev` or a separate server.
 * Reads DEEPSEEK_API_KEY from .env automatically.
 */
function devApiPlugin(apiKey: string): Plugin {
  return {
    name: "dev-api-chat",
    configureServer(server) {
      server.middlewares.use(
        "/api/chat",
        (req: IncomingMessage, res: ServerResponse) => {
          res.setHeader("Content-Type", "application/json");
          res.setHeader("Access-Control-Allow-Origin", "*");

          if (req.method === "OPTIONS") {
            res.statusCode = 204;
            res.end();
            return;
          }

          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end(JSON.stringify({ error: "Method not allowed" }));
            return;
          }

          if (!apiKey || apiKey === "your_deepseek_api_key_here") {
            res.statusCode = 500;
            res.end(
              JSON.stringify({
                error:
                  "Add your DeepSeek API key to .env as DEEPSEEK_API_KEY and restart the dev server.",
              }),
            );
            return;
          }

          // Collect the POST body chunks
          const chunks: Buffer[] = [];
          req.on("data", (chunk: Buffer) => chunks.push(chunk));
          req.on("end", () => {
            void (async () => {
              try {
                const body = JSON.parse(
                  Buffer.concat(chunks).toString(),
                ) as {
                  messages: { role: string; content: string }[];
                };

                const upstream = await fetch(
                  "https://api.deepseek.com/v1/chat/completions",
                  {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                      Authorization: `Bearer ${apiKey}`,
                    },
                    body: JSON.stringify({
                      model: "deepseek-chat",
                      messages: [
                        { role: "system", content: SYSTEM_PROMPT },
                        ...body.messages,
                      ],
                      max_tokens: 350,
                      temperature: 0.7,
                    }),
                  },
                );

                if (!upstream.ok) {
                  const errText = await upstream.text();
                  console.error("[dev-api] DeepSeek error:", errText);
                  res.statusCode = 502;
                  res.end(JSON.stringify({ error: "Upstream API error" }));
                  return;
                }

                const data = (await upstream.json()) as {
                  choices: { message: { content: string } }[];
                };
                const reply =
                  data.choices?.[0]?.message?.content ??
                  "I'm not sure — could you rephrase your question? 🌸";

                res.statusCode = 200;
                res.end(JSON.stringify({ reply }));
              } catch (err) {
                console.error("[dev-api] handler error:", err);
                res.statusCode = 500;
                res.end(JSON.stringify({ error: "Internal error" }));
              }
            })();
          });
        },
      );
    },
  };
}

// Use the functional form of defineConfig so we can read .env before build
export default defineConfig(({ mode }) => {
  // Load all env vars (no prefix filter — we need DEEPSEEK_API_KEY which has no VITE_ prefix)
  const env = loadEnv(mode, process.cwd(), "");

  return {
    plugins: [
      react(),
      tailwindcss(),
      tsConfigPaths(),
      // Only active in development — no-op in production builds
      ...(mode === "development" ? [devApiPlugin(env.DEEPSEEK_API_KEY ?? "")] : []),
    ],
    base: "/",
    resolve: {
      alias: {
        "@": "/src",
      },
    },
    build: {
      // Raise the warning threshold so split chunks don't individually trigger false positives
      chunkSizeWarningLimit: 600,
      rollupOptions: {
        output: {
          /**
           * Split vendor code into separately-cacheable chunks.
           * After the first visit the browser caches vendor-*.js.
           * On the next deploy only the small app-*.js changes.
           * Result: repeat-visit JS download drops from ~525 KB to ~60–80 KB.
           */
          manualChunks(id) {
            if (!id.includes("node_modules")) return;
            if (id.includes("@tanstack")) return "vendor-tanstack";
            if (id.includes("lucide-react")) return "vendor-icons";
            return "vendor-react";
          },
        },
      },
    },
  };
});
