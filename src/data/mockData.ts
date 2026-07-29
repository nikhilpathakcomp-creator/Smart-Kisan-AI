import { GovernmentScheme, MandiPriceItem, NotificationItem, WeatherData } from '../types';

export const sampleCropPhotos = [
  {
    id: 'rice-blast',
    title: 'Paddy / Rice Leaf Blast',
    crop: 'Rice / Paddy',
    imageUrl: 'https://images.unsplash.com/photo-1586771107445-d3ca888129ff?auto=format&fit=crop&w=600&q=80',
    description: 'Spindle-shaped lesions on leaves with brown borders and grayish center.'
  },
  {
    id: 'cotton-curl',
    title: 'Cotton Leaf Curl Virus',
    crop: 'Cotton',
    imageUrl: 'https://images.unsplash.com/photo-1599813390234-a690740a3598?auto=format&fit=crop&w=600&q=80',
    description: 'Upward or downward curling of leaf margins with thickened veins.'
  },
  {
    id: 'tomato-blight',
    title: 'Tomato Early Blight',
    crop: 'Tomato',
    imageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=600&q=80',
    description: 'Concentric ring target spots on lower mature leaves turning yellow.'
  },
  {
    id: 'wheat-rust',
    title: 'Wheat Yellow Rust',
    crop: 'Wheat',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=600&q=80',
    description: 'Yellow stripe pustules arranged linearly along leaf veins.'
  },
  {
    id: 'maize-healthy',
    title: 'Healthy Maize / Corn Crop',
    crop: 'Maize',
    imageUrl: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=600&q=80',
    description: 'Lush green healthy leaves free of fungal or pest infection.'
  }
];

export const initialWeatherData: WeatherData = {
  city: 'Nashik',
  state: 'Maharashtra',
  tempC: 28,
  condition: 'Partly Cloudy',
  icon: 'cloud-sun',
  humidity: 68,
  windKmvh: 14,
  rainfallMm: 4.2,
  uvIndex: 6,
  alerts: [
    'Moderate rain expected on Thursday evening. Delay pesticide spraying.',
    'High humidity alert: Monitor grapes & tomatoes for downy mildew.'
  ],
  forecast: [
    { day: 'Today', date: '29 Jul', highC: 30, lowC: 22, condition: 'Partly Cloudy', rainProb: 20, icon: 'cloud-sun' },
    { day: 'Thu', date: '30 Jul', highC: 27, lowC: 21, condition: 'Moderate Rain', rainProb: 80, icon: 'cloud-rain' },
    { day: 'Fri', date: '31 Jul', highC: 26, lowC: 20, condition: 'Heavy Showers', rainProb: 90, icon: 'cloud-lightning' },
    { day: 'Sat', date: '01 Aug', highC: 28, lowC: 21, condition: 'Light Rain', rainProb: 40, icon: 'cloud-drizzle' },
    { day: 'Sun', date: '02 Aug', highC: 31, lowC: 22, condition: 'Sunny', rainProb: 10, icon: 'sun' },
    { day: 'Mon', date: '03 Aug', highC: 32, lowC: 23, condition: 'Clear Sky', rainProb: 5, icon: 'sun' },
    { day: 'Tue', date: '04 Aug', highC: 29, lowC: 22, condition: 'Scattered Clouds', rainProb: 25, icon: 'cloud' }
  ]
};

export const initialMandiPrices: MandiPriceItem[] = [
  {
    id: '1',
    mandiName: 'Nashik APMC Main Mandi',
    district: 'Nashik',
    state: 'Maharashtra',
    cropName: 'Onion (Red)',
    variety: 'Garwa',
    minPrice: 1800,
    maxPrice: 2450,
    modalPrice: 2200,
    priceTrend: 'up',
    lastUpdated: 'Today, 07:30 AM',
    distanceKm: 12
  },
  {
    id: '2',
    mandiName: 'Pimplegaon APMC',
    district: 'Nashik',
    state: 'Maharashtra',
    cropName: 'Tomato',
    variety: 'Hybrid Red',
    minPrice: 1200,
    maxPrice: 1850,
    modalPrice: 1600,
    priceTrend: 'down',
    lastUpdated: 'Today, 08:00 AM',
    distanceKm: 28
  },
  {
    id: '3',
    mandiName: 'Vashi APMC Navi Mumbai',
    district: 'Thane',
    state: 'Maharashtra',
    cropName: 'Wheat',
    variety: 'Lokwan',
    minPrice: 2600,
    maxPrice: 3100,
    modalPrice: 2900,
    priceTrend: 'stable',
    lastUpdated: 'Today, 06:45 AM',
    distanceKm: 140
  },
  {
    id: '4',
    mandiName: 'Indore APMC Market',
    district: 'Indore',
    state: 'Madhya Pradesh',
    cropName: 'Soybean',
    variety: 'JS-335',
    minPrice: 4200,
    maxPrice: 4850,
    modalPrice: 4600,
    priceTrend: 'up',
    lastUpdated: 'Today, 08:15 AM',
    distanceKm: 310
  },
  {
    id: '5',
    mandiName: 'Ludhiana Grain Market',
    district: 'Ludhiana',
    state: 'Punjab',
    cropName: 'Paddy / Rice',
    variety: 'Basmati 1121',
    minPrice: 3600,
    maxPrice: 4250,
    modalPrice: 4000,
    priceTrend: 'up',
    lastUpdated: 'Today, 07:00 AM',
    distanceKm: 1250
  },
  {
    id: '6',
    mandiName: 'Gultekdi APMC Pune',
    district: 'Pune',
    state: 'Maharashtra',
    cropName: 'Cotton',
    variety: 'Medium Staple',
    minPrice: 6800,
    maxPrice: 7500,
    modalPrice: 7200,
    priceTrend: 'stable',
    lastUpdated: 'Today, 08:30 AM',
    distanceKm: 195
  }
];

export const initialSchemes: GovernmentScheme[] = [
  {
    id: 'pm-kisan',
    title: {
      en: 'PM-KISAN Samman Nidhi Yojana',
      hi: 'पीएम किसान सम्मान निधि योजना',
      mr: 'पीएम किसान सन्मान निधी योजना'
    },
    category: 'Direct Income Support',
    financialBenefit: '₹6,000 per year in 3 equal installments of ₹2,000',
    eligibility: [
      'Small and marginal landholding farmer families',
      'Valid cultivable land registered under farmer name',
      'Aadhaar card linked with active bank account'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Land Ownership Document (7/12 Extract / Khatauni)',
      'Bank Passbook Copy',
      'Mobile Number'
    ],
    applicationProcess: 'Register online at PM-KISAN portal or visit nearest Common Service Centre (CSC) with land papers.',
    officialLink: 'https://pmkisan.gov.in',
    popular: true
  },
  {
    id: 'pmfby',
    title: {
      en: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
      hi: 'प्रधानमंत्री फसल बीमा योजना',
      mr: 'पंतप्रधान पीक विमा योजना'
    },
    category: 'Crop Insurance',
    financialBenefit: 'Full financial cover against crop damage due to drought, floods, pests or hail at low premium (1.5% - 2%)',
    eligibility: [
      'All farmers including sharecroppers and tenant farmers growing notified crops',
      'Enrollment within cut-off dates for Kharif and Rabi seasons'
    ],
    documentsRequired: [
      'Farmer Identity Card / Aadhaar',
      'Sowing Certificate issued by Patwari / Sarpanch',
      'Bank Account details',
      '7/12 Land record extract'
    ],
    applicationProcess: 'Apply through bank branch, insurance agent, or directly on PMFBY portal before crop cutoff date.',
    officialLink: 'https://pmfby.gov.in',
    popular: true
  },
  {
    id: 'kcc',
    title: {
      en: 'Kisan Credit Card (KCC) Scheme',
      hi: 'किसान क्रेडिट कार्ड (KCC) योजना',
      mr: 'किसान क्रेडिट कार्ड योजना'
    },
    category: 'Agricultural Credit',
    financialBenefit: 'Low interest farm credit up to ₹3 Lakh at effective 4% interest rate (with timely repayment subsidy)',
    eligibility: [
      'Individual/joint borrower farmers',
      'Tenant farmers, oral lessees, and SHGs',
      'Animal husbandry and fisheries farmers'
    ],
    documentsRequired: [
      'Application form filled',
      'Identity & Address Proof (Aadhaar / Voter ID)',
      'Land cultivation documents',
      'Passport size photographs'
    ],
    applicationProcess: 'Submit completed KCC form at your local bank branch along with land documents.',
    officialLink: 'https://www.rbi.org.in',
    popular: true
  },
  {
    id: 'soil-card',
    title: {
      en: 'Soil Health Card Scheme',
      hi: 'मृदा स्वास्थ्य कार्ड योजना',
      mr: 'माती आरोग्य पत्रिका योजना'
    },
    category: 'Soil Management',
    financialBenefit: 'Free comprehensive soil testing report covering 12 nutrient parameters with crop-wise fertilizer recommendations',
    eligibility: [
      'All farmers across India possessing agricultural land'
    ],
    documentsRequired: [
      'Aadhaar Card',
      'Soil sample collected from farm by Agriculture Extension Officer'
    ],
    applicationProcess: 'Contact District Agriculture Officer or Krishi Vigyan Kendra (KVK) for soil sample collection.',
    officialLink: 'https://soilhealth.dac.gov.in',
    popular: false
  }
];

export const initialNotifications: NotificationItem[] = [
  {
    id: 'n1',
    title: 'Rain Alert: Nashik District',
    message: 'Moderate to heavy rainfall predicted tomorrow afternoon. Secure harvested crops and postpone chemical spraying.',
    type: 'weather',
    timestamp: '10 minutes ago',
    isRead: false,
    priority: 'high'
  },
  {
    id: 'n2',
    title: 'Smart Irrigation Reminder',
    message: 'Your Tomato field moisture is at 42%. Scheduled drip irrigation of 35mm for tomorrow morning 6:00 AM.',
    type: 'irrigation',
    timestamp: '1 hour ago',
    isRead: false,
    priority: 'medium'
  },
  {
    id: 'n3',
    title: 'Mandi Price Spike: Red Onion',
    message: 'Red Onion prices at Nashik APMC increased by ₹250/Quintal today to reach ₹2,450/Qtl.',
    type: 'price',
    timestamp: '3 hours ago',
    isRead: true,
    priority: 'medium'
  },
  {
    id: 'n4',
    title: 'PM-KISAN 17th Installment Out',
    message: 'Government released ₹2,000 installment. Check your registered bank account statement.',
    type: 'scheme',
    timestamp: 'Yesterday',
    isRead: true,
    priority: 'low'
  }
];
