// Markup della landing. I dati del cliente arrivano da content.config.mjs.
// Struttura in 9 blocchi, uno per template wireframe, in quest'ordine:
//   1 Attenzione 016 · 2 Problema 026 · 3 Transizione 033 · 4 Offer 108 · 5 USP 036
//   6 Soluzione 039 · 7 Obiezioni 088 · 8 CTA 099 · 9 FAQ 084
// Topbar, header, footer ed elementi fissi stanno fuori dai blocchi.

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
const safeJson = (o) => JSON.stringify(o).replace(/</g, String.fromCharCode(92) + "u003c");

export function faqItems(c) {
  const { pricing, hours, competition } = c;
  const orari = hours.map((h) => `${h.label} ${h.value}`).join(", ");
  return [
    ["Devo avere esperienza?", "No. La lezione di prova è pensata per chi non ha mai messo piede su un tatami, e gli istruttori partono dal tuo livello."],
    ["Cosa devo portare?", "Tuta o pantaloncini senza zip, una maglietta, ciabatte e acqua. Sul tatami si sta scalzi. Il kimono per la prova te lo prestiamo noi."],
    ["Serve il certificato medico?", "Per la lezione di prova no. Per iscriverti serve il certificato per attività sportiva non agonistica, oppure quello agonistico se vuoi gareggiare."],
    ["Quanto costa dopo la prova?", `Gli abbonamenti partono da ${pricing.monthlyFrom} al mese, più il tesseramento annuale di ${pricing.yearlyMembership} che include l'assicurazione.`],
    ["Che corsi ci sono?", `Bambini 5–8 anni, ragazzi 9–14 e adulti dai 15 anni, con corsi Gi e No-Gi. Per chi vuole gareggiare (${competition.circuits}) c'è la squadra agonistica, su valutazione del coach.`],
    ["Quando sono le lezioni?", `${orari}. Alla prova ti diciamo quali orari sono giusti per il tuo corso.`],
    ["I genitori possono assistere?", "Sì, alla prima lezione puoi restare a bordo tatami per tutto il tempo."],
    ["Come prenoto?", "Compila il modulo su questa pagina oppure scrivici su WhatsApp. Ti rispondiamo entro 24 ore."],
  ];
}

const ICON = {
  wa: `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.3-.4.8-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.1-1.2l-.5-.3Z"/></svg>`,
  phone: `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M5 3h4l2 5-2.5 1.5a11 11 0 0 0 6 6L16 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 5a2 2 0 0 1 2-2Z"/></svg>`,
  pin: `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="2" d="M12 21s-7-6.2-7-12a7 7 0 0 1 14 0c0 5.8-7 12-7 12Z"/><circle cx="12" cy="9" r="2.5" fill="none" stroke="currentColor" stroke-width="2"/></svg>`,
  ig: `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor"/></svg>`,
  arrow: `<svg class="ic ic-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M5 12h13m-5-6 6 6-6 6" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
};

export function render(c) {
  const { gym, coach, reviews, hours, whatsapp, images } = c;
  const wa = `https://wa.me/${gym.phoneE164.replace(/\D/g, "")}?text=${encodeURIComponent(whatsapp.message)}`;
  const tel = `tel:${gym.phoneE164}`;
  const addr = `${gym.address.street}, ${gym.address.postalCode} ${gym.address.city}`;
  const maps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(gym.name + " " + addr)}`;
  const ig = `https://instagram.com/${gym.instagram}`;
  const unsplash = (src, w, h) => `${src}?auto=format&fit=crop&w=${w}${h ? `&h=${h}` : ""}&q=70`;
  const faq = faqItems(c);
  const year = new Date().getFullYear();
  const waAttrs = `href="${esc(wa)}" target="_blank" rel="noopener" data-track="whatsapp_click"`;
  const ctaAttrs = (loc) => `href="#prenota" data-track="click_cta" data-loc="${loc}"`;
  const R = reviews.items; // 0 Andrea (adulto), 1 Giulia (genitore), 2 Luca (ambiente)
  const proof = (r) => `<figure class="proof">
          <span class="proof-tag">${reviews.areExamples ? "Recensione d'esempio" : "Dalle recensioni"}</span>
          <blockquote>“${esc(r.text)}”</blockquote>
          <figcaption>${esc(r.author)}, ${esc(r.role)}</figcaption>
        </figure>`;

  // Blocco 2 · Problema (026): 6 frasi in prima persona
  const pains = [
    "Ho 38 anni e l'ultimo sport vero l'ho fatto al liceo.",
    "La sera torno stanco dal lavoro e finisco sul divano col telefono.",
    "Ho pagato l'annuale in palestra e ci sono andato tre volte.",
    "Dico che non ho tempo, ma in realtà non so da dove cominciare.",
    "Ho paura di entrare e trovarmi in mezzo a gente che picchia forte.",
    "Mio figlio è timido e vorrei uno sport dove si senta a suo agio.",
  ];

  // Blocco 5 · USP (036): voci agganciate una a una
  const usp = [
    ["Il primo giorno ti fanno combattere con chi si allena da anni.", "Per le prime settimane fai tecnica guidata, con un compagno del tuo livello."],
    ["Riscaldamento pensato per chi è già allenato.", "Riscaldamento al tuo ritmo: se ti serve una pausa, ti fermi."],
    ["Prima di provare devi comprare kimono e protezioni.", "Il kimono per la prova te lo prestiamo noi."],
    ["Alla prima visita ti propongono l'abbonamento annuale.", `Paghi mese per mese, da ${c.pricing.monthlyFrom}, più il tesseramento.`],
    ["Se chiedi qualcosa, la risposta è «lo capirai col tempo».", "Il coach ti spiega cosa stai facendo e perché funziona."],
  ];

  // Blocco 7 · Obiezioni (088)
  const objections = [
    {
      q: "Ho paura di farmi male, o di fare male a qualcuno.",
      p: [
        "È la paura più comune ed è comprensibile. Se l'unico jiu-jitsu che hai visto sono gli incontri su YouTube, sembra uno sport in cui ci si fa male. E c'è chi arriva da noi dopo una palestra dove il primo giorno l'hanno messo a fare sparring con un agonista.",
        "Nel Brazilian Jiu-Jitsu non ci sono pugni né calci. Si lavora con leve e controlli, e quando il compagno batte la mano l'esercizio si ferma subito: è la prima regola che impari. Le prime settimane sono di tecnica guidata. Lo sparring leggero arriva quando te la senti tu, non prima.",
      ],
      punch: "Sul tatami decide chi batte la mano. Dal primo giorno.",
      r: R[2],
    },
    {
      q: "Sono fuori forma, e alla mia età è tardi per cominciare.",
      p: [
        "Lo pensa quasi ogni adulto che entra per la prima volta. Ti immagini una sala di ventenni atletici e hai paura di fare brutta figura già al riscaldamento, o di restare indietro dopo dieci minuti.",
        "Nei corsi adulti c'è chi ha iniziato a 16 anni e chi a 50. Il riscaldamento lo fai al tuo ritmo e nessuno conta le tue ripetizioni. Il jiu-jitsu premia la tecnica più della forza: è il motivo per cui una persona più piccola e meno allenata riesce a controllarne una più grossa.",
      ],
      punch: "Non devi rimetterti in forma prima di venire. Ci pensa l'allenamento.",
      r: R[0],
    },
    {
      q: "Mio figlio è timido: non so se si troverà bene.",
      p: [
        "Molti genitori ce lo dicono già al telefono. Temono che un bambino riservato si blocchi davanti al gruppo, o che uno sport di contatto lo spaventi invece di aiutarlo.",
        "I corsi bambini (5–8 anni) e ragazzi (9–14) sono divisi per età e partono dal gioco: cadere, rotolare, muoversi in coppia. Le regole sono poche e chiare, e ognuno lavora con un compagno della sua taglia. I più timidi di solito si sciolgono quando scoprono che possono fermare tutto battendo la mano.",
      ],
      punch: "Alla prima lezione resti a bordo tatami e vedi con i tuoi occhi come lavoriamo.",
      r: R[1],
    },
  ];

  return `<!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<script>document.documentElement.classList.add('js');if(/[?&]motion=1/.test(location.search))document.documentElement.classList.add('fm');setTimeout(function(){document.documentElement.classList.add('loaded')},2500)</script>
<title>Lezione di prova gratuita di Brazilian Jiu-Jitsu a ${esc(gym.city)} | ${esc(gym.shortName)}</title>
<meta name="description" content="Prenota una lezione gratuita di BJJ a ${esc(gym.city)}. Corsi per bambini e adulti, qualsiasi livello. Non servono esperienza né attrezzatura.">
<link rel="canonical" href="${esc(gym.siteUrl)}/">
<meta name="theme-color" content="#0D110E">
<meta property="og:type" content="website">
<meta property="og:locale" content="it_IT">
<meta property="og:site_name" content="${esc(gym.name)}">
<meta property="og:title" content="Lezione di prova gratuita di Brazilian Jiu-Jitsu a ${esc(gym.city)} | ${esc(gym.shortName)}">
<meta property="og:description" content="Prenota una lezione gratuita di BJJ a ${esc(gym.city)}. Corsi per bambini e adulti, qualsiasi livello.">
<meta property="og:url" content="${esc(gym.siteUrl)}/">
<meta property="og:image" content="${esc(gym.siteUrl + images.og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/assets/anaconda-symbol.svg" type="image/svg+xml">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="preconnect" href="https://images.unsplash.com">
<link rel="preload" as="image" href="${unsplash(images.hero.src, 900)}" imagesrcset="${unsplash(images.hero.src, 900)} 900w, ${unsplash(images.hero.src, 1600)} 1600w, ${unsplash(images.hero.src, 2400)} 2400w" imagesizes="100vw" fetchpriority="high">
<link href="https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@600;700;800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css">
<script type="application/ld+json">${safeJson(c.__jsonld)}</script>
</head>
<body>
<a class="skip" href="#main">Vai al contenuto</a>

<div class="topbar">
  <div class="wrap topbar-in">
    <a href="${tel}" class="tb-item">${ICON.phone}<span>${esc(gym.phoneDisplay)}</span></a>
    <span class="tb-item tb-desk"><span class="dot" aria-hidden="true"></span>${esc(gym.openDaysShort)}</span>
    <a href="${esc(maps)}" target="_blank" rel="noopener" class="tb-item tb-desk">${ICON.pin}<span>${esc(addr)}</span></a>
  </div>
</div>

<header class="hdr" id="top">
  <div class="wrap hdr-in">
    <a href="#top" class="logo" aria-label="${esc(gym.name)}, torna su">
      <img src="/assets/anaconda-symbol.svg" width="44" height="44" alt="">
      <span class="logo-wm"><b>Anaconda<em>BJJ</em></b><small>Academy · Jiu Jitsu</small></span>
    </a>
    <a class="btn btn-lime btn-sm" ${ctaAttrs("header")}><span class="lg">Prenota la prova gratuita</span><span class="sm">Prova gratis</span></a>
  </div>
</header>

<main id="main">

<!-- ============ 1 · ATTENZIONE · template 016 ============ -->
<section class="hero dark" id="hero" aria-labelledby="hero-title" data-block="1-attenzione">
  <div class="hero-media">
    <img class="hero-img" src="${unsplash(images.hero.src, 1600)}" srcset="${unsplash(images.hero.src, 900)} 900w, ${unsplash(images.hero.src, 1600)} 1600w, ${unsplash(images.hero.src, 2400)} 2400w" sizes="100vw" width="${images.hero.width}" height="${images.hero.height}" alt="${esc(images.hero.alt)}" fetchpriority="high" decoding="async">
  </div>
  <div class="hero-veil" aria-hidden="true"></div>
  <div class="hero-scales" aria-hidden="true"></div>
  <div class="hero-spot" aria-hidden="true"></div>
  <div class="wrap h16">
    <p class="eyebrow-badge h-in" style="--d:0">Lezione di prova gratuita · Bambini e adulti · ${esc(gym.city)}</p>
    <h1 class="h16-title" id="hero-title">
      <span class="ln"><span class="ln-in" style="--d:1">Prova <span class="h16-mark">gratis</span> una lezione</span></span>
      <span class="ln"><span class="ln-in" style="--d:2">di Brazilian Jiu-Jitsu</span></span>
      <span class="ln"><span class="ln-in" style="--d:3">a ${esc(gym.city)}.</span></span>
    </h1>
    <svg class="snake-line" viewBox="0 0 600 40" aria-hidden="true" preserveAspectRatio="none"><path d="M6 24c60-26 110 18 180 2s110-24 180-6 120 16 228-8" pathLength="1"/></svg>
    <p class="h16-sub h-in" style="--d:4">La prima lezione è gratuita, a qualsiasi età e livello. Ti alleni con <strong>${esc(coach.name)}</strong>, ${esc(coach.rank.toLowerCase())}. Non servono esperienza né attrezzatura: vieni in tuta, al resto pensiamo noi.</p>
    <div class="h16-cta h-in" style="--d:5">
      <a class="btn btn-lime btn-lg" ${ctaAttrs("hero")}>Prenota la tua prova gratuita ${ICON.arrow}</a>
    </div>
    <p class="h16-note h-in" style="--d:6">Preferisci scriverci? <a class="link-wa" ${waAttrs}>${ICON.wa}Contattaci su WhatsApp</a></p>
  </div>
  <div class="wrap">
    <ul class="proofbar h-in" style="--d:7" aria-label="Perché fidarti">
      <li><b>${esc(coach.rank)}</b><span>${esc(coach.firstName)} insegna da <span class="count" data-to="${coach.yearsTeaching}">${coach.yearsTeaching}</span> anni ed è affiliato a ${esc(gym.affiliation)}.</span></li>
      <li><b>Pensato per chi inizia</b><span>Ogni lezione ha un percorso per i principianti. Nessuno ti butta nella mischia il primo giorno.</span></li>
      <li><b><span class="count" data-to="${reviews.ratingValue}" data-dec="1">${esc(reviews.rating)}</span><span class="gold-t">★</span> su Google</b><span><a href="${esc(reviews.googleUrl)}" target="_blank" rel="noopener"><span class="count" data-to="${reviews.count}">${reviews.count}</span> recensioni</a> di allievi e genitori della zona.</span></li>
    </ul>
  </div>
  <p class="credit">${esc(images.hero.credit || "")} · foto segnaposto</p>
</section>

<!-- ============ 2 · PROBLEMA · template 026 ============ -->
<section class="problem light" aria-labelledby="pb-title" data-block="2-problema">
  <div class="wrap">
    <div class="col26">
      <h2 class="h2 rv" id="pb-title">Ci pensi da mesi, ma non entri mai</h2>
      <p class="lead rv">Quasi tutti quelli che oggi si allenano da noi, prima di venire, si dicevano almeno una di queste frasi.</p>
      <ul class="pains">
        ${pains.map((p, i) => `<li class="rv" style="--rd:${i}"><span class="xr" aria-hidden="true">×</span><span class="say">${esc(p)}</span></li>`).join("\n        ")}
      </ul>
      <p class="chiusura rv">Se ne hai riconosciuta almeno una, la lezione di prova è pensata per te.</p>
    </div>
  </div>
</section>

<!-- ============ 3 · TRANSIZIONE · template 033 ============ -->
<section class="hinge" aria-labelledby="hinge-title" data-block="3-transizione">
  <div class="wrap">
    <p class="riga giu rv"><span class="strike">Non è un fight club.</span></p>
    <h2 class="riga su rv" id="hinge-title">${"È una scuola per chi inizia.".split(" ").map((w, i) => `<span class="w"><span style="--i:${i}">${esc(w)}</span></span>`).join(" ")}</h2>
  </div>
</section>

<!-- ============ 4 · OFFER · template 108 ============ -->
<section class="book light" id="prenota" aria-labelledby="book-title" data-block="4-offer">
  <div class="wrap">
    <div class="top rv">
      <span class="eyebrow">Un solo passaggio</span>
      <h2 class="h2" id="book-title">Prenota la tua lezione di prova</h2>
      <p class="lead">Lasciaci i tuoi dati e ti ricontattiamo entro 24 ore per fissare il giorno. La prima lezione è gratuita e senza impegno.</p>
    </div>
    <div class="duo">
      <div class="pane form-pane rv">
        <form id="trial-form" class="form" action="${esc(c.form.endpoint)}" method="post" novalidate>
          <div class="field">
            <label for="f-name">Nome e cognome <span class="req" aria-hidden="true">*</span></label>
            <input id="f-name" name="name" type="text" autocomplete="name" required minlength="3" maxlength="80" aria-describedby="e-name">
            <p class="err" id="e-name" aria-live="polite"></p>
          </div>
          <div class="field">
            <label for="f-phone">Telefono <span class="req" aria-hidden="true">*</span></label>
            <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" required aria-describedby="e-phone" placeholder="Es. 333 123 4567">
            <p class="err" id="e-phone" aria-live="polite"></p>
          </div>
          <div class="row2f">
            <div class="field">
              <label for="f-who">Chi si allena?</label>
              <div class="select"><select id="f-who" name="who">
                <option value="adulto">Io (adulto)</option>
                <option value="figlio">Mio figlio o mia figlia</option>
                <option value="entrambi">Entrambi</option>
              </select></div>
            </div>
            <div class="field">
              <label for="f-age">Età dell'allievo</label>
              <input id="f-age" name="age" type="number" inputmode="numeric" min="4" max="90" aria-describedby="e-age">
              <p class="err" id="e-age" aria-live="polite"></p>
            </div>
          </div>
          <fieldset class="field">
            <legend>Quando preferisci venire?</legend>
            <div class="chips">
              <label class="chip"><input type="radio" name="when" value="mattina"><span>Mattina</span></label>
              <label class="chip"><input type="radio" name="when" value="pranzo"><span>Pausa pranzo</span></label>
              <label class="chip"><input type="radio" name="when" value="sera" checked><span>Sera</span></label>
              <label class="chip"><input type="radio" name="when" value="sabato"><span>Sabato</span></label>
            </div>
          </fieldset>
          <div class="hp" aria-hidden="true"><label for="f-web">Lascia vuoto</label><input id="f-web" name="website" type="text" tabindex="-1" autocomplete="off"></div>
          <div class="field check">
            <input id="f-privacy" name="privacy" type="checkbox" required aria-describedby="e-privacy">
            <label for="f-privacy">Ho letto l'<a href="/privacy.html" target="_blank">informativa privacy</a> e acconsento a essere ricontattato. <span class="req" aria-hidden="true">*</span></label>
            <p class="err" id="e-privacy" aria-live="polite"></p>
          </div>
          <button class="btn btn-green btn-block" type="submit"><span class="btn-label">Prenota la prova gratuita</span><span class="spinner" aria-hidden="true"></span></button>
          <p class="micro">Prima lezione gratuita · Qualsiasi età · Nessun vincolo</p>
          <p class="form-error" role="alert" hidden></p>
        </form>
        <div class="form-ok" id="form-ok" tabindex="-1" hidden>
          <svg class="ok-mark" viewBox="0 0 52 52" aria-hidden="true"><circle cx="26" cy="26" r="23" pathLength="1"/><path d="m15 27 7 7 15-16" pathLength="1"/></svg>
          <h3 class="h3">Fatto!</h3>
          <p>Ti contattiamo entro 24 ore per confermare la tua lezione. Se hai fretta, <a ${waAttrs}>scrivici su WhatsApp</a>.</p>
        </div>
      </div>
      <aside class="pane side-pane rv" style="--rd:1" aria-label="Con chi ti alleni">
        <span class="eyebrow">Con chi ti alleni</span>
        <div class="who">
          <img class="who-ph" src="${unsplash(images.coach.src, 240, 240)}" width="120" height="120" alt="${esc(images.coach.alt)}" loading="lazy" decoding="async">
          <div class="txt">
            <strong>${esc(coach.name)}</strong>
            <p class="who-rank">${esc(coach.rank)} · ${esc(gym.affiliation)}</p>
            <p>Pratica dal ${coach.since}, cintura nera da ${esc(coach.master)}. Ha gareggiato in Italia e all'estero, ma in palestra la sua priorità è far tornare chi è venuto per la prima volta.</p>
          </div>
        </div>
        <dl class="courses">
          <div><dt>Bambini</dt><dd>5–8 anni</dd></div>
          <div><dt>Ragazzi</dt><dd>9–14 anni</dd></div>
          <div><dt>Adulti</dt><dd>15+ · Gi e No-Gi</dd></div>
          <div><dt>Agonisti</dt><dd>su valutazione</dd></div>
        </dl>
        <a class="wa-row" ${waAttrs}>${ICON.wa}<span>Preferisci WhatsApp? <b>Scrivici</b></span>${ICON.arrow}</a>
      </aside>
    </div>
  </div>
</section>

<!-- ============ 5 · USP · template 036 ============ -->
<section class="usp dark" aria-labelledby="usp-title" data-block="5-usp">
  <div class="wrap">
    <div class="testa rv">
      <h2 class="h2" id="usp-title">Due modi di iniziare uno sport di combattimento</h2>
      <p class="lead">Chi molla dopo due settimane di solito non è pigro. Il più delle volte l'hanno messo a combattere troppo presto, con gente troppo esperta.</p>
    </div>
    <div class="confronto">
      <div class="col vecchio rv">
        <span class="et">Come succede spesso</span>
        <h3 class="h3">Arrangiati e tieni il passo</h3>
        ${usp.map(([o]) => `<p class="voce"><span class="mk" aria-hidden="true"></span>${esc(o)}</p>`).join("\n        ")}
      </div>
      <div class="col nuovo rv" style="--rd:1">
        <span class="et">Da ${esc(gym.shortName)}</span>
        <h3 class="h3">Un percorso per chi inizia</h3>
        ${usp.map(([, n], i) => `<p class="voce" style="--i:${i}"><span class="mk" aria-hidden="true"></span>${esc(n)}</p>`).join("\n        ")}
      </div>
    </div>
  </div>
</section>

<!-- ============ 6 · SOLUZIONE · template 039 ============ -->
<section class="how light" aria-labelledby="how-title" data-block="6-soluzione">
  <div class="wrap">
    <div class="intro rv">
      <span class="eyebrow">La prima lezione</span>
      <h2 class="h2" id="how-title">Come funziona</h2>
      <p class="lead">Dalla prenotazione al tatami, in tre passaggi.</p>
    </div>
    <ol class="steps" id="steps">
      <li class="step rv">
        <span class="num">1</span>
        <h3 class="h3">Prenoti</h3>
        <p>Compili il modulo o ci scrivi su WhatsApp e scegliamo insieme il giorno.</p>
        <span class="esito">Ci vogliono 30 secondi</span>
      </li>
      <li class="step rv" style="--rd:1">
        <span class="num">2</span>
        <h3 class="h3">Vieni in palestra</h3>
        <p>Arriva 10 minuti prima, con tuta, maglietta e una bottiglia d'acqua. Il kimono te lo prestiamo noi.</p>
        <span class="esito">Niente da comprare</span>
      </li>
      <li class="step rv" style="--rd:2">
        <span class="num">3</span>
        <h3 class="h3">Ti alleni con il gruppo</h3>
        <p>Riscaldamento, tecnica guidata e, se te la senti, un po' di sparring leggero. Alla fine parliamo di come continuare, senza nessuna pressione.</p>
        <span class="esito">Decidi tu se tornare</span>
      </li>
    </ol>
    <div class="chiusura-how rv">
      <a class="btn btn-green" ${ctaAttrs("how")}>Prenota la prova gratuita ${ICON.arrow}</a>
      <p>Prima lezione gratuita, senza impegno.</p>
    </div>
  </div>
</section>

<!-- ============ 7 · OBIEZIONI · template 088 ============ -->
<section class="objections dark" aria-labelledby="obj-title" data-block="7-obiezioni">
  <div class="wrap">
    <div class="intro88 rv">
      <h2 class="h2" id="obj-title">Le tre paure che fermano quasi tutti</h2>
      <p class="lead">Una riga in una FAQ non basta a chi ha davvero paura di farsi male. Qui rispondiamo per esteso.</p>
    </div>
    <div class="blocks">
      ${objections.map((o, i) => `<article class="blk rv" style="--i:${i}">
        <span class="count88">Paura ${i + 1} di 3</span>
        <h3>${esc(o.q)}</h3>
        <div class="body">${o.p.map((t) => `<p>${esc(t)}</p>`).join("")}</div>
        <p class="punch">${esc(o.punch)}</p>
        ${proof(o.r)}
      </article>`).join("\n      ")}
    </div>
    <div class="close88 rv">
      <a class="btn btn-lime" ${ctaAttrs("objections")}>Prenota la prova ${ICON.arrow}</a>
      <p>Prima lezione gratuita e senza impegno. Ti richiamiamo entro 24 ore. <a href="${esc(reviews.googleUrl)}" target="_blank" rel="noopener">Leggi tutte le recensioni su Google</a></p>
    </div>
  </div>
</section>

<!-- ============ 8 · CTA · template 099 ============ -->
<section class="band" aria-labelledby="band-title" data-block="8-cta">
  <svg class="band-snake" viewBox="0 0 1200 400" preserveAspectRatio="none" aria-hidden="true"><path d="M-40 300C160 120 300 380 520 230S840 40 1240 170" pathLength="1"/></svg>
  <div class="wrap">
    <div class="mid rv">
      <h2 class="h2 band-title" id="band-title"><span class="row2">Il primo passo è il più difficile.</span> <span class="row2">Il secondo è sul tatami.</span></h2>
      <p class="lead">Prenota la tua lezione gratuita, ci vogliono 30 secondi.</p>
      <div class="acts">
        <a class="btn btn-lime btn-lg" ${ctaAttrs("final")}>Prenota la prova gratuita</a>
        <a class="btn btn-ghost btn-lg" ${waAttrs}>${ICON.wa}Scrivici su WhatsApp</a>
      </div>
      <p class="foot99">Nessun vincolo. Se dopo la prova non fa per te, nessuno ti richiama per insistere.</p>
    </div>
  </div>
</section>

<!-- ============ 9 · FAQ · template 084 ============ -->
<section class="faq light" id="faq" aria-labelledby="faq-title" data-block="9-faq">
  <div class="wrap">
    <div class="head84 rv">
      <h2 class="h2" id="faq-title">Le altre domande</h2>
      <p class="lead">Quello che ci chiedono più spesso al telefono, prima della prova.</p>
    </div>
    <dl class="qas">
      ${faq.map(([q, a], i) => `<div class="qa84 rv" style="--rd:${i % 2}"><dt class="q">${esc(q)}</dt><dd class="a">${esc(a)}</dd></div>`).join("\n      ")}
    </dl>
    <div class="end84 rv">
      <p>Non trovi la tua domanda? Scrivici, rispondiamo in giornata.</p>
      <div class="cta">
        <a class="btn btn-green" ${ctaAttrs("faq")}>Prenota la prova</a>
        <a class="btn btn-ghost" ${waAttrs}>${ICON.wa}WhatsApp</a>
      </div>
    </div>
  </div>
</section>

</main>

<footer class="ftr dark">
  <div class="wrap ftr-grid">
    <div class="ftr-brand">
      <a href="#top" class="logo" aria-label="${esc(gym.name)}, torna su">
        <img src="/assets/anaconda-symbol.svg" width="52" height="52" alt="" loading="lazy">
        <span class="logo-wm"><b>Anaconda<em>BJJ</em></b><small>Academy · Jiu Jitsu</small></span>
      </a>
      <p>Brazilian Jiu-Jitsu per bambini, ragazzi e adulti a ${esc(gym.area)}.</p>
      <p class="aff">Affiliata ${esc(gym.affiliation)} · ${esc(gym.sportBody)}</p>
    </div>
    <div>
      <h2 class="ftr-h">Contatti</h2>
      <ul class="ftr-list">
        <li><a href="${esc(maps)}" target="_blank" rel="noopener">${ICON.pin}<span>${esc(addr)}</span></a></li>
        <li><a href="${tel}">${ICON.phone}<span>${esc(gym.phoneDisplay)}</span></a></li>
        <li><a ${waAttrs}>${ICON.wa}<span>WhatsApp</span></a></li>
        <li><a href="${esc(ig)}" target="_blank" rel="noopener">${ICON.ig}<span>@${esc(gym.instagram)}</span></a></li>
      </ul>
    </div>
    <div>
      <h2 class="ftr-h">Orari</h2>
      <dl class="hours">
        ${hours.map((h) => `<div><dt>${esc(h.label)}</dt><dd>${esc(h.value)}</dd></div>`).join("")}
      </dl>
    </div>
    <div class="map-box">
      <h2 class="ftr-h">Dove siamo</h2>
      <div class="map" id="map" data-q="${esc(gym.name + " " + addr)}">
        <button type="button" class="map-load">${ICON.pin}<span>Mostra la mappa</span><small>Carica Google Maps (cookie di terze parti)</small></button>
      </div>
      <a class="dir" href="${esc(maps)}" target="_blank" rel="noopener">Indicazioni stradali ${ICON.arrow}</a>
    </div>
  </div>
  <div class="wrap ftr-legal">
    <p>© ${year} ${esc(gym.legalName)} · C.F./P.IVA ${esc(gym.taxId)}</p>
    <p><a href="/privacy.html">Privacy Policy</a> · <a href="/cookie.html">Cookie Policy</a> · <button type="button" class="linkbtn" data-cookie-open>Preferenze cookie</button></p>
  </div>
</footer>

<div class="sticky-bar" id="sticky-bar" aria-hidden="true">
  <a class="btn btn-lime" ${ctaAttrs("sticky_mobile")} tabindex="-1">Prova gratuita</a>
  <a class="sb-wa" ${waAttrs} aria-label="Scrivici su WhatsApp" tabindex="-1">${ICON.wa}</a>
</div>
<a class="wa-float" ${waAttrs} aria-label="Scrivici su WhatsApp">${ICON.wa}<span>Scrivici</span></a>

<div class="cookie" id="cookie" role="dialog" aria-modal="false" aria-labelledby="ck-title" hidden>
  <div class="cookie-in">
    <div>
      <h2 class="ck-title" id="ck-title">Cookie</h2>
      <p>Usiamo cookie tecnici necessari al sito. Con il tuo consenso useremo anche cookie di statistica e marketing (Google Analytics, Meta Pixel) per misurare le visite. Puoi cambiare idea in qualsiasi momento. <a href="/cookie.html">Cookie Policy</a></p>
    </div>
    <div class="ck-acts">
      <button type="button" class="btn btn-ck" data-consent="denied">Rifiuta</button>
      <button type="button" class="btn btn-ck" data-consent="granted">Accetta</button>
    </div>
  </div>
</div>

<script>window.SITE=${safeJson({ tracking: c.tracking, endpoint: c.form.endpoint, wa })};</script>
<script src="/main.js" defer></script>
</body>
</html>
`;
}
