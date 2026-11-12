/* AnacondaBJJ — interazioni della landing (nessuna dipendenza). */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const SITE = window.SITE || {};
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches && !document.documentElement.classList.contains("fm");
  if (!reduced) document.documentElement.classList.add("motion");
  const store = {
    get(k) { try { return localStorage.getItem(k); } catch { return null; } },
    set(k, v) { try { localStorage.setItem(k, v); } catch {} },
  };

  /* ---------- ingresso hero ---------- */
  const start = () => requestAnimationFrame(() => {
    document.documentElement.classList.add("loaded");
    setTimeout(() => $$(".hero .count").forEach(countUp), 700);
  });
  (document.fonts && document.fonts.ready ? Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 900))]) : Promise.resolve()).then(start);

  /* ---------- comparsa allo scroll ---------- */
  const reveal = (el) => {
    el.classList.add("in");
    if (el.classList.contains("rv")) {
      const d = parseFloat(getComputedStyle(el).getPropertyValue("--rd")) || 0;
      setTimeout(() => el.classList.remove("rv"), 1600 + d * 110);
    }
    $$(".count", el).forEach(countUp);
  };
  const targets = $$(".rv, .rv-clip, .steps, .step, .band");
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { reveal(e.target); io.unobserve(e.target); } }), { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    targets.forEach((t) => io.observe(t));
  } else targets.forEach(reveal);

  /* ---------- contatori ---------- */
  function countUp(el) {
    if (el.dataset.done) return;
    el.dataset.done = 1;
    const to = parseFloat(el.dataset.to), dec = +el.dataset.dec || 0;
    const fmt = (v) => v.toFixed(dec).replace(".", ",");
    if (reduced || !isFinite(to)) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(tick);
    };
    el.textContent = fmt(0);
    requestAnimationFrame(tick);
  }

  /* ---------- header, barra sticky mobile, WhatsApp flottante ---------- */
  const hdr = $(".hdr"), bar = $("#sticky-bar"), waf = $(".wa-float"), hero = $("#hero"), form = $("#prenota");
  addEventListener("scroll", () => hdr.classList.toggle("scrolled", scrollY > 10), { passive: true });
  let pastHero = false, onForm = false;
  const syncFixed = () => {
    const show = pastHero && !onForm;
    bar.classList.toggle("show", show);
    bar.setAttribute("aria-hidden", String(!show));
    $$("a", bar).forEach((a) => (a.tabIndex = show ? 0 : -1));
    waf.classList.toggle("show", pastHero);
  };
  if ("IntersectionObserver" in window) {
    new IntersectionObserver(([e]) => { pastHero = !e.isIntersecting; syncFixed(); }, { threshold: 0.05 }).observe(hero);
    new IntersectionObserver(([e]) => { onForm = e.isIntersecting; syncFixed(); }, { threshold: 0.25 }).observe(form);
  }

  /* ---------- animazioni legate allo scroll (un solo loop rAF) ---------- */
  if (!reduced) {
    const root = document.documentElement;
    const clamp = (v) => Math.max(0, Math.min(1, v));
    const stepsEl = $("#steps"), band = $(".band"), pains = $$(".pains li");
    const blocksEl = $(".blocks"), blks = $$(".blk");
    let stackOn = false;
    const checkStack = () => {
      stackOn = innerWidth >= 900 && blks.every((b) => b.offsetHeight < innerHeight - 140);
      if (blocksEl) blocksEl.classList.toggle("stack", stackOn);
      if (!stackOn) blks.forEach((b) => b.style.removeProperty("--cover"));
    };
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = innerHeight;
      hdr.style.setProperty("--page", clamp(scrollY / (root.scrollHeight - vh)).toFixed(4));
      const hr = hero.getBoundingClientRect();
      if (hr.bottom > 0) hero.style.setProperty("--hp", clamp(-hr.top / hr.height).toFixed(4));
      pains.forEach((li) => { if (li.getBoundingClientRect().top < vh * 0.62) li.classList.add("on"); });
      if (stepsEl) {
        const r = stepsEl.getBoundingClientRect();
        const p = clamp((vh * 0.8 - r.top) / (r.height + vh * 0.3));
        stepsEl.style.setProperty("--sp", p.toFixed(4));
        const st = $$(".step", stepsEl);
        st.forEach((s, i) => s.classList.toggle("lit", innerWidth >= 760 ? p >= (i / (st.length - 1)) * 0.97 : s.getBoundingClientRect().top < vh * 0.7));
      }
      if (band) {
        const r = band.getBoundingClientRect();
        band.style.setProperty("--bp", clamp((vh - r.top) / (vh + r.height * 0.6)).toFixed(4));
      }
      if (stackOn) blks.forEach((b, i) => {
        const n = blks[i + 1];
        if (!n) return;
        const c = clamp(1 - (n.getBoundingClientRect().top - b.getBoundingClientRect().top) / b.offsetHeight);
        b.style.setProperty("--cover", c.toFixed(3));
      });
    };
    const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
    addEventListener("scroll", req, { passive: true });
    addEventListener("resize", () => { checkStack(); req(); });
    checkStack();
    update();

    if (matchMedia("(hover: hover) and (pointer: fine)").matches) {
      // luce che segue il cursore nella hero
      hero.addEventListener("pointermove", (e) => {
        const r = hero.getBoundingClientRect();
        hero.style.setProperty("--mx", e.clientX - r.left + "px");
        hero.style.setProperty("--my", e.clientY - r.top + "px");
      });
      // bottoni principali "magnetici"
      $$(".btn-lg, .hdr .btn, .close88 .btn").forEach((b) => {
        b.addEventListener("pointermove", (e) => {
          const r = b.getBoundingClientRect();
          b.style.setProperty("--tx", (((e.clientX - r.left) / r.width - 0.5) * 12).toFixed(1) + "px");
          b.style.setProperty("--ty", (((e.clientY - r.top) / r.height - 0.5) * 10).toFixed(1) + "px");
        });
        b.addEventListener("pointerleave", () => { b.style.setProperty("--tx", "0px"); b.style.setProperty("--ty", "0px"); });
      });
    }
  }

  /* ---------- consenso cookie + tracciamento (predisposto, non attivo) ---------- */
  const CK = "ab_consent_v1";
  const banner = $("#cookie");
  let consent = store.get(CK); // "granted" | "denied" | null
  const loadScript = (src) => { const s = document.createElement("script"); s.async = true; s.src = src; document.head.appendChild(s); };
  let trackersLoaded = false;
  function loadTrackers() {
    if (trackersLoaded || consent !== "granted") return;
    trackersLoaded = true;
    const { ga4Id, metaPixelId } = SITE.tracking || {};
    if (ga4Id) {
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { dataLayer.push(arguments); };
      gtag("js", new Date()); gtag("config", ga4Id, { anonymize_ip: true });
      loadScript("https://www.googletagmanager.com/gtag/js?id=" + encodeURIComponent(ga4Id));
    }
    if (metaPixelId) {
      !function (f, b, e, v, n, t, s) { if (f.fbq) return; n = f.fbq = function () { n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments); }; if (!f._fbq) f._fbq = n; n.push = n; n.loaded = !0; n.version = "2.0"; n.queue = []; t = b.createElement(e); t.async = !0; t.src = v; s = b.getElementsByTagName(e)[0]; s.parentNode.insertBefore(t, s); }(window, document, "script", "https://connect.facebook.net/en_US/fbevents.js");
      fbq("init", metaPixelId); fbq("track", "PageView");
    }
  }
  function track(name, params = {}) {
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") console.debug("[track]", name, params, "consenso:", consent);
    if (consent !== "granted") return;
    if (window.gtag) gtag("event", name, params);
    if (window.fbq) {
      if (name === "form_submit") fbq("track", "Lead", params);
      else if (name === "whatsapp_click") fbq("track", "Contact", params);
      else fbq("trackCustom", name, params);
    }
  }
  window.abTrack = track;
  const showBanner = () => { banner.hidden = false; };
  if (!consent) showBanner(); else loadTrackers();
  $$("[data-consent]").forEach((b) => b.addEventListener("click", () => {
    consent = b.dataset.consent; store.set(CK, consent); banner.hidden = true;
    if (consent === "granted") loadTrackers();
  }));
  $$("[data-cookie-open]").forEach((b) => b.addEventListener("click", showBanner));

  document.addEventListener("click", (e) => {
    const a = e.target.closest("[data-track]");
    if (a) track(a.dataset.track, { location: a.dataset.loc || a.closest("section,footer,div[id]")?.id || "page" });
  });

  /* ---------- mappa a caricamento su richiesta ---------- */
  const map = $("#map");
  map && map.querySelector(".map-load").addEventListener("click", () => {
    const f = document.createElement("iframe");
    f.loading = "lazy"; f.referrerPolicy = "no-referrer-when-downgrade"; f.title = "Mappa: come raggiungere la palestra";
    f.src = "https://www.google.com/maps?q=" + encodeURIComponent(map.dataset.q) + "&output=embed";
    map.innerHTML = ""; map.appendChild(f);
  });

  /* ---------- form di prenotazione ---------- */
  const f = $("#trial-form");
  if (!f) return;
  const ok = $("#form-ok"), errBox = $(".form-error", f), btn = $("button[type=submit]", f);
  const pane = $(".form-pane");
  const rules = {
    name: (v) => v.trim().length >= 3 || "Scrivi nome e cognome.",
    phone: (v) => { const d = v.replace(/[\s().-]/g, ""); return /^\+?\d{8,15}$/.test(d) || "Inserisci un numero di telefono valido."; },
    age: (v) => v === "" || (+v >= 4 && +v <= 90) || "Inserisci un'età tra 4 e 90 anni.",
    privacy: (_, el) => el.checked || "Serve il consenso per poterti ricontattare.",
  };
  const setErr = (name, msg) => {
    const el = f.elements[name], p = $("#e-" + name);
    el.setAttribute("aria-invalid", msg ? "true" : "false");
    if (p) p.textContent = msg || "";
  };
  const check = (name) => {
    const el = f.elements[name], r = rules[name](el.value, el);
    setErr(name, r === true ? "" : r);
    return r === true;
  };
  const progress = () => {
    const req = ["name", "phone", "privacy"];
    const done = req.filter((n) => rules[n](f.elements[n].value, f.elements[n]) === true).length;
    pane.style.setProperty("--prog", Math.max(0.04, done / req.length));
  };
  Object.keys(rules).forEach((n) => {
    const el = f.elements[n];
    el.addEventListener("blur", () => { if (el.value || el.type === "checkbox") check(n); });
    el.addEventListener("input", () => { if (el.getAttribute("aria-invalid") === "true") check(n); progress(); });
    el.addEventListener("change", progress);
  });

  f.addEventListener("submit", async (e) => {
    e.preventDefault();
    errBox.hidden = true;
    const valid = Object.keys(rules).map(check).every(Boolean);
    if (!valid) { f.querySelector("[aria-invalid=true]")?.focus(); return; }
    const data = Object.fromEntries(new FormData(f));
    data.privacy = !!f.elements.privacy.checked;
    btn.classList.add("is-loading");
    try {
      const res = await fetch(SITE.endpoint || f.action, { method: "POST", headers: { "Content-Type": "application/json", Accept: "application/json" }, body: JSON.stringify(data) });
      const out = await res.json().catch(() => ({}));
      if (!res.ok) {
        if (out.errors) Object.entries(out.errors).forEach(([k, v]) => setErr(k, v));
        throw new Error(out.message || "Invio non riuscito");
      }
      track("form_submit", { who: data.who, when: data.when });
      f.hidden = true; ok.hidden = false; ok.focus();
      pane.style.setProperty("--prog", 1);
    } catch (err) {
      errBox.innerHTML = `Non siamo riusciti a inviare la richiesta. Riprova tra poco oppure <a href="${SITE.wa}" target="_blank" rel="noopener" data-track="whatsapp_click" data-loc="form_error">scrivici su WhatsApp</a>.`;
      errBox.hidden = false;
    } finally {
      btn.classList.remove("is-loading");
    }
  });
})();
