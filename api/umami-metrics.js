// api/umami-metrics.js
// Vercel-style serverless function: returns { visitors: number }

export default async function handler(req, res) {
  const UMAMI_HOST = process.env.UMAMI_HOST;
  const UMAMI_TOKEN = process.env.UMAMI_TOKEN;
  const UMAMI_WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

  if (!UMAMI_HOST || !UMAMI_TOKEN || !UMAMI_WEBSITE_ID) {
    return res.status(500).json({ error: 'Missing Umami configuration on server.' });
  }

  try {
    const now = new Date();
    const from = new Date(now.getTime() - 1000 * 60 * 60 * 24); // last 24 hours
    const startAt = encodeURIComponent(from.toISOString());
    const endAt = encodeURIComponent(now.toISOString());

    const apiUrl = `${UMAMI_HOST}/api/websites/${UMAMI_WEBSITE_ID}/stats?start_at=${startAt}&end_at=${endAt}&metrics=unique_visitors`;

    const resp = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${UMAMI_TOKEN}`,
        'Content-Type': 'application/json',
      },
    });

    if (!resp.ok) {
      const text = await resp.text();
      return res.status(502).json({ error: 'Umami API error', details: text });
    }

    const json = await resp.json();

    // Try a few common places for the metric value
    let visitors = null;
    if (json && typeof json === 'object') {
      if (typeof json.unique_visitors !== 'undefined') visitors = json.unique_visitors;
      else if (json.data && json.data[0] && typeof json.data[0].value !== 'undefined') visitors = json.data[0].value;
      else if (typeof json.value !== 'undefined') visitors = json.value;
    }

    if (visitors === null) {
      return res.status(200).json({ raw: json });
    }

    return res.status(200).json({ visitors });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
