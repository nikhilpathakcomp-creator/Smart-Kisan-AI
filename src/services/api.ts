import { DiseaseAnalysisResult, MandiPriceItem, User, WeatherData } from '../types';

const API_BASE = import.meta.env.PROD
  ? 'https://smart-kisan-ai-euef.onrender.com'
  : '';

export const api = {
  // Auth
  async login(phone: string, role: string = 'farmer') {
    const res = await fetch(`${API_BASE}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone, role }),
    });
    return res.json();
  },

  async register(data: any) {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async getMe() {
  const res = await fetch(`${API_BASE}/api/auth/me`);
  return res.json();
},
  // Disease Detection AI
  async detectDisease(imageBase64: string, cropHint?: string, language: string = 'en'): Promise<DiseaseAnalysisResult> {
    const res = await fetch(`${API_BASE}/api/ai/disease-detection`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64, cropHint, language }),
    });
    return res.json();
  },

  // Chatbot
  async sendChatMessage(message: string, history: any[], language: string = 'en') {
    const res = await fetch(`${API_BASE}/api/ai/chatbot`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, language }),
    });
    return res.json();
  },

  // Weather
  async getWeather(district?: string): Promise<WeatherData> {
   const res = await fetch(`${API_BASE}${url}`);
    return res.json();
  },

  // Crop Recommendation
  async getCropRecommendations(params: any) {
    const res = await fetch(`${API_BASE}/api/agriculture/crop-recommendation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Smart Irrigation
  async getIrrigationSchedule(params: any) {
    const res = await fetch(`${API_BASE}/api/agriculture/smart-irrigation`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  // Fertilizer Recommendation & OCR
  async getFertilizerGuide(params: any) {
   const res = await fetch(`${API_BASE}/api/ai/ocr-fertilizer`, {
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    });
    return res.json();
  },

  async ocrFertilizerLabel(imageBase64: string) {
    const res = await fetch('/api/ai/ocr-fertilizer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageBase64 }),
    });
    return res.json();
  },

  // Mandi Prices
  async getMandiPrices(query?: string): Promise<MandiPriceItem[]> {
  const url = query
    ? `/api/mandi-prices?query=${encodeURIComponent(query)}`
    : '/api/mandi-prices';

  const res = await fetch(`${API_BASE}${url}`);
  return res.json();
},

  async addMandiPrice(data: any) {
    const res = await fetch('/api/mandi-prices', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Schemes
  async getSchemes() {
    const res = await fetch('/api/schemes');
    return res.json();
  },

  // Farmer Profile
  async getProfile() {
    const res = await fetch(`${API_BASE}/api/farmer/profile`);
  },

  async updateProfile(data: any) {
    const res = await fetch(`${API_BASE}/api/farmer/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  // Notifications
  // Notifications
async getNotifications() {
  const res = await fetch(`${API_BASE}/api/notifications`);
  return res.json();
},

async markNotificationsRead() {
  const res = await fetch(`${API_BASE}/api/notifications/mark-read`, {
    method: 'PUT',
  });
  return res.json();
},
}