let memoryState = null;

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    return res.end();
  }

  const backend = process.env.BACKEND_URL || process.env.VITE_API_URL;
  if (backend) {
    try {
      const target = `${backend.replace(/\/$/, '')}/state`;
      const fRes = await fetch(target, {
        method: req.method,
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: ['POST', 'PUT'].includes(req.method) ? (typeof req.body === 'string' ? req.body : JSON.stringify(req.body)) : undefined
      });
      const data = await fRes.json();
      res.statusCode = fRes.status;
      res.setHeader('Content-Type', 'application/json');
      return res.end(JSON.stringify(data));
    } catch (err) {}
  }

  if (req.method === 'GET') {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(memoryState || {}));
  }

  if (req.method === 'PUT' || req.method === 'POST') {
    let next = req.body;
    if (typeof next === 'string') {
      try { next = JSON.parse(next); } catch (e) { next = {}; }
    }
    memoryState = Object.assign({}, memoryState || {}, next || {});
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    return res.end(JSON.stringify(memoryState));
  }

  res.statusCode = 405;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify({ error: 'Method not allowed' }));
}
