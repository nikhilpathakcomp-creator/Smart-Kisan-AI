export type Language = 'en' | 'hi' | 'mr';

export type UserRole = 'farmer' | 'admin';

export interface User {
  id: string;
  name: string;
  phone: string;
  role: UserRole;
  language: Language;
  location: {
    district: string;
    state: string;
    pincode: string;
  };
  farmInfo: {
    landSizeAcres: number;
    soilType: string;
    irrigationSource: string;
    primaryCrops: string[];
  };
}

export interface DiseaseAnalysisResult {
  id: string;
  cropName: string;
  diseaseName: string;
  confidenceScore: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptoms: string[];
  causes: string[];
  prevention: string[];
  treatments: {
    organic: string[];
    chemical: string[];
  };
  recommendedProducts: string[];
  analyzedAt: string;
  imageUrl?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  timestamp: string;
  suggestedActions?: string[];
  audioUrl?: string;
}

export interface WeatherData {
  city: string;
  state: string;
  tempC: number;
  condition: string;
  icon: string;
  humidity: number;
  windKmvh: number;
  rainfallMm: number;
  uvIndex: number;
  alerts: string[];
  forecast: Array<{
    day: string;
    date: string;
    highC: number;
    lowC: number;
    condition: string;
    rainProb: number;
    icon: string;
  }>;
}

export interface CropRecommendationResult {
  cropName: string;
  suitabilityScore: number;
  reasoning: string;
  expectedYieldPerAcre: string;
  growthDurationDays: number;
  avgMarketPricePerQuintal: number;
  waterRequirement: string;
  bestPlantingMonth: string;
}

export interface SmartIrrigationSchedule {
  cropName: string;
  cropStage: string;
  soilMoisturePercent: number;
  recommendation: string;
  waterVolumeLitersPerAcre: number;
  nextWateringTime: string;
  irrigationMethod: string;
  weatherImpactAdvice: string;
}

export interface FertilizerRecommendationResult {
  cropName: string;
  growthStage: string;
  targetNPK: { n: number; p: number; k: number };
  recommendedFertilizers: Array<{
    name: string;
    dosagePerAcre: string;
    applicationMethod: string;
    timing: string;
  }>;
  safetyTips: string[];
}

export interface MandiPriceItem {
  id: string;
  mandiName: string;
  district: string;
  state: string;
  cropName: string;
  variety: string;
  minPrice: number;
  maxPrice: number;
  modalPrice: number;
  priceTrend: 'up' | 'down' | 'stable';
  lastUpdated: string;
  distanceKm: number;
}

export interface GovernmentScheme {
  id: string;
  title: { en: string; hi: string; mr: string };
  category: string;
  financialBenefit: string;
  eligibility: string[];
  documentsRequired: string[];
  applicationProcess: string;
  officialLink: string;
  popular: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'weather' | 'irrigation' | 'fertilizer' | 'disease' | 'price' | 'scheme';
  timestamp: string;
  isRead: boolean;
  priority: 'low' | 'medium' | 'high';
}
