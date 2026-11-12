// Server locale: rigenera public/ a ogni richiesta della pagina e serve /api/prenota
// con la stessa funzione usata su Vercel. Uso: npm run dev  →  http://127.0.0.1:5500
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { build } from "./build.mjs";
import handler from "./api/prenota.js";

const PORT = Number(process.env.PORT) || 5500;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".jpg": "image/jpeg", ".png": "image/png", ".webp": "image/webp", ".json": "application/json" };
let out = await build();

createServer(async (req, res) => {
  const url = new URL(req.url, "http://x");
  if (url.pathname === "/api/prenota") {
    let raw = ""; for await (const ch of req) raw += ch;
    let body = {}; try { body = JSON.parse(raw || "{}"); } catch {}
    const shim = { statusCode: 200, setHeader: (k, v) => res.setHeader(k, v), status(c) { this.statusCode = c; return this; }, json(o) { res.writeHead(this.statusCode, { "Content-Type": "application/json" }); res.end(JSON.stringify(o)); } };
    await new Promise((r) => setTimeout(r, 600)); // simula la latenza di rete
    return handler({ method: req.method, body }, shim);
  }
  let p = url.pathname === "/" ? "/index.html" : url.pathname;
  if (p === "/index.html") out = await build();
  const file = normalize(join(out, p));
  if (!file.startsWith(out)) { res.writeHead(403); return res.end(); }
  try {
    const data = await readFile(file);
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream", "Cache-Control": "no-store" });
    res.end(data);
  } catch { res.writeHead(404); res.end("Not found"); }
}).listen(PORT, "127.0.0.1", () => console.log(`Landing su http://127.0.0.1:${PORT}`));
