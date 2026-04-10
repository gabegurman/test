import { NAICSCategory } from '../types';

// Common NAICS codes mapped to Google Places types
// Full NAICS system is extensive, these are common categories
export const NAICS_CATEGORIES: NAICSCategory[] = [
  // Food & Beverage
  { code: '7225', name: 'Restaurants', googleType: 'restaurant' },
  { code: '7224', name: 'Snack Bars', googleType: 'cafe' },
  { code: '7221', name: 'Full-Service Restaurants', googleType: 'restaurant' },
  { code: '7222', name: 'Limited-Service Restaurants', googleType: 'restaurant' },

  // Retail
  { code: '4451', name: 'Grocery Stores', googleType: 'grocery_or_supermarket' },
  { code: '4482', name: 'Specialty Food Stores', googleType: 'grocery_or_supermarket' },
  { code: '4529', name: 'Other General Merchandise Stores', googleType: 'shopping_mall' },
  { code: '4481', name: 'Clothing Stores', googleType: 'clothing_store' },

  // Health & Medical
  { code: '6211', name: 'Offices of Physicians', googleType: 'doctor' },
  { code: '6212', name: 'Offices of Dentists', googleType: 'dentist' },
  { code: '6213', name: 'Offices of Other Health Practitioners', googleType: 'health' },
  { code: '6221', name: 'General Medical Hospitals', googleType: 'hospital' },
  { code: '8062', name: 'Ambulatory Surgical Centers', googleType: 'hospital' },

  // Professional Services
  { code: '5411', name: 'Legal Services', googleType: 'lawyer' },
  { code: '5412', name: 'Accounting Services', googleType: 'accounting' },
  { code: '5416', name: 'Management Consulting', googleType: 'consulting' },

  // Entertainment
  { code: '7111', name: 'Theater Companies', googleType: 'movie_theater' },
  { code: '7139', name: 'Other Amusement & Recreation', googleType: 'amusement_park' },
  { code: '7211', name: 'Traveler Accommodations', googleType: 'lodging' },
  { code: '7223', name: 'Snack Food Concessionaires', googleType: 'cafe' },

  // Financial Services
  { code: '5221', name: 'Banks', googleType: 'bank' },
  { code: '5222', name: 'Credit Unions', googleType: 'bank' },
  { code: '5231', name: 'Securities Brokerages', googleType: 'finance' },

  // Fitness & Wellness
  { code: '7131', name: 'Fitness & Recreation Centers', googleType: 'gym' },
  { code: '8121', name: 'Spas', googleType: 'spa' },

  // Real Estate
  { code: '5311', name: 'Real Estate Agents', googleType: 'real_estate_agency' },
  { code: '5312', name: 'Real Estate Management', googleType: 'real_estate_agency' },

  // Automotive
  { code: '4411', name: 'Automotive Dealers', googleType: 'car_dealer' },
  { code: '8111', name: 'Automotive Repair & Maintenance', googleType: 'car_repair' },

  // Education
  { code: '6111', name: 'Elementary Schools', googleType: 'school' },
  { code: '6112', name: 'Secondary Schools', googleType: 'school' },
  { code: '6113', name: 'Colleges & Universities', googleType: 'school' },
];

export function getNAICSLabel(code: string): string {
  const category = NAICS_CATEGORIES.find(cat => cat.code === code);
  return category ? category.name : code;
}

export function getGoogleTypeForNAICS(code: string): string {
  const category = NAICS_CATEGORIES.find(cat => cat.code === code);
  return category ? category.googleType : 'establishment';
}
