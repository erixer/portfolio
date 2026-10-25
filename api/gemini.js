export default async function handler(req, res) {
  // Allow only POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Load API key from server environment (never exposed in git or client bundles)
  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');
  const clientKey = (req.headers['x-local-api-key'] || apiKey || '').trim().replace(/^['"]|['"]$/g, '');

  if (!clientKey) {
    return res.status(401).json({
      error: 'GEMINI_API_KEY is not configured in Vercel Environment Variables.'
    });
  }

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': clientKey
        },
        body: typeof req.body === 'string' ? req.body : JSON.stringify(req.body)
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
