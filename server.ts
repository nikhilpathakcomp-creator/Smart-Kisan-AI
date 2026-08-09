import 'dotenv/config';
import express from 'express';
import path from 'path';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { GoogleGenAI, Type } from '@google/genai';
import { initialMandiPrices, initialSchemes, initialWeatherData, initialNotifications } from './src/data/mockData';

const JWT_SECRET = process.env.JWT_SECRET || 'smart-kisan-ai-jwt-secret-key-2026';
const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.use(cors());
app.use(express.json({ limit: '25mb' }));

// Lazy GoogleGenAI client helper
function getGenAI() {
  const apiKey = process.env.GEMINI_API_KEY;

  

  if (!apiKey) {
    console.warn("GEMINI_API_KEY is not set.");
    return null;
  }

  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "smart-kisan-ai",
      },
    },
  });
}

// Convert image input (base64 data URL, raw base64, or HTTP URL) into mimeType and base64 string for Gemini inlineData
async function getImageBase64AndMime(input: string): Promise<{ mimeType: string; data: string } | null> {
  if (!input || typeof input !== 'string') return null;

  // Case 1: Data URL (e.g. data:image/jpeg;base64,....)
  if (input.startsWith('data:')) {
    const match = input.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      return { mimeType: match[1], data: match[2] };
    }
    const parts = input.split(';base64,');
    if (parts.length === 2) {
      const mime = parts[0].replace('data:', '') || 'image/jpeg';
      return { mimeType: mime, data: parts[1] };
    }
  }

  // Case 2: HTTP or HTTPS URL
  if (input.startsWith('http://') || input.startsWith('https://')) {
    try {
      const response = await fetch(input);
      if (!response.ok) {
        console.warn(`Failed to fetch image URL: ${input}, status: ${response.status}`);
        return null;
      }
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const contentType = response.headers.get('content-type') || 'image/jpeg';
      const mimeType = contentType.split(';')[0].trim() || 'image/jpeg';
      return {
        mimeType,
        data: buffer.toString('base64'),
      };
    } catch (e) {
      console.error('Error fetching remote image for base64 conversion:', e);
      return null;
    }
  }

  // Case 3: Raw base64 string
  return { mimeType: 'image/jpeg', data: input.trim() };
}

// In-Memory Database Store
let userDb = {
  id: 'usr_01',
  name: 'Ramesh Patil',
  phone: '9876543210',
  role: 'farmer' as 'farmer' | 'admin',
  language: 'en' as const,
  location: {
    district: 'Nashik',
    state: 'Maharashtra',
    pincode: '422001',
  },
  farmInfo: {
    landSizeAcres: 4.5,
    soilType: 'Black Cotton',
    irrigationSource: 'Drip / Well',
    primaryCrops: ['Onion', 'Tomato', 'Grapes'],
  },
};

let savedReportsStore: any[] = [
  {
    id: 'rep_101',
    cropName: 'Tomato',
    diseaseName: 'Early Blight (Alternaria solani)',
    confidenceScore: 94,
    severity: 'Moderate',
    symptoms: ['Concentric dark spots on lower mature leaves', 'Yellowing of leaf margin around lesions'],
    causes: ['High humidity combined with warm temperatures (24-29°C)', 'Over-irrigation or soil splash on leaves'],
    prevention: ['Maintain crop rotation with non-solanaceous crops', 'Mulch soil surface to reduce splashing'],
    treatments: {
      organic: ['Spray Neem oil extract (5ml/L water) or Copper Hydroxide solution every 7 days.'],
      chemical: ['Apply Mancozeb 75% WP @ 2g/L or Difenoconazole 25% EC @ 1ml/L at early symptom stage.']
    },
    recommendedProducts: ['Indofil M-45 (Mancozeb)', 'Score (Difenoconazole)', 'Neem Guard Oil'],
    analyzedAt: '2026-07-28 14:30',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80'
  }
];

let mandiPricesStore = [...initialMandiPrices];
let notificationsStore = [...initialNotifications];

// Middleware: Authenticate JWT Token
function authenticateToken(req: any, res: any, next: any) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) {
    req.user = { id: userDb.id, role: userDb.role };
    return next();
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    req.user = { id: userDb.id, role: userDb.role };
    next();
  }
}

// === AUTHENTICATION ROUTES ===
app.post('/api/auth/register', (req, res) => {
  const { name, phone, role, language, district, state, landSizeAcres, soilType } = req.body;
  userDb = {
    id: `usr_${Date.now()}`,
    name: name || 'Kisan Farmer',
    phone: phone || '9876543210',
    role: role === 'admin' ? 'admin' : 'farmer',
    language: language || 'en',
    location: {
      district: district || 'Nashik',
      state: state || 'Maharashtra',
      pincode: '422001',
    },
    farmInfo: {
      landSizeAcres: parseFloat(landSizeAcres) || 3.0,
      soilType: soilType || 'Black Cotton',
      irrigationSource: 'Drip / Well',
      primaryCrops: ['Wheat', 'Onion', 'Tomato'],
    },
  };

  const token = jwt.sign({ id: userDb.id, role: userDb.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: userDb });
});

app.post('/api/auth/login', (req, res) => {
  const { phone, role } = req.body;
  if (role) {
    userDb.role = role === 'admin' ? 'admin' : 'farmer';
  }
  if (phone) {
    userDb.phone = phone;
  }
  const token = jwt.sign({ id: userDb.id, role: userDb.role }, JWT_SECRET, { expiresIn: '7d' });
  res.json({ token, user: userDb });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: userDb });
});

  

// === AI CHATBOT & VOICE ASSISTANT API ===
app.post('/api/ai/chatbot', async (req, res) => {
  const { message, history, language } = req.body;
  const ai = getGenAI();
  const msg = message.trim().toLowerCase();
  const isMandiQuestion =
  msg.includes('mandi') ||
  msg.includes('market price') ||
  msg.includes('market rate') ||
  msg.includes('onion price') ||
  msg.includes('onion rate') ||
  msg.includes('check mandi prices') ||
  msg.includes('mandi prices near me') ||
  msg.includes('भाव') ||
  msg.includes('बाजार भाव') ||
  msg.includes('कांदा भाव') ||
  msg.includes('कांद्याचा भाव');
  if (isMandiQuestion) {
  const mandiResults = [...mandiPricesStore];

  if (mandiResults.length > 0) {
    const prices = mandiResults.slice(0, 5).map((m: any) =>
      `${m.mandiName} (${m.district}): ₹${m.modalPrice}/quintal`
    );

    return res.json({
      reply: `Current Mandi prices:\n\n${prices.join('\n')}`,
      suggestedActions: [
        'What is the current Mandi price for Onion?',
        'Check Tomato Mandi price',
        'Check Potato Mandi price'
      ]
    });
  }

  return res.json({
    reply: 'Mandi price data is currently unavailable.',
    suggestedActions: [
      'Try again later',
      'Check another crop'
    ]
  });
}

  const sysInstruction = `
You are Krishi Mitra, a friendly AI farming assistant for Indian farmers.

Language:
Respond in ${language === 'hi' ? 'Hindi' : language === 'mr' ? 'Marathi' : 'English'}.

Important conversation rules:
1. If the user says a simple greeting such as "hi", "hello", "hey", "namaste", or "namaskar", reply with a short friendly greeting and ask how you can help. Do NOT give farming advice unless the user asks for it.
2. Answer the user's actual question directly. Do not give unrelated farming information.
3. Do not start answers with "Regarding..." unless the user specifically asks about something.
4. For farming questions, provide practical, easy-to-follow and accurate advice about crops, pests, diseases, weather, fertilizers, irrigation, markets and government schemes.
5. Keep normal answers concise and actionable, using 3-5 points when appropriate.
6. If the user asks something outside farming, politely explain that you are Krishi Mitra and can mainly help with agriculture-related questions.
7. Never invent information. If you are unsure, clearly say so.
`;
  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite',
        contents: [
          ...((history || []).map((h: any) => ({
            role: h.sender === 'user' ? 'user' : 'model',
            parts: [{ text: h.text }]
          }))),
          { role: 'user', parts: [{ text: message }] }
        ],
        config: {
          systemInstruction: sysInstruction,
        }
      });

      return res.json({
        reply: response.text || 'I am ready to help with your farm query!',
        suggestedActions: [
          'What is the current Mandi price for Onion?',
          'Suggest fertilizers for Tomato vegetative stage',
          'How to apply for PM-Kisan scheme?'
        ]
      });
    } catch (err) {
      console.error('Gemini chatbot error:', err);
    }
  }

  // Fallback response


if (
  ['hi', 'hello', 'hey', 'hii', 'namaste', 'namaskar'].includes(msg)
) {
  return res.json({
    reply: 'Namaste! 👋 How can I help you with farming today?',
    suggestedActions: [
      'Check Mandi prices near me',
      'Recommended crops for Kharif season'
    ]
  });
}
// Gemini unavailable fallback
return res.status(503).json({
  reply: 'AI service is temporarily unavailable. Please try again shortly.',
  suggestedActions: [
    'Check Mandi prices near me',
    'Recommended crops for Kharif season'
  ]
});

});


  


const districtCoordinates: Record<string, { lat: number; lon: number }> = {
  Ahilyanagar: { lat: 19.0948, lon: 74.7480 },
  Akola: { lat: 20.7002, lon: 77.0082 },
  Amravati: { lat: 20.9374, lon: 77.7796 },
  'Chhatrapati Sambhajinagar': { lat: 19.8762, lon: 75.3433 },
  Beed: { lat: 18.9891, lon: 75.7601 },
  Bhandara: { lat: 21.1700, lon: 79.6500 },
  Buldhana: { lat: 20.5293, lon: 76.1840 },
  Chandrapur: { lat: 19.9700, lon: 79.3000 },
  Dhule: { lat: 20.9042, lon: 74.7749 },
  Gadchiroli: { lat: 20.1809, lon: 80.0000 },
  Gondia: { lat: 21.4624, lon: 80.2209 },
  Hingoli: { lat: 19.7170, lon: 77.1500 },
  Jalgaon: { lat: 21.0077, lon: 75.5626 },
  Jalna: { lat: 19.8347, lon: 75.8816 },
  Kolhapur: { lat: 16.7050, lon: 74.2433 },
  Latur: { lat: 18.4088, lon: 76.5604 },
  Mumbai: { lat: 19.0760, lon: 72.8777 },
  Nagpur: { lat: 21.1458, lon: 79.0882 },
  Nanded: { lat: 19.1383, lon: 77.3210 },
  Nandurbar: { lat: 21.3667, lon: 74.2333 },
  Nashik: { lat: 20.0059, lon: 73.7910 },
  Dharashiv: { lat: 18.1860, lon: 76.0419 },
  Palghar: { lat: 19.6967, lon: 72.7653 },
  Parbhani: { lat: 19.2608, lon: 76.7750 },
  Pune: { lat: 18.5204, lon: 73.8567 },
  Raigad: { lat: 18.6414, lon: 72.8722 },
  Ratnagiri: { lat: 16.9902, lon: 73.3120 },
  Sangli: { lat: 16.8524, lon: 74.5815 },
  Satara: { lat: 17.6805, lon: 74.0183 },
  Sindhudurg: { lat: 16.3492, lon: 73.5594 },
  Solapur: { lat: 17.6599, lon: 75.9064 },
  Thane: { lat: 19.2183, lon: 72.9781 },
  Wardha: { lat: 20.7453, lon: 78.6022 },
  Washim: { lat: 20.1110, lon: 77.1330 },
  Yavatmal: { lat: 20.3888, lon: 78.1204 }
};
// === WEATHER API ===
function getWeatherCondition(code: number): string {
  if (code === 0) return 'Clear Sky';
  if (code === 1) return 'Mainly Clear';
  if (code === 2) return 'Partly Cloudy';
  if (code === 3) return 'Overcast';

  if ([45, 48].includes(code)) return 'Foggy';

  if ([51, 53, 55].includes(code)) return 'Drizzle';

  if ([56, 57].includes(code)) return 'Freezing Drizzle';

  if ([61, 63, 65].includes(code)) return 'Rain';

  if ([66, 67].includes(code)) return 'Freezing Rain';

  if ([71, 73, 75, 77].includes(code)) return 'Snow';

  if ([80, 81, 82].includes(code)) return 'Rain Showers';

  if ([85, 86].includes(code)) return 'Snow Showers';

  if ([95, 96, 99].includes(code)) return 'Thunderstorm';

  return 'Unknown Weather';
}
// === LIVE WEATHER API ===
app.get('/api/weather', async (req, res) => {
  try {
    const district =
      (req.query.district as string) || userDb.location.district;

    const coordinates =
        districtCoordinates[district] || districtCoordinates.Nashik;

    const latitude = coordinates.lat;
    const longitude = coordinates.lon;

    const url =
      `https://api.open-meteo.com/v1/forecast` +
      `?latitude=${latitude}` +
      `&longitude=${longitude}` +
      `&current=temperature_2m,relative_humidity_2m,precipitation,weather_code,wind_speed_10m` +
      `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weather_code,precipitation_sum` +
      `&timezone=Asia%2FKolkata` +
      `&forecast_days=7`;

    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    res.json({
      city: district,
      state: 'Maharashtra',

      tempC: data.current.temperature_2m,
      condition: getWeatherCondition(data.current.weather_code),
      icon: 'cloud-sun',
      humidity: data.current.relative_humidity_2m,
      windKmvh: data.current.wind_speed_10m,
      rainfallMm: data.current.precipitation,
      uvIndex: 0,

      alerts: [],

      forecast: data.daily.time.map((date: string, i: number) => ({
        day: i === 0 ? 'Today' : new Date(date).toLocaleDateString('en-IN', {
          weekday: 'short'
        }),
        date,
        highC: data.daily.temperature_2m_max[i],
        lowC: data.daily.temperature_2m_min[i],
        condition: getWeatherCondition(data.daily.weather_code[i]),
        rainProb: data.daily.precipitation_probability_max[i],
        icon: 'cloud-sun'
      }))
    });

  } catch (error) {
    console.error('Weather API error:', error);

    res.status(500).json({
      error: 'Unable to fetch live weather data'
    });
  }
});

// === CROP RECOMMENDATION API ===
app.post('/api/agriculture/crop-recommendation', async (req, res) => {
  const { soilType, season, rainfall, state, district, npk } = req.body;
  const ai = getGenAI();

  if (ai) {
    try {
      const prompt = `As an agricultural scientist, recommend 3 ideal crops for a farmer in ${district || 'Nashik'}, ${state || 'Maharashtra'} with:
- Soil Type: ${soilType || 'Black Cotton'}
- Season: ${season || 'Kharif'}
- Rainfall: ${rainfall || 'Moderate (800mm)'}
- NPK: N:${npk?.n || 40}, P:${npk?.p || 30}, K:${npk?.k || 20}

Return JSON array of 3 objects with properties:
cropName, suitabilityScore (85-98), reasoning, expectedYieldPerAcre (e.g. "25-30 Quintals"), growthDurationDays (number), avgMarketPricePerQuintal (number in INR), waterRequirement ("Low"|"Medium"|"High"), bestPlantingMonth.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.6-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const parsed = JSON.parse(response.text || '[]');
      return res.json(parsed);
    } catch (err) {
      console.error('Gemini crop recommendation error:', err);
    }
  }

  // Domain fallback recommendations
  res.json([
    {
      cropName: 'Soybean (JS-335 / DS-228)',
      suitabilityScore: 96,
      reasoning: 'Excellent nitrogen fixation suited for Black Cotton soil in Kharif season.',
      expectedYieldPerAcre: '10 - 12 Quintals',
      growthDurationDays: 100,
      avgMarketPricePerQuintal: 4600,
      waterRequirement: 'Medium',
      bestPlantingMonth: 'June - July'
    },
    {
      cropName: 'Red Gram / Pigeon Pea (Tur)',
      suitabilityScore: 92,
      reasoning: 'Deep root system tolerates intermittent rainfall spells and improves soil structure.',
      expectedYieldPerAcre: '7 - 9 Quintals',
      growthDurationDays: 160,
      avgMarketPricePerQuintal: 7100,
      waterRequirement: 'Low',
      bestPlantingMonth: 'June'
    },
    {
      cropName: 'Cotton (Bt Hybrid)',
      suitabilityScore: 89,
      reasoning: 'High revenue potential with good moisture retention in heavy clay/black soils.',
      expectedYieldPerAcre: '12 - 15 Quintals',
      growthDurationDays: 150,
      avgMarketPricePerQuintal: 7200,
      waterRequirement: 'Medium',
      bestPlantingMonth: 'June - July'
    }
  ]);
});

// === SMART IRRIGATION API ===
app.post('/api/agriculture/smart-irrigation', (req, res) => {
  const { cropName, cropStage, soilMoisture } = req.body;
  const moisture = parseInt(soilMoisture) || 42;

  let schedule = {
    cropName: cropName || 'Tomato',
    cropStage: cropStage || 'Flowering & Fruit Setting',
    soilMoisturePercent: moisture,
    recommendation: moisture < 50
      ? 'Irrigation Required: Soil moisture is below threshold (50%). Apply 3.5mm drip irrigation tomorrow morning between 6:00 AM - 8:00 AM.'
      : 'Soil Moisture Optimal: No immediate watering required. Next review in 48 hours.',
    waterVolumeLitersPerAcre: moisture < 50 ? 14000 : 0,
    nextWateringTime: moisture < 50 ? 'Tomorrow, 6:00 AM' : 'In 2 days',
    irrigationMethod: 'Drip Irrigation with 1.6 LPH emitters',
    weatherImpactAdvice: 'Rain probability is 20% today. Proceed with scheduled morning irrigation cycle.'
  };

  res.json(schedule);
});

// === FERTILIZER RECOMMENDATION & OCR API ===
app.post('/api/agriculture/fertilizer-recommendation', (req, res) => {
  const { cropName, growthStage, soilCondition } = req.body;

  res.json({
    cropName: cropName || 'Onion',
    growthStage: growthStage || 'Vegetative (30 Days After Transplanting)',
    targetNPK: { n: 100, p: 50, k: 50 },
    recommendedFertilizers: [
      {
        name: 'Urea (46% N)',
        dosagePerAcre: '35 kg / acre',
        applicationMethod: 'Top dressing near root zone',
        timing: '30 days after transplanting (DAT)'
      },
      {
        name: 'Single Super Phosphate (SSP 16% P2O5)',
        dosagePerAcre: '125 kg / acre',
        applicationMethod: 'Basal dose before planting',
        timing: 'At land preparation stage'
      },
      {
        name: 'Muriate of Potash (MOP 60% K2O)',
        dosagePerAcre: '30 kg / acre',
        applicationMethod: 'Split application (Basal + 45 DAT)',
        timing: 'Split in 2 equal doses'
      }
    ],
    safetyTips: [
      'Avoid mixing Urea directly with Lime or Rock Phosphate.',
      'Wear gloves during manual fertilizer broadcast.',
      'Ensure field has moist soil before top dressing Urea.'
    ]
  });
});

app.post('/api/ai/ocr-fertilizer', async (req, res) => {
  const { imageBase64 } = req.body;
  const ai = getGenAI();

  if (ai && imageBase64) {
    try {
      const imgData = await getImageBase64AndMime(imageBase64);
      if (imgData) {
        const prompt = `Perform OCR on this fertilizer / pesticide product bag or bottle label.
Extract:
1. Product / Brand Name
2. N-P-K percentage ratio or active chemical ingredient
3. Recommended Dosage per acre
4. Target Crops & Safety Cautions
Return ONLY JSON with these exact keys:
{
  "productName": "string",
  "npkRatio": "string",
  "dosagePerAcre": "string",
  "targetCrops": "string",
  "safetyCautions": "string"
}`;

        const response = await ai.models.generateContent({
  model: 'gemini-3.1-flash-lite',
  contents: [
    {
      parts: [
        { inlineData: { mimeType: imgData.mimeType, data: imgData.data } },
        { text: prompt }
      ]
    }
  ],
  config: {
    responseMimeType: 'application/json'
  }
});

        return res.json(JSON.parse(response.text || '{}'));
      }
    } catch (err) {
      console.error('Fertilizer OCR error:', err);
    }
  }

  res.json({
    productName: 'IFFCO NPK 19:19:19 Water Soluble Fertilizer',
    npkRatio: '19% Nitrogen, 19% Phosphorus, 19% Potassium',
    dosagePerAcre: '5 kg per acre via fertigation or 1 kg / 200L water spray',
    targetCrops: 'All agricultural crops, vegetables, and fruit orchards',
    safetyCautions: 'Store in cool dry place. Keep away from direct sunlight and children.'
  });
});

// === MANDI PRICES API ===
app.get('/api/mandi-prices', (req, res) => {
  const { query, district } = req.query;
  let items = [...mandiPricesStore];

  if (query) {
    const q = (query as string).toLowerCase();
    items = items.filter(
      (m) =>
        m.cropName.toLowerCase().includes(q) ||
        m.mandiName.toLowerCase().includes(q) ||
        m.district.toLowerCase().includes(q)
    );
  }

  res.json(items);
});

app.post('/api/mandi-prices', authenticateToken, (req, res) => {
  if ((req as any).user?.role !== 'admin') {
    return res.status(403).json({ error: 'Only admins can add/update Mandi prices' });
  }

  const { mandiName, district, state, cropName, variety, minPrice, maxPrice, modalPrice, priceTrend } = req.body;
  const newItem = {
    id: `m_${Date.now()}`,
    mandiName,
    district,
    state,
    cropName,
    variety,
    minPrice: Number(minPrice),
    maxPrice: Number(maxPrice),
    modalPrice: Number(modalPrice),
    priceTrend: priceTrend || 'stable',
    lastUpdated: 'Just now',
    distanceKm: Math.floor(Math.random() * 40) + 10
  };

  mandiPricesStore.unshift(newItem);
  res.json(newItem);
});

// === GOVERNMENT SCHEMES API ===
app.get('/api/schemes', (req, res) => {
  res.json(initialSchemes);
});

// === FARMER PROFILE & REPORTS ===
app.get('/api/farmer/profile', authenticateToken, (req, res) => {
  res.json({
    user: userDb,
    savedReports: savedReportsStore
  });
});

app.put('/api/farmer/profile', authenticateToken, (req, res) => {
  const { name, phone, landSizeAcres, soilType, primaryCrops } = req.body;
  if (name) userDb.name = name;
  if (phone) userDb.phone = phone;
  if (landSizeAcres) userDb.farmInfo.landSizeAcres = Number(landSizeAcres);
  if (soilType) userDb.farmInfo.soilType = soilType;
  if (primaryCrops) userDb.farmInfo.primaryCrops = primaryCrops;

  res.json(userDb);
});

// === NOTIFICATIONS API ===
app.get('/api/notifications', (req, res) => {
  res.json(notificationsStore);
});

app.put('/api/notifications/mark-read', (req, res) => {
  notificationsStore = notificationsStore.map((n) => ({ ...n, isRead: true }));
  res.json({ status: 'ok' });
});

// === ADMIN ANALYTICS ===
app.get('/api/admin/analytics', authenticateToken, (req, res) => {
  res.json({
    totalRegisteredFarmers: 14250,
    totalScansPerformed: 38920,
    diseaseOutbreaksAlerts: [
      { district: 'Nashik', crop: 'Grapes', disease: 'Downy Mildew', risk: 'High' },
      { district: 'Ludhiana', crop: 'Paddy', disease: 'False Smut', risk: 'Medium' },
      { district: 'Indore', crop: 'Soybean', disease: 'Yellow Mosaic', risk: 'Low' }
    ],
    topSearchedCrops: ['Onion', 'Wheat', 'Tomato', 'Soybean', 'Cotton']
  });
});

// === VITE MIDDLEWARE SETUP ===
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, () => {
  console.log(`Smart Kisan AI Backend running on port ${PORT}`);
});
}

startServer();

