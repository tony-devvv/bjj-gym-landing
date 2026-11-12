# Brand AnacondaBJJ Academy

- `anacondabjj-brand-guidelines.json` — fonte unica: colori, font, logo, componenti, tono di voce, token CSS.
- `anacondabjj-brand-guidelines.pdf` — le stesse regole impaginate (13 pagine A4 orizzontali).
- `assets/` — logo: `anaconda-symbol.svg` (simbolo), `anaconda-logo-horizontal-dark.svg` e `-light.svg` (con nome).
- `source/brand-guidelines.html` — sorgente del PDF.

Il nome nei loghi orizzontali è testo in Barlow Condensed caricato da Google Fonts: se il font non è disponibile (es. dentro `<img>` o offline) usa il simbolo + il nome scritto in HTML, oppure converti il testo in tracciati prima della stampa.

## Rigenerare il PDF (PowerShell)

```powershell
Start-Process -FilePath "C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe" -ArgumentList @("--headless=new","--disable-gpu","--no-pdf-header-footer","--virtual-time-budget=15000","--user-data-dir=$env:TEMP\edge-pdf-profile","--print-to-pdf=C:\Users\antho\landing-pages\bjj-gym-landing\brand\anacondabjj-brand-guidelines.pdf","file:///C:/Users/antho/landing-pages/bjj-gym-landing/brand/source/brand-guidelines.html") -Wait
```
