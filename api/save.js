// Vercel Serverless Function — commits admin data to GitHub.
// Triggers an automatic Vercel redeploy on success.

export const config = {
  api: { bodyParser: { sizeLimit: '10mb' } }
};

const REPO = 'lupinlogger-lang/goldminer';
const FILE = 'gold-miners-data.json';
const BRANCH = 'main';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const TOKEN = process.env.GITHUB_TOKEN;
  const PW = process.env.ADMIN_PASSWORD;
  if (!TOKEN || !PW) {
    return res.status(500).json({ error: 'Server is missing GITHUB_TOKEN or ADMIN_PASSWORD env vars.' });
  }

  let body = req.body;
  if (typeof body === 'string') {
    try { body = JSON.parse(body); } catch { return res.status(400).json({ error: 'Invalid JSON body' }); }
  }
  if (!body || typeof body !== 'object') return res.status(400).json({ error: 'Missing body' });

  const { password, data } = body;
  if (password !== PW) return res.status(401).json({ error: 'Wrong password' });
  if (!data || typeof data !== 'object') return res.status(400).json({ error: 'Missing data' });

  const headers = {
    'Authorization': `Bearer ${TOKEN}`,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'goldminer-admin'
  };

  // 1. Get current file SHA
  let sha;
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}?ref=${BRANCH}`, { headers });
    if (r.status === 404) {
      sha = undefined; // creating new
    } else if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: 'GitHub GET failed', detail: t.slice(0, 400) });
    } else {
      const j = await r.json();
      sha = j.sha;
    }
  } catch (e) {
    return res.status(502).json({ error: 'GitHub GET threw', detail: String(e).slice(0, 400) });
  }

  // 2. Commit new content
  const content = Buffer.from(JSON.stringify(data)).toString('base64');
  try {
    const r = await fetch(`https://api.github.com/repos/${REPO}/contents/${FILE}`, {
      method: 'PUT',
      headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: `admin: update content (${new Date().toISOString()})`,
        content,
        sha,
        branch: BRANCH
      })
    });
    if (!r.ok) {
      const t = await r.text();
      return res.status(502).json({ error: 'GitHub PUT failed', detail: t.slice(0, 400) });
    }
    const j = await r.json();
    return res.status(200).json({ ok: true, commit: j.commit?.sha, message: 'Committed. Vercel will redeploy in ~30s.' });
  } catch (e) {
    return res.status(502).json({ error: 'GitHub PUT threw', detail: String(e).slice(0, 400) });
  }
}
