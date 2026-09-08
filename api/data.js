// Tiny backend for the ERM Account Planning tool.
// GET  /api/data?key=SOME_KEY   -> { value: "<json string>" | null }
// POST /api/data?key=SOME_KEY   body: { value: "<json string>" } -> { ok: true }
//
// Storage is Upstash Redis (REST API), configured via two env vars set in
// the Vercel project settings:
//   UPSTASH_REDIS_REST_URL
//   UPSTASH_REDIS_REST_TOKEN

export default async function handler(req, res) {
  const BASE = process.env.UPSTASH_REDIS_REST_URL;
  const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!BASE || !TOKEN) {
    res.status(500).json({ error: "Server is missing UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN env vars." });
    return;
  }

  // Which document this request is for. Keeps the two tools (full + thin)
  // — or any future ones — separate in the same database.
  const rawKey = (req.query && req.query.key) ? String(req.query.key) : "erm_default";
  // Restrict to safe characters so we can't be tricked into hitting an arbitrary Redis command path.
  const key = "erm_app:" + rawKey.replace(/[^a-zA-Z0-9_:-]/g, "");

  try {
    if (req.method === "GET") {
      const r = await fetch(`${BASE}/get/${key}`, {
        headers: { Authorization: `Bearer ${TOKEN}` }
      });
      if (!r.ok) throw new Error(`Upstash GET failed: ${r.status}`);
      const json = await r.json();
      res.status(200).json({ value: json.result || null });
      return;
    }

    if (req.method === "POST") {
      const value = req.body && req.body.value;
      if (typeof value !== "string") {
        res.status(400).json({ error: "Request body must be { value: '<string>' }" });
        return;
      }
      const r = await fetch(`${BASE}/set/${key}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(value)
      });
      if (!r.ok) throw new Error(`Upstash SET failed: ${r.status}`);
      const json = await r.json();
      res.status(200).json({ ok: json.result === "OK" });
      return;
    }

    res.setHeader("Allow", "GET, POST");
    res.status(405).json({ error: "Method not allowed" });
  } catch (e) {
    res.status(500).json({ error: e && e.message ? e.message : String(e) });
  }
}
