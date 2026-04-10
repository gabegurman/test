import { useState, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiIsLoaded, useLoadScript, Marker, Circle } from '@react-google-maps/api';
import { Business, SearchFilters } from './types';
import { NAICS_CATEGORIES, getGoogleTypeForNAICS } from './utils/naics';
import { exportToCSV } from './utils/csv';
import './App.css';

const GOOGLE_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: 40.7128,
  lng: -74.0060,
};

function App() {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: GOOGLE_API_KEY,
    libraries: ['places'],
  });

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    naicsCode: NAICS_CATEGORIES[0].code,
    radius: 2000, // 2km default
  });
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [mapZoom, setMapZoom] = useState(12);
  const mapRef = useRef<any>(null);
  const placesServiceRef = useRef<google.maps.places.PlacesService | null>(null);

  // Get user's current location on mount
  const initializeUserLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const location = { lat: latitude, lng: longitude };
          setUserLocation(location);
          setMapCenter(location);
        },
        (error) => {
          console.warn('Could not get user location:', error);
          // Fall back to default center
        }
      );
    }
  }, []);

  // Initialize Places service when map loads
  const handleMapLoad = useCallback((map: any) => {
    mapRef.current = map;
    if (isLoaded && window.google) {
      placesServiceRef.current = new window.google.maps.places.PlacesService(map);
    }
  }, [isLoaded]);

  // Search for businesses
  const searchBusinesses = useCallback(async () => {
    if (!placesServiceRef.current || !mapCenter) return;

    setLoading(true);
    try {
      const googleType = getGoogleTypeForNAICS(filters.naicsCode);

      const request = {
        location: new window.google.maps.LatLng(mapCenter.lat, mapCenter.lng),
        radius: filters.radius,
        type: googleType,
      };

      placesServiceRef.current.nearbySearch(
        request,
        (results: any[], status: any) => {
          if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
            const businessData: Business[] = results.map((place) => ({
              id: place.place_id,
              name: place.name,
              address: place.vicinity || '',
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              rating: place.rating,
              userRatings: place.user_ratings_total,
              placeId: place.place_id,
            }));

            setBusinesses(businessData);
          } else if (status === window.google.maps.places.PlacesServiceStatus.ZERO_RESULTS) {
            setBusinesses([]);
          } else {
            console.error('Places search error:', status);
          }
          setLoading(false);
        }
      );
    } catch (error) {
      console.error('Search error:', error);
      setLoading(false);
    }
  }, [filters, mapCenter]);

  // Handle map bounds changed (auto-search when user drags/zooms)
  const handleBoundsChanged = useCallback(() => {
    if (mapRef.current && !loading) {
      // Auto-search with slight delay to avoid too many requests
      const timer = setTimeout(() => {
        searchBusinesses();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [searchBusinesses, loading]);

  // Initialize on mount
  if (isLoaded && !userLocation) {
    initializeUserLocation();
  }

  if (!isLoaded) {
    return (
      <div className="app">
        <div className="loading">Loading Google Maps...</div>
      </div>
    );
  }

  if (!GOOGLE_API_KEY) {
    return (
      <div className="app">
        <div className="error">
          <h1>Missing API Key</h1>
          <p>Please set VITE_GOOGLE_MAPS_API_KEY environment variable</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <div className="sidebar-header">
          <h1>Business Search</h1>
        </div>

        <div className="search-controls">
          <div className="control-group">
            <label htmlFor="naics">Industry Type</label>
            <select
              id="naics"
              value={filters.naicsCode}
              onChange={(e) => setFilters({ ...filters, naicsCode: e.target.value })}
            >
              {NAICS_CATEGORIES.map((cat) => (
                <option key={cat.code} value={cat.code}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div className="control-group">
            <label htmlFor="radius">Search Radius (m)</label>
            <input
              id="radius"
              type="number"
              min="500"
              max="50000"
              step="500"
              value={filters.radius}
              onChange={(e) => setFilters({ ...filters, radius: parseInt(e.target.value) })}
            />
          </div>

          <button
            onClick={searchBusinesses}
            disabled={loading}
            className="search-button"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>

        <div className="results-section">
          <div className="results-header">
            <h2>Results ({businesses.length})</h2>
            {businesses.length > 0 && (
              <button
                onClick={() => exportToCSV(businesses)}
                className="export-button"
              >
                Export CSV
              </button>
            )}
          </div>

          <div className="business-list">
            {businesses.map((business) => (
              <div key={business.id} className="business-card">
                <h3>{business.name}</h3>
                <p className="address">{business.address}</p>
                {business.rating && (
                  <p className="rating">⭐ {business.rating.toFixed(1)} ({business.userRatings} reviews)</p>
                )}
                {business.phoneNumber && (
                  <p className="phone">{business.phoneNumber}</p>
                )}
                {business.website && (
                  <a href={business.website} target="_blank" rel="noopener noreferrer" className="website-link">
                    Visit Website
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="map-container">
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={mapCenter}
          zoom={mapZoom}
          onLoad={handleMapLoad}
          onBoundsChanged={handleBoundsChanged}
          onCenterChanged={() => {
            if (mapRef.current) {
              setMapCenter({
                lat: mapRef.current.getCenter().lat(),
                lng: mapRef.current.getCenter().lng(),
              });
            }
          }}
          onZoomChanged={() => {
            if (mapRef.current) {
              setMapZoom(mapRef.current.getZoom());
            }
          }}
          options={{
            streetViewControl: false,
            mapTypeControl: false,
          }}
        >
          {/* User location marker */}
          {userLocation && (
            <Marker
              position={userLocation}
              title="Your Location"
              icon={{
                path: window.google.maps.SymbolPath.CIRCLE,
                scale: 8,
                fillColor: '#4285F4',
                fillOpacity: 1,
                strokeColor: '#fff',
                strokeWeight: 2,
              }}
            />
          )}

          {/* Search radius circle */}
          {mapCenter && (
            <Circle
              center={mapCenter}
              radius={filters.radius}
              options={{
                fillColor: '#4285F4',
                fillOpacity: 0.1,
                strokeColor: '#4285F4',
                strokeOpacity: 0.4,
                strokeWeight: 1,
              }}
            />
          )}

          {/* Business markers */}
          {businesses.map((business) => (
            <Marker
              key={business.id}
              position={{ lat: business.latitude, lng: business.longitude }}
              title={business.name}
            />
          ))}
        </GoogleMap>
      </div>
    </div>
  );
}

export default App;
