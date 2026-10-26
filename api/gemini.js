export default async function handler(req, res) {
  // Set CORS headers for Vercel
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, x-local-api-key'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  // Load API key from server environment (never exposed in git or client bundles)
  const apiKey = (process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || '').trim().replace(/^['"]|['"]$/g, '');
  const clientKey = (req.headers['x-local-api-key'] || apiKey || '').trim().replace(/^['"]|['"]$/g, '');

  if (!clientKey) {
    return res.status(401).json({
      error: {
        message: 'GEMINI_API_KEY belum dikonfigurasi di Vercel. Silakan tambahkan GEMINI_API_KEY di Project Settings > Environment Variables pada dashboard Vercel, lalu lakukan Redeploy.'
      }
    });
  }

  // Robust body retrieval (handles parsed object, string, or stream chunks)
  let requestBody = req.body;
  if (!requestBody) {
    try {
      requestBody = await new Promise((resolve, reject) => {
        let data = '';
        req.on('data', chunk => { data += chunk; });
        req.on('end', () => resolve(data));
        req.on('error', reject);
      });
    } catch {
      requestBody = '{}';
    }
  }

  const payloadString = typeof requestBody === 'string' ? requestBody : JSON.stringify(requestBody);

  try {
    const response = await fetch(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': clientKey
        },
        body: payloadString
      }
    );

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Gemini API Error:', err);
    return res.status(500).json({ error: { message: err.message || 'Internal Server Error' } });
  }
}
