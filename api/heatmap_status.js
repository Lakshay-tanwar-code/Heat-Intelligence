export default async function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { activity_id } = req.query;
    const FORTYGUARD_API_KEY = process.env.VITE_FORTYGUARD_API_KEY;

    if (!FORTYGUARD_API_KEY) {
        return res.status(500).json({ error: 'FORTYGUARD_API_KEY is missing' });
    }
    
    if (!activity_id) {
        return res.status(400).json({ error: 'activity_id is missing' });
    }

    try {
        const response = await fetch(`https://api.fortyguard.com/v1/status/${activity_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'api-key': FORTYGUARD_API_KEY
            }
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

        const data = await response.json().catch(() => ({}));
        
        if (!response.ok) {
            throw new Error(data.message || `API error: ${response.status}`);
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

        return res.status(200).json(sanitizedData);
    } catch (error) {
        console.error('Heatmap Status API Error:', error);
        return res.status(500).json({ error: error.message });
    }
}
