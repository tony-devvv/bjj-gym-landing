// ============================================================================
//  CONTENUTI DELLA LANDING — unico file da modificare per i dati del cliente.
//  Tutto ciò che è marcato  // SEGNAPOSTO  va sostituito con i dati reali.
//  Dopo le modifiche: `npm run build` (o `npm run dev` in locale).
// ============================================================================

export const gym = {
  name: "AnacondaBJJ Academy",                 // nome dalle brand guidelines
  shortName: "AnacondaBJJ",
  city: "Bologna",                              // SEGNAPOSTO
  area: "Bologna – zona Navile",                // SEGNAPOSTO
  address: {
    street: "Via Esempio 12",                   // SEGNAPOSTO
    postalCode: "40128",                        // SEGNAPOSTO
    city: "Bologna",                            // SEGNAPOSTO
    region: "BO",                               // SEGNAPOSTO
    country: "IT",
  },
  geo: { lat: 44.5170, lng: 11.3560 },          // SEGNAPOSTO (coordinate indicative zona Navile)
  phoneDisplay: "+39 333 000 0000",             // SEGNAPOSTO
  phoneE164: "+393330000000",                   // SEGNAPOSTO (senza spazi, per tel: e WhatsApp)
  instagram: "alavancabjj",                     // SEGNAPOSTO (senza @)
  affiliation: "Nome Team",                     // SEGNAPOSTO
  sportBody: "CSEN",                            // SEGNAPOSTO (CSEN / ASI / UISP)
  legalName: "ASD AnacondaBJJ",                 // SEGNAPOSTO
  taxId: "00000000000",                         // SEGNAPOSTO (C.F./P.IVA)
  siteUrl: "https://anacondabjj.vercel.app",    // SEGNAPOSTO (dominio finale)
  openDaysShort: "Aperti lun–sab",
};

export const coach = {
  name: "Marco Rinaldi",                        // SEGNAPOSTO
  firstName: "Marco",                           // SEGNAPOSTO
  rank: "Cintura nera 2° grado",                // SEGNAPOSTO
  yearsTeaching: 12,                            // SEGNAPOSTO
  since: 2010,                                  // SEGNAPOSTO
  master: "Nome Maestro",                       // SEGNAPOSTO
  achievements: [                               // SEGNAPOSTO
    "Campione italiano (categoria e anno)",
    "Podio European IBJJF (categoria e anno)",
    "Istruttore qualificato " + "CSEN",
  ],
};

export const reviews = {
  count: 87,                                    // SEGNAPOSTO
  rating: "4,9",                                // SEGNAPOSTO (formato italiano)
  ratingValue: 4.9,                             // SEGNAPOSTO (per i dati strutturati)
  googleUrl: "https://www.google.com/maps",     // SEGNAPOSTO (link alla scheda Google)
  // ⚠️ ESEMPI: prima della pubblicazione usare SOLO recensioni reali della palestra.
  items: [
    { text: "Ho iniziato a 38 anni senza aver mai fatto sport da combattimento. Mi hanno messo a mio agio dal primo giorno.", author: "Andrea", role: "allievo adulto" },
    { text: "Mio figlio era timido, dopo pochi mesi è un altro bambino. Gli istruttori sono pazienti e attenti.", author: "Giulia", role: "mamma di Tommaso, 8 anni" },
    { text: "Ambiente serio ma per niente da 'duri'. Si impara tanto e ci si diverte.", author: "Luca", role: "allievo" },
  ],
  areExamples: true,                            // metti false quando le recensioni sono reali
};

export const pricing = {
  monthlyFrom: "65 €",                          // SEGNAPOSTO
  yearlyMembership: "30 €",                     // SEGNAPOSTO
};

export const hours = [                          // SEGNAPOSTO
  { label: "Lun–Ven", value: "17:00–22:00", days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"], opens: "17:00", closes: "22:00" },
  { label: "Sab", value: "10:00–13:00", days: ["Saturday"], opens: "10:00", closes: "13:00" },
  { label: "Dom", value: "Chiuso", days: [], opens: null, closes: null },
];

export const competition = {
  circuits: "FIJLKAM / IBJJF / circuiti nazionali", // SEGNAPOSTO
};

export const whatsapp = {
  message: "Ciao! Vorrei prenotare una lezione di prova gratuita di BJJ.",
};

// Tracciamento: predisposto ma NON attivo. Si carica solo dopo il consenso cookie
// e solo se l'ID è compilato.
export const tracking = {
  ga4Id: "",                                    // es. "G-XXXXXXXXXX"
  metaPixelId: "",                              // es. "1234567890"
};

// Invio form: l'API /api/prenota valida i dati. Per inoltrarli compila UNO dei due
// tramite variabili d'ambiente su Vercel (vedi README): FORMSPREE_ENDPOINT o WEBHOOK_URL.
export const form = {
  endpoint: "/api/prenota",
};

// Immagini: sostituire con foto reali della palestra (WebP/AVIF, dimensioni esplicite).
export const images = {
  hero: {
    // SEGNAPOSTO — foto di prova (Unsplash, Nguyen Hung, Licenza Unsplash). Sostituire con una foto reale di una lezione.
    src: "https://images.unsplash.com/photo-1656653121475-e33829581294",
    width: 2400, height: 1598,
    credit: "Foto: Nguyen Hung / Unsplash",
    alt: "Lezione di Brazilian Jiu-Jitsu sul tatami: l'istruttore mostra una tecnica a un gruppo di allievi principianti, adulti e ragazzi",
  },
  coach: {
    // SEGNAPOSTO — foto di prova (Unsplash, Diego Corona, Licenza Unsplash). Sostituire con il ritratto del coach.
    src: "https://images.unsplash.com/photo-1780476870650-5f5ef733c78e",
    width: 1000, height: 1500,
    credit: "Foto: Diego Corona / Unsplash",
    alt: "Ritratto del coach " + "Marco Rinaldi" + " in kimono con cintura nera",
  },
  og: "/assets/og-image.jpg",                   // 1200×630
};
