# Online-Weihnachtsfeier · Abstimmung

Kleine Abstimmungsseite: Termine (8./10./15./16./17./22./23. Dezember, ab 19 Uhr) und Programm
(Quiz, Escape Room, Online-Games, sonstige Ideen). Ergebnisse sind für alle unter „Ergebnisse“ sichtbar.

- `index.html` – die komplette Seite (Formular + Ergebnisse)
- `functions/api/votes.js` – Cloudflare Pages Function, speichert die Stimmen in Workers KV

## Einrichtung (Cloudflare Pages)

1. **KV-Namespace anlegen:** Cloudflare Dashboard → Storage & Databases → Workers KV → *Create* → Name z. B. `weihnachtsfeier-votes`.
2. **Pages-Projekt anlegen:** Workers & Pages → *Create* → Pages → *Connect to Git* → dieses Repo wählen.
   Build-Einstellungen: Framework *None*, Build command leer, Output directory `/`.
3. **KV verknüpfen:** Im Pages-Projekt → Settings → Bindings → *Add* → KV namespace
   – Variable name: `VOTES` – Namespace: `weihnachtsfeier-votes`.
4. **Neu deployen** (Deployments → letzter Deploy → *Retry deployment*), damit das Binding greift.

Fertig – der Link lautet `https://<projektname>.pages.dev`.

## Gut zu wissen

- Mit demselben Namen nochmal abstimmen überschreibt die alte Stimme (zum Ändern).
- Stimmen löschen/zurücksetzen: im KV-Namespace die Einträge `vote:<name>` löschen.
- Nach der Feier einfach Pages-Projekt und KV-Namespace löschen.
