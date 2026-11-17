# Online-Weihnachtsfeier · Abstimmung

Kleine Abstimmungsseite: Termine (8./10./15./16./17./22./23. Dezember, ab 19 Uhr) und Programm
(Quiz, Escape Room, Online-Games, sonstige Ideen). Ergebnisse sind für alle unter „Ergebnisse“ sichtbar.

- `public/index.html` – die komplette Seite (Formular + Ergebnisse)
- `src/index.js`, `src/votes.js` – Cloudflare Worker mit der API `/api/votes`, speichert Stimmen in Workers KV
- `wrangler.jsonc` – Worker-Konfiguration; der KV-Speicher (Binding `VOTES`) wird beim ersten Deploy automatisch angelegt

## Deploy

Das Repo ist mit einem Cloudflare-Worker-Projekt verbunden (Workers Builds, Befehl `npx wrangler deploy`).
Jeder Push auf `main` deployt automatisch.

## Gut zu wissen

- Mit demselben Namen nochmal abstimmen überschreibt die alte Stimme (zum Ändern).
- Stimmen löschen/zurücksetzen: im KV-Speicher die Einträge `vote:<name>` löschen.
- Nach der Feier einfach Worker und KV-Speicher löschen.
