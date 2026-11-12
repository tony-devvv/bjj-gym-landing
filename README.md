# AnacondaBJJ Academy — landing "Prova gratuita"

Landing a singola conversione: prenotare la lezione di prova (form o WhatsApp).

## Struttura (9 blocchi, in quest'ordine)

| # | Blocco | Template | Contenuto |
|---|---|---|---|
| 1 | Attenzione | 016 | Hero + riga di prova sociale (cintura, principianti, recensioni Google) |
| 2 | Problema | 026 | 6 frasi in prima persona |
| 3 | Transizione | 033 | "Non è un fight club. / È una scuola per chi inizia." |
| 4 | Offer | 108 | Form di prenotazione + coach + corsi + WhatsApp |
| 5 | USP | 036 | Come succede spesso / Da AnacondaBJJ |
| 6 | Soluzione | 039 | I tre passaggi della prima lezione |
| 7 | Obiezioni | 088 | Tre paure, ognuna con una recensione come prova |
| 8 | CTA | 099 | Fascia verde finale |
| 9 | FAQ | 084 | 8 domande sempre aperte |

Ogni `<section>` ha un attributo `data-block` (es. `data-block="4-offer"`).

## Dove si modifica cosa

| File | Contenuto |
|---|---|
| `content.config.mjs` | **Tutti i dati del cliente** (nome, indirizzo, telefono, coach, prezzi, orari, recensioni, ID di tracciamento). I valori da sostituire sono marcati `// SEGNAPOSTO`. |
| `src/page.mjs` | Markup e testi delle sezioni, FAQ comprese (usate anche per il JSON-LD `FAQPage`). |
| `src/styles.css` | Stile e animazioni. Token dalle brand guidelines (`brand/`). |
| `src/main.js` | Comparse allo scroll, contatori, form, cookie banner, tracciamento, mappa. |
| `api/prenota.js` | Funzione Vercel: validazione lato server e inoltro della richiesta. |
| `src/privacy.html`, `src/cookie.html` | Testi legali **segnaposto**. |

`public/` è generata da `node build.mjs`: non va modificata a mano e non va nel repo.

## In locale

```bash
npm run dev
```

Apri http://127.0.0.1:5500. Il server rigenera la pagina a ogni ricarica e risponde anche su `/api/prenota`. Senza inoltro configurato, le richieste vengono solo stampate nel terminale.

Se il sistema ha "riduci movimento" attivo, le animazioni sono spente (è voluto). Per vederle comunque: http://127.0.0.1:5500/?motion=1

## Deploy su Vercel

1. Importa il repo su Vercel. `vercel.json` imposta la build (`node build.mjs`) e la cartella di output (`public`).
2. In *Settings → Environment Variables* aggiungi **una** di queste variabili:
   - `FORMSPREE_ENDPOINT`, per esempio `https://formspree.io/f/xxxxxxx`
   - `WEBHOOK_URL` (Make, Zapier, n8n, Google Apps Script…)
3. Aggiorna `gym.siteUrl` in `content.config.mjs` con il dominio finale (serve per canonical, Open Graph e JSON-LD).

## Tracciamento

Gli eventi `click_cta`, `form_submit` e `whatsapp_click` sono già collegati, ma partono solo se:

- l'utente accetta i cookie;
- `tracking.ga4Id` e/o `tracking.metaPixelId` sono compilati.

In locale gli eventi compaiono nella console del browser (`[track]`).

## Prima di pubblicare

- [ ] Sostituire tutti i `// SEGNAPOSTO` in `content.config.mjs`.
- [ ] Foto reali della palestra al posto di quelle di prova da Unsplash (hero e coach), in WebP/AVIF con dimensioni esplicite.
- [ ] Solo recensioni **reali**, poi `reviews.areExamples = false`: toglie le etichette "Esempio" e attiva `aggregateRating` nel JSON-LD.
- [ ] Privacy e Cookie Policy redatte dal consulente.
- [ ] Coordinate `gym.geo` corrette.
