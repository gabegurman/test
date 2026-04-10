# Business Search Map

A React web application for searching businesses by industry classification (NAICS codes) using Google Maps and Google Places API.

## Features

- 🗺️ Interactive Google Map with zoom and pan
- 🔍 Search businesses by NAICS industry codes
- 📍 Automatic geolocation to user's current location
- 🔄 Auto-search on map movement with customizable search radius
- 📊 CSV export of search results
- ⭐ Display business ratings and reviews
- 📞 Business contact information

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Create Google Cloud Project and API Keys

You'll need to set up API keys for:
- **Google Maps JavaScript API**
- **Places API**

Steps:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the following APIs:
   - Google Maps JavaScript API
   - Places API
4. Create an API key (Credentials → Create Credentials → API Key)
5. (Optional) Restrict the API key to Google Maps and Places APIs for security

### 3. Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

2. Add your Google Maps API key to `.env.local`:
```
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

### 4. Run the Development Server

```bash
npm run dev
```

The app will open at `http://localhost:5173/`

## How to Use

1. **Grant Location Access**: The app will ask for permission to access your current location (used to center the map)

2. **Select Industry Type**: Choose a business classification from the dropdown (e.g., Restaurants, Banks, Hospitals)

3. **Adjust Search Radius**: Set the search radius in meters (default 2000m)

4. **Search**: 
   - Click the "Search" button for a manual search
   - OR move/zoom the map for automatic search (with 1 second delay)

5. **View Results**: Browse businesses in the left sidebar with details like:
   - Business name
   - Address
   - Ratings and review count
   - Phone number (if available)
   - Website link

6. **Export**: Click "Export CSV" to download search results as a CSV file

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **@react-google-maps/api** - Google Maps integration
- **Vite** - Build tool
- **PapaParse** - CSV export

## NAICS Industry Codes

The app includes common NAICS codes mapped to Google Places types:
- Food & Beverage (Restaurants, Cafes)
- Retail (Grocery Stores, Clothing Stores)
- Health & Medical (Doctors, Hospitals, Dentists)
- Professional Services (Legal, Accounting)
- Entertainment (Theaters, Hotels)
- Financial Services (Banks, Credit Unions)
- Fitness & Wellness (Gyms, Spas)
- And more...

You can expand the `NAICS_CATEGORIES` list in `src/utils/naics.ts` to add more industry types.

## Project Structure

```
src/
├── main.tsx           # React entry point
├── App.tsx            # Main app component
├── App.css            # Styling
├── types.ts           # TypeScript types
├── utils/
│   ├── naics.ts       # NAICS code definitions
│   └── csv.ts         # CSV export utility
└── index.css          # Global styles
```

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder.

## Notes

- The app uses geolocation to center on the user's location. If denied, it defaults to New York City.
- Search results are limited by Google Places API quotas and may require pagination for large result sets.
- The auto-search has a 1-second debounce to avoid excessive API calls while panning/zooming.
