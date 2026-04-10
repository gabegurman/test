export interface Business {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phoneNumber?: string;
  website?: string;
  rating?: number;
  userRatings?: number;
  placeId: string;
}

export interface NAICSCategory {
  code: string;
  name: string;
  googleType: string; // Google Places type to search for
}

export interface SearchFilters {
  naicsCode: string;
  radius: number;
}
