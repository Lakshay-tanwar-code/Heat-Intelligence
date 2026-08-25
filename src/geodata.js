// Extensive geocoded address database for demo purposes
// Each entry has a real lat/lng so the satellite map is accurate
// Includes specific streets, hospitals, warehouses, distribution centers, landmarks

export const GEOCODED_DB = {
    // Arizona — specific addresses
    "sky harbor": { lat: 33.4373, lng: -112.0078, label: "Phoenix Sky Harbor Intl Airport" },
    "phoenix sky harbor": { lat: 33.4373, lng: -112.0078, label: "Phoenix Sky Harbor Intl Airport" },
    "phoenix children": { lat: 33.4754, lng: -112.0650, label: "Phoenix Children's Hospital" },
    "phoenix children's hospital": { lat: 33.4754, lng: -112.0650, label: "Phoenix Children's Hospital" },
    "banner desert": { lat: 33.3942, lng: -111.8460, label: "Banner Desert Medical Center, Mesa" },
    "banner desert medical": { lat: 33.3942, lng: -111.8460, label: "Banner Desert Medical Center, Mesa" },
    "mayo clinic": { lat: 33.6585, lng: -111.8613, label: "Mayo Clinic, Scottsdale" },
    "mayo clinic scottsdale": { lat: 33.6585, lng: -111.8613, label: "Mayo Clinic, Scottsdale" },
    "st joseph's hospital phoenix": { lat: 33.4603, lng: -112.0773, label: "St Joseph's Hospital, Phoenix" },
    "barrow neurological": { lat: 33.4603, lng: -112.0773, label: "Barrow Neurological Institute, Phoenix" },
    "honor health scottsdale": { lat: 33.5007, lng: -111.9268, label: "HonorHealth Scottsdale Osborn" },
    "1300 n 12th st phoenix": { lat: 33.4603, lng: -112.0690, label: "1300 N 12th St, Phoenix, AZ" },
    "2901 n central ave phoenix": { lat: 33.4747, lng: -112.0736, label: "2901 N Central Ave, Phoenix, AZ" },
    "4502 e indian school rd": { lat: 33.4938, lng: -111.9762, label: "4502 E Indian School Rd, Phoenix" },
    "phoenix convention center": { lat: 33.4436, lng: -112.0710, label: "Phoenix Convention Center" },
    "chase field": { lat: 33.4453, lng: -112.0667, label: "Chase Field, Phoenix" },
    "state farm stadium": { lat: 33.5276, lng: -112.2626, label: "State Farm Stadium, Glendale" },
    "amazon phoenix warehouse": { lat: 33.4408, lng: -112.0194, label: "Amazon PHX6 Fulfillment Center" },
    "fedex phoenix hub": { lat: 33.4309, lng: -112.0117, label: "FedEx Ground Hub, Phoenix" },
    "walmart distribution chandler": { lat: 33.2841, lng: -111.8527, label: "Walmart Distribution Center, Chandler" },
    "costco tempe": { lat: 33.3895, lng: -111.9273, label: "Costco Wholesale, Tempe" },
    "tempe": { lat: 33.4255, lng: -111.9400, label: "Tempe, AZ" },
    "chandler": { lat: 33.3062, lng: -111.8413, label: "Chandler, AZ" },
    "scottsdale": { lat: 33.4942, lng: -111.9261, label: "Scottsdale, AZ" },
    "mesa": { lat: 33.4152, lng: -111.8315, label: "Mesa, AZ" },
    "glendale az": { lat: 33.5387, lng: -112.1860, label: "Glendale, AZ" },
    "glendale": { lat: 33.5387, lng: -112.1860, label: "Glendale, AZ" },
    "peoria az": { lat: 33.5806, lng: -112.2374, label: "Peoria, AZ" },
    "peoria": { lat: 33.5806, lng: -112.2374, label: "Peoria, AZ" },
    "gilbert": { lat: 33.3528, lng: -111.7890, label: "Gilbert, AZ" },
    "surprise az": { lat: 33.6292, lng: -112.3679, label: "Surprise, AZ" },
    "goodyear az": { lat: 33.4353, lng: -112.3577, label: "Goodyear, AZ" },
    "flagstaff": { lat: 35.1983, lng: -111.6513, label: "Flagstaff, AZ" },
    "tucson": { lat: 32.2226, lng: -110.9747, label: "Tucson, AZ" },
    "yuma": { lat: 32.6927, lng: -114.6277, label: "Yuma, AZ" },
    "phoenix": { lat: 33.4484, lng: -112.0740, label: "Phoenix, AZ" },

    // California — specific addresses
    "downtown la": { lat: 34.0407, lng: -118.2468, label: "Downtown Los Angeles, CA" },
    "los angeles": { lat: 34.0522, lng: -118.2437, label: "Los Angeles, CA" },
    "lax": { lat: 33.9425, lng: -118.4081, label: "LAX Airport" },
    "lax airport": { lat: 33.9425, lng: -118.4081, label: "LAX Airport" },
    "cedars sinai": { lat: 34.0752, lng: -118.3806, label: "Cedars-Sinai Medical Center, LA" },
    "ucla medical": { lat: 34.0665, lng: -118.4464, label: "UCLA Medical Center" },
    "hollywood": { lat: 34.0928, lng: -118.3287, label: "Hollywood, CA" },
    "hollywood blvd": { lat: 34.1016, lng: -118.3267, label: "Hollywood Blvd, Los Angeles" },
    "staples center": { lat: 34.0430, lng: -118.2673, label: "Crypto.com Arena, Los Angeles" },
    "convention center la": { lat: 34.0404, lng: -118.2696, label: "LA Convention Center" },
    "amazon fulfillment san bernardino": { lat: 34.0832, lng: -117.2898, label: "Amazon ONT6, San Bernardino" },
    "port of long beach": { lat: 33.7554, lng: -118.2160, label: "Port of Long Beach" },
    "port of los angeles": { lat: 33.7374, lng: -118.2715, label: "Port of Los Angeles" },
    "san francisco": { lat: 37.7749, lng: -122.4194, label: "San Francisco, CA" },
    "sfo": { lat: 37.6213, lng: -122.3790, label: "SFO Airport" },
    "san diego": { lat: 32.7157, lng: -117.1611, label: "San Diego, CA" },
    "sacramento": { lat: 38.5816, lng: -121.4944, label: "Sacramento, CA" },
    "san jose": { lat: 37.3382, lng: -121.8863, label: "San Jose, CA" },
    "fresno": { lat: 36.7378, lng: -119.7871, label: "Fresno, CA" },
    "bakersfield": { lat: 35.3733, lng: -119.0187, label: "Bakersfield, CA" },
    "long beach": { lat: 33.7701, lng: -118.1937, label: "Long Beach, CA" },
    "oakland": { lat: 37.8044, lng: -122.2712, label: "Oakland, CA" },
    "burbank": { lat: 34.1808, lng: -118.3090, label: "Burbank, CA" },
    "anaheim": { lat: 33.8366, lng: -117.9143, label: "Anaheim, CA" },
    "santa monica": { lat: 34.0195, lng: -118.4912, label: "Santa Monica, CA" },
    "beverly hills": { lat: 34.0736, lng: -118.4004, label: "Beverly Hills, CA" },
    "pasadena": { lat: 34.1478, lng: -118.1445, label: "Pasadena, CA" },
    "riverside": { lat: 33.9533, lng: -117.3962, label: "Riverside, CA" },
    "irvine": { lat: 33.6846, lng: -117.8265, label: "Irvine, CA" },
    "stanford hospital": { lat: 37.4340, lng: -122.1750, label: "Stanford Hospital, Palo Alto" },

    // Nevada
    "las vegas": { lat: 36.1699, lng: -115.1398, label: "Las Vegas, NV" },
    "the strip": { lat: 36.1147, lng: -115.1728, label: "Las Vegas Strip, NV" },
    "henderson": { lat: 36.0395, lng: -114.9817, label: "Henderson, NV" },
    "reno": { lat: 39.5296, lng: -119.8138, label: "Reno, NV" },
    "mccarran airport": { lat: 36.0840, lng: -115.1537, label: "Harry Reid Intl Airport, Las Vegas" },
    "bellagio": { lat: 36.1129, lng: -115.1765, label: "Bellagio Hotel, Las Vegas" },
    "fremont street": { lat: 36.1700, lng: -115.1416, label: "Fremont Street, Las Vegas" },

    // Texas — specific addresses
    "san antonio": { lat: 29.4241, lng: -98.4936, label: "San Antonio, TX" },
    "the alamo": { lat: 29.4260, lng: -98.4861, label: "The Alamo, San Antonio" },
    "dallas": { lat: 32.7767, lng: -96.7970, label: "Dallas, TX" },
    "dfw airport": { lat: 32.8998, lng: -97.0403, label: "DFW International Airport" },
    "houston": { lat: 29.7604, lng: -95.3698, label: "Houston, TX" },
    "iah airport": { lat: 29.9902, lng: -95.3368, label: "George Bush Intercontinental, Houston" },
    "md anderson": { lat: 29.7075, lng: -95.3974, label: "MD Anderson Cancer Center, Houston" },
    "texas medical center": { lat: 29.7070, lng: -95.4013, label: "Texas Medical Center, Houston" },
    "austin": { lat: 30.2672, lng: -97.7431, label: "Austin, TX" },
    "fort worth": { lat: 32.7555, lng: -97.3308, label: "Fort Worth, TX" },
    "el paso": { lat: 31.7619, lng: -106.4850, label: "El Paso, TX" },
    "corpus christi": { lat: 27.8006, lng: -97.3964, label: "Corpus Christi, TX" },
    "plano": { lat: 33.0198, lng: -96.6989, label: "Plano, TX" },
    "arlington tx": { lat: 32.7357, lng: -97.1081, label: "Arlington, TX" },
    "at&t stadium": { lat: 32.7473, lng: -97.0945, label: "AT&T Stadium, Arlington" },
    "ups dallas hub": { lat: 32.8460, lng: -96.8510, label: "UPS Distribution Hub, Dallas" },

    // Florida — specific addresses
    "miami": { lat: 25.7617, lng: -80.1918, label: "Miami, FL" },
    "miami beach": { lat: 25.7907, lng: -80.1300, label: "Miami Beach, FL" },
    "jackson memorial hospital": { lat: 25.7891, lng: -80.2104, label: "Jackson Memorial Hospital, Miami" },
    "orlando": { lat: 28.5383, lng: -81.3792, label: "Orlando, FL" },
    "disney world": { lat: 28.3852, lng: -81.5639, label: "Walt Disney World, Orlando" },
    "tampa": { lat: 27.9506, lng: -82.4572, label: "Tampa, FL" },
    "jacksonville": { lat: 30.3322, lng: -81.6557, label: "Jacksonville, FL" },
    "fort lauderdale": { lat: 26.1224, lng: -80.1373, label: "Fort Lauderdale, FL" },
    "mia airport": { lat: 25.7959, lng: -80.2870, label: "Miami International Airport" },

    // New York — specific addresses
    "new york": { lat: 40.7128, lng: -74.0060, label: "New York City, NY" },
    "manhattan": { lat: 40.7831, lng: -73.9712, label: "Manhattan, NY" },
    "times square": { lat: 40.7580, lng: -73.9855, label: "Times Square, NY" },
    "brooklyn": { lat: 40.6782, lng: -73.9442, label: "Brooklyn, NY" },
    "jfk": { lat: 40.6413, lng: -73.7781, label: "JFK Airport, NY" },
    "laguardia": { lat: 40.7769, lng: -73.8740, label: "LaGuardia Airport, NY" },
    "wall street": { lat: 40.7074, lng: -74.0113, label: "Wall Street, Manhattan" },
    "grand central": { lat: 40.7527, lng: -73.9772, label: "Grand Central Terminal, NY" },
    "empire state": { lat: 40.7484, lng: -73.9857, label: "Empire State Building, NY" },
    "central park": { lat: 40.7829, lng: -73.9654, label: "Central Park, NY" },
    "mt sinai hospital": { lat: 40.7900, lng: -73.9526, label: "Mount Sinai Hospital, NY" },
    "nyu langone": { lat: 40.7421, lng: -73.9739, label: "NYU Langone Health" },
    "columbia presbyterian": { lat: 40.8404, lng: -73.9419, label: "Columbia-Presbyterian Hospital, NY" },
    "newark": { lat: 40.7357, lng: -74.1724, label: "Newark, NJ" },
    "ewr": { lat: 40.6895, lng: -74.1745, label: "Newark Liberty Airport" },
    "albany": { lat: 42.6526, lng: -73.7562, label: "Albany, NY" },
    "buffalo": { lat: 42.8864, lng: -78.8784, label: "Buffalo, NY" },
    "amazon jfk8 warehouse": { lat: 40.5825, lng: -74.1678, label: "Amazon JFK8 Fulfillment, Staten Island" },

    // Illinois / Midwest
    "chicago": { lat: 41.8781, lng: -87.6298, label: "Chicago, IL" },
    "o'hare": { lat: 41.9742, lng: -87.9073, label: "O'Hare Intl Airport, Chicago" },
    "ohare": { lat: 41.9742, lng: -87.9073, label: "O'Hare Intl Airport, Chicago" },
    "midway airport": { lat: 41.7868, lng: -87.7522, label: "Midway Airport, Chicago" },
    "rush hospital chicago": { lat: 41.8746, lng: -87.6692, label: "Rush University Medical Center" },
    "northwestern memorial": { lat: 41.8958, lng: -87.6218, label: "Northwestern Memorial Hospital" },
    "magnificent mile": { lat: 41.8942, lng: -87.6247, label: "Magnificent Mile, Chicago" },
    "navy pier": { lat: 41.8917, lng: -87.6086, label: "Navy Pier, Chicago" },
    "detroit": { lat: 42.3314, lng: -83.0458, label: "Detroit, MI" },
    "indianapolis": { lat: 39.7684, lng: -86.1581, label: "Indianapolis, IN" },
    "minneapolis": { lat: 44.9778, lng: -93.2650, label: "Minneapolis, MN" },
    "mayo clinic rochester": { lat: 44.0225, lng: -92.4667, label: "Mayo Clinic, Rochester, MN" },
    "milwaukee": { lat: 43.0389, lng: -87.9065, label: "Milwaukee, WI" },
    "cleveland": { lat: 41.4993, lng: -81.6944, label: "Cleveland, OH" },
    "cleveland clinic": { lat: 41.5026, lng: -81.6210, label: "Cleveland Clinic" },
    "columbus oh": { lat: 39.9612, lng: -82.9988, label: "Columbus, OH" },
    "columbus": { lat: 39.9612, lng: -82.9988, label: "Columbus, OH" },
    "kansas city": { lat: 39.0997, lng: -94.5786, label: "Kansas City, MO" },
    "st louis": { lat: 38.6270, lng: -90.1994, label: "St. Louis, MO" },
    "ups worldport louisville": { lat: 38.1766, lng: -85.7276, label: "UPS Worldport, Louisville, KY" },

    // Southeast
    "atlanta": { lat: 33.7490, lng: -84.3880, label: "Atlanta, GA" },
    "hartsfield jackson": { lat: 33.6407, lng: -84.4277, label: "Hartsfield-Jackson Airport, Atlanta" },
    "emory hospital": { lat: 33.7950, lng: -84.3230, label: "Emory University Hospital, Atlanta" },
    "charlotte": { lat: 35.2271, lng: -80.8431, label: "Charlotte, NC" },
    "nashville": { lat: 36.1627, lng: -86.7816, label: "Nashville, TN" },
    "memphis": { lat: 35.1495, lng: -90.0490, label: "Memphis, TN" },
    "fedex superhub memphis": { lat: 35.0520, lng: -89.9780, label: "FedEx World Hub, Memphis" },
    "new orleans": { lat: 29.9511, lng: -90.0715, label: "New Orleans, LA" },
    "birmingham": { lat: 33.5186, lng: -86.8104, label: "Birmingham, AL" },
    "richmond": { lat: 37.5407, lng: -77.4360, label: "Richmond, VA" },

    // Pacific NW
    "seattle": { lat: 47.6062, lng: -122.3321, label: "Seattle, WA" },
    "sea-tac": { lat: 47.4502, lng: -122.3088, label: "Seattle-Tacoma Airport" },
    "amazon hq seattle": { lat: 47.6220, lng: -122.3369, label: "Amazon HQ, Seattle" },
    "portland": { lat: 45.5152, lng: -122.6784, label: "Portland, OR" },
    "boise": { lat: 43.6150, lng: -116.2023, label: "Boise, ID" },

    // Mountain / Plains
    "denver": { lat: 39.7392, lng: -104.9903, label: "Denver, CO" },
    "dia": { lat: 39.8561, lng: -104.6737, label: "Denver International Airport" },
    "salt lake city": { lat: 40.7608, lng: -111.8910, label: "Salt Lake City, UT" },
    "albuquerque": { lat: 35.0844, lng: -106.6504, label: "Albuquerque, NM" },
    "oklahoma city": { lat: 35.4676, lng: -97.5164, label: "Oklahoma City, OK" },
    "omaha": { lat: 41.2565, lng: -95.9345, label: "Omaha, NE" },

    // Northeast — specific addresses
    "boston": { lat: 42.3601, lng: -71.0589, label: "Boston, MA" },
    "mass general": { lat: 42.3627, lng: -71.0689, label: "Massachusetts General Hospital" },
    "logan airport": { lat: 42.3656, lng: -71.0096, label: "Boston Logan Airport" },
    "fenway park": { lat: 42.3467, lng: -71.0972, label: "Fenway Park, Boston" },
    "washington dc": { lat: 38.9072, lng: -77.0369, label: "Washington, D.C." },
    "the white house": { lat: 38.8977, lng: -77.0365, label: "The White House, D.C." },
    "the pentagon": { lat: 38.8719, lng: -77.0563, label: "The Pentagon, Arlington, VA" },
    "walter reed": { lat: 38.9762, lng: -77.0946, label: "Walter Reed Medical Center" },
    "philadelphia": { lat: 39.9526, lng: -75.1652, label: "Philadelphia, PA" },
    "penn medicine": { lat: 39.9495, lng: -75.1928, label: "Penn Medicine, Philadelphia" },
    "pittsburgh": { lat: 40.4406, lng: -79.9959, label: "Pittsburgh, PA" },
    "upmc": { lat: 40.4422, lng: -79.9554, label: "UPMC Presbyterian, Pittsburgh" },
    "baltimore": { lat: 39.2904, lng: -76.6122, label: "Baltimore, MD" },
    "johns hopkins": { lat: 39.2968, lng: -76.5927, label: "Johns Hopkins Hospital, Baltimore" },
    "hartford": { lat: 41.7658, lng: -72.6734, label: "Hartford, CT" },
    "providence": { lat: 41.8240, lng: -71.4128, label: "Providence, RI" },

    // Misc Major
    "honolulu": { lat: 21.3069, lng: -157.8583, label: "Honolulu, HI" },
    "anchorage": { lat: 61.2181, lng: -149.9003, label: "Anchorage, AK" },

    // Famous Streets & World-Renowned Highways
    "sunset blvd": { lat: 34.0980, lng: -118.3500, label: "Sunset Boulevard, Los Angeles, CA" },
    "ocean drive": { lat: 25.7806, lng: -80.1313, label: "Ocean Drive, Miami Beach, FL" },
    "broadway": { lat: 40.7590, lng: -73.9845, label: "Broadway, Manhattan, NY" },
    "fifth ave": { lat: 40.7745, lng: -73.9656, label: "Fifth Avenue, Manhattan, NY" },
    "5th ave": { lat: 40.7745, lng: -73.9656, label: "Fifth Avenue, Manhattan, NY" },
    "las vegas blvd": { lat: 36.1147, lng: -115.1728, label: "Las Vegas Boulevard (The Strip), NV" },
    "michigan ave": { lat: 41.8942, lng: -87.6247, label: "Michigan Avenue (Magnificent Mile), Chicago, IL" },
    "market st": { lat: 37.7886, lng: -122.4068, label: "Market Street, San Francisco, CA" },
    "peachtree st": { lat: 33.7580, lng: -84.3880, label: "Peachtree Street, Atlanta, GA" },
    "wilshire blvd": { lat: 34.0622, lng: -118.3614, label: "Wilshire Boulevard, Los Angeles, CA" },
    "rodeo drive": { lat: 34.0696, lng: -118.4031, label: "Rodeo Drive, Beverly Hills, CA" },
    "bourbon st": { lat: 29.9584, lng: -90.0654, label: "Bourbon Street, New Orleans, LA" },
    "pennsylvania ave": { lat: 38.8951, lng: -77.0364, label: "Pennsylvania Avenue, Washington, DC" },
    "central ave phoenix": { lat: 33.4747, lng: -112.0736, label: "Central Avenue, Phoenix, AZ" },
    "indian school rd": { lat: 33.4938, lng: -111.9762, label: "Indian School Road, Phoenix, AZ" },
    "lombard st": { lat: 37.8021, lng: -122.4187, label: "Lombard Street, San Francisco, CA" }
};

// Export curated Famous Streets & Major Locations for automated UI selection
export const FAMOUS_LOCATIONS = [
    { name: "Hollywood Blvd, Los Angeles CA", key: "hollywood blvd", category: "Famous Street" },
    { name: "Sunset Blvd, Los Angeles CA", key: "sunset blvd", category: "Famous Street" },
    { name: "Ocean Drive, Miami Beach FL", key: "ocean drive", category: "Famous Street" },
    { name: "Broadway, Manhattan NY", key: "broadway", category: "Famous Street" },
    { name: "Fifth Avenue, Manhattan NY", key: "fifth ave", category: "Famous Street" },
    { name: "Las Vegas Blvd, Las Vegas NV", key: "las vegas blvd", category: "Famous Street" },
    { name: "Michigan Ave, Chicago IL", key: "michigan ave", category: "Famous Street" },
    { name: "Market Street, San Francisco CA", key: "market st", category: "Famous Street" },
    { name: "Rodeo Drive, Beverly Hills CA", key: "rodeo drive", category: "Famous Street" },
    { name: "Peachtree Street, Atlanta GA", key: "peachtree st", category: "Famous Street" },
    { name: "Central Ave, Phoenix AZ", key: "central ave phoenix", category: "Famous Street" },
    { name: "Sky Harbor Airport, Phoenix AZ", key: "sky harbor", category: "Airport Hub" },
    { name: "LAX Airport, Los Angeles CA", key: "lax", category: "Airport Hub" },
    { name: "JFK Airport, New York NY", key: "jfk", category: "Airport Hub" },
    { name: "O'Hare Airport, Chicago IL", key: "o'hare", category: "Airport Hub" }
];

// Advanced fuzzy geocoder — handles multi-word token matching
export function geocode(input) {
    const lower = input.toLowerCase().trim();

    // 1. Exact key match
    if (GEOCODED_DB[lower]) return GEOCODED_DB[lower];

    // 2. Check if the input contains any key as a substring
    let bestMatch = null;
    let bestScore = 0;

    for (const key of Object.keys(GEOCODED_DB)) {
        if (lower.includes(key) || key.includes(lower)) {
            const score = key.length;
            if (score > bestScore) {
                bestScore = score;
                bestMatch = GEOCODED_DB[key];
            }
        }
    }
    if (bestMatch) return bestMatch;

    // 3. Token-based matching — split input into words and find entries matching the most tokens
    const inputTokens = lower.split(/[\s,]+/).filter(t => t.length > 2);
    let topMatch = null;
    let topCount = 0;

    for (const [key, val] of Object.entries(GEOCODED_DB)) {
        const keyTokens = key.split(/[\s,]+/);
        let matchCount = 0;
        for (const token of inputTokens) {
            if (keyTokens.some(kt => kt.includes(token) || token.includes(kt))) {
                matchCount++;
            }
        }
        // Also check the label
        const labelLower = val.label.toLowerCase();
        for (const token of inputTokens) {
            if (labelLower.includes(token)) matchCount += 0.5;
        }

        if (matchCount > topCount) {
            topCount = matchCount;
            topMatch = val;
        }
    }

    if (topCount >= 1) return topMatch;

    return null;
}


