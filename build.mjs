// Genera public/ a partire da content.config.mjs + src/. Usato da Vercel e da `npm run dev`.
import { mkdirSync, copyFileSync, writeFileSync, readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const out = join(root, "public");

export async function build() {
  const bust = "?v=" + Date.now();
  const c = { ...(await import(pathToFileURL(join(root, "content.config.mjs")).href + bust)) };
  const { render, faqItems } = await import(pathToFileURL(join(root, "src/page.mjs")).href + bust);
  const { gym, hours, reviews } = c;

  const dayUrl = (d) => "https://schema.org/" + d;
  c.__jsonld = [
    {
      "@context": "https://schema.org",
      "@type": "SportsActivityLocation",
      name: gym.name,
      sport: "Brazilian Jiu-Jitsu",
      url: gym.siteUrl + "/",
      image: gym.siteUrl + c.images.og,
      logo: gym.siteUrl + "/assets/anaconda-symbol.svg",
      telephone: gym.phoneE164,
      address: { "@type": "PostalAddress", streetAddress: gym.address.street, postalCode: gym.address.postalCode, addressLocality: gym.address.city, addressRegion: gym.address.region, addressCountry: gym.address.country },
      geo: { "@type": "GeoCoordinates", latitude: gym.geo.lat, longitude: gym.geo.lng },
      openingHoursSpecification: hours.filter((h) => h.opens).map((h) => ({ "@type": "OpeningHoursSpecification", dayOfWeek: h.days.map(dayUrl), opens: h.opens, closes: h.closes })),
      sameAs: ["https://instagram.com/" + gym.instagram],
      ...(reviews.areExamples ? {} : { aggregateRating: { "@type": "AggregateRating", ratingValue: reviews.ratingValue, reviewCount: reviews.count } }),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqItems(c).map(([q, a]) => ({ "@type": "Question", name: q, acceptedAnswer: { "@type": "Answer", text: a } })),
    },
  ];

  mkdirSync(join(out, "assets"), { recursive: true });
  writeFileSync(join(out, "index.html"), render(c));
  for (const f of ["styles.css", "main.js", "privacy.html", "cookie.html"]) copyFileSync(join(root, "src", f), join(out, f));
  copyFileSync(join(root, "brand/assets/anaconda-symbol.svg"), join(out, "assets/anaconda-symbol.svg"));
  if (existsSync(join(root, "src/og-image.jpg"))) copyFileSync(join(root, "src/og-image.jpg"), join(out, "assets/og-image.jpg"));
  return out;
}

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  build().then((o) => console.log("Build completata →", o));
}
