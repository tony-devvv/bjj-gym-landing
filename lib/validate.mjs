// Validazione lato server della richiesta di prova (usata da api/prenota.js e dal server locale).
const WHO = ["adulto", "figlio", "entrambi"];
const WHEN = ["mattina", "pranzo", "sera", "sabato"];

export function validateTrial(input) {
  const b = input && typeof input === "object" ? input : {};
  const str = (v, max) => (typeof v === "string" ? v.trim().slice(0, max) : "");
  const data = {
    name: str(b.name, 80),
    phone: str(b.phone, 25),
    who: str(b.who, 20) || "adulto",
    age: b.age === "" || b.age == null ? null : Number(b.age),
    when: str(b.when, 20) || "sera",
    privacy: b.privacy === true || b.privacy === "on" || b.privacy === "true",
  };
  const errors = {};
  if (data.name.length < 3) errors.name = "Scrivi nome e cognome.";
  if (!/^\+?\d{8,15}$/.test(data.phone.replace(/[\s().-]/g, ""))) errors.phone = "Inserisci un numero di telefono valido.";
  if (!WHO.includes(data.who)) errors.who = "Scelta non valida.";
  if (data.age !== null && (!Number.isInteger(data.age) || data.age < 4 || data.age > 90)) errors.age = "Inserisci un'età tra 4 e 90 anni.";
  if (!WHEN.includes(data.when)) errors.when = "Scelta non valida.";
  if (!data.privacy) errors.privacy = "Serve il consenso per poterti ricontattare.";
  const spam = typeof b.website === "string" && b.website.trim() !== "";
  return { ok: Object.keys(errors).length === 0, data, errors, spam };
}
