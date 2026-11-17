// API-Logik für /api/votes
// Nutzt das KV-Binding VOTES (wird beim Deploy automatisch angelegt).
// Jede Stimme wird als eigener Key gespeichert (vote:<name>), die Daten liegen
// in den Metadaten – so reicht ein einziger list()-Aufruf zum Auswerten.

const DATES = ["2026-12-08", "2026-12-10", "2026-12-15", "2026-12-16", "2026-12-17", "2026-12-22", "2026-12-23"];
const ACTIVITIES = ["quiz", "escape", "games", "other"];

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
  });

export async function handleGet({ env }) {
  const votes = [];
  let cursor;
  do {
    const page = await env.VOTES.list({ prefix: "vote:", cursor });
    for (const k of page.keys) if (k.metadata) votes.push(k.metadata);
    cursor = page.list_complete ? undefined : page.cursor;
  } while (cursor);
  votes.sort((a, b) => a.t - b.t);
  return json({ votes });
}

export async function handlePost({ request, env }) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Ungültige Anfrage." }, 400);
  }

  const name = String(body.name || "").trim().replace(/\s+/g, " ").slice(0, 40);
  const dates = [...new Set(Array.isArray(body.dates) ? body.dates : [])].filter((d) => DATES.includes(d));
  const activities = [...new Set(Array.isArray(body.activities) ? body.activities : [])].filter((a) => ACTIVITIES.includes(a));
  const other = activities.includes("other") ? String(body.other || "").trim().slice(0, 300) : "";

  if (!name) return json({ error: "Bitte gib deinen Namen an." }, 400);
  if (!dates.length) return json({ error: "Bitte wähle mindestens einen Termin." }, 400);
  if (!activities.length) return json({ error: "Bitte wähle mindestens eine Idee." }, 400);
  if (activities.includes("other") && !other) return json({ error: "Bitte beschreib deine sonstige Idee." }, 400);

  const vote = { n: name, d: dates, a: activities, o: other, t: Date.now() };
  // KV-Metadaten dürfen max. 1024 Bytes groß sein
  while (new TextEncoder().encode(JSON.stringify(vote)).length > 1000) vote.o = vote.o.slice(0, -10);

  // Gleicher Name überschreibt die alte Stimme (zum Ändern)
  const key = "vote:" + name.toLowerCase();
  await env.VOTES.put(key, "", { metadata: vote });
  return json({ ok: true, vote });
}
