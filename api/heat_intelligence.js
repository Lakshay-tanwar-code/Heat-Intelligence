import dotenv from 'dotenv';
dotenv.config();

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    const apiKey = process.env.VITE_FORTYGUARD_API_KEY || process.env.FORTYGUARD_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'Missing FORTYGUARD_API_KEY environment variable on the server.' });
    }

    try {
        const response = await fetch('https://api.fortyguard.com/v1/heat_intelligence', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },
            body: JSON.stringify(req.body)
        });

        if (response.status === 200) {
            console.log('FortyGuard API: 200 OK - Health confirmed, payload received.');
        } else if (response.status === 401) {
            console.error('FortyGuard API: 401 Unauthorized - API key invalid or missing in headers.');
        } else if (response.status === 429) {
            console.error('FortyGuard API: 429 Too Many Requests - Rate limit exceeded.');
        } else if (response.status >= 500 || response.status === 0) {
            console.error(`FortyGuard API: ${response.status} Server/CORS Error - Endpoint requires server-side routing or payload malformed.`);
        }

        const data = await response.json().catch(() => null);

        if (!response.ok) {
            return res.status(response.status).json({ error: 'FortyGuard API Error', details: data });
        }

        const sanitizeData = (obj) => {
            if (obj === null || obj === -999) return "no-data";
            if (Array.isArray(obj)) return obj.map(sanitizeData);
            if (typeof obj === 'object') {
                const newObj = {};
                for (const key in obj) {
                    newObj[key] = sanitizeData(obj[key]);
                }
                return newObj;
            }
            return obj;
        };

        const sanitizedData = sanitizeData(data);

        return res.status(200).json(sanitizedData || { success: true });
    } catch (error) {
        console.error('Proxy Error:', error);
        return res.status(500).json({ error: 'Internal Server Error', details: error.message });
    }
}
