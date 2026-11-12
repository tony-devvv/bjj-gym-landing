// Vercel Serverless Function: POST /api/prenota
// Valida la richiesta e la inoltra a UNO di questi servizi, se configurato
// nelle variabili d'ambiente del progetto Vercel:
//   FORMSPREE_ENDPOINT  es. https://formspree.io/f/xxxxxxx
//   WEBHOOK_URL         es. Make / Zapier / n8n / Google Apps Script
// Senza variabili la richiesta viene solo validata e registrata nei log (modalità bozza).
import { validateTrial } from "../lib/validate.mjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ message: "Metodo non consentito" });
  }
  let body = req.body;
  if (typeof body === "string") { try { body = JSON.parse(body); } catch { body = {}; } }

  const { ok, data, errors, spam } = validateTrial(body);
  if (spam) return res.status(200).json({ ok: true }); // honeypot: finto successo
  if (!ok) return res.status(422).json({ message: "Controlla i campi evidenziati.", errors });

  const payload = { ...data, source: "landing-prova-gratuita", receivedAt: new Date().toISOString() };
  const target = process.env.FORMSPREE_ENDPOINT || process.env.WEBHOOK_URL;
  try {
    if (target) {
      const r = await fetch(target, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(payload) });
      if (!r.ok) throw new Error("Inoltro fallito: " + r.status);
    } else {
      console.log("[prenota] modalità bozza, nessun inoltro configurato:", payload);
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[prenota]", err);
    return res.status(502).json({ message: "Servizio momentaneamente non disponibile." });
  }
}
