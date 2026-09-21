import React, { useEffect, useRef, useState, useCallback } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { 
  Navigation, 
  Locate, 
  Globe2, 
  Layers, 
  MapPin, 
  Search,
  AlertCircle, 
  CheckCircle2, 
  Compass, 
  Crosshair,
  RefreshCw,
  ExternalLink
} from 'lucide-react';

export interface UserLocationState {
  lat: number;
  lng: number;
  accuracy: number;
  altitude: number | null;
  speed: number | null;
  timestamp: number;
  address?: string;
  source: 'gps' | 'ip' | 'preset';
}

const MAP_STYLES = {
  osm: {
    name: 'OpenStreetMap',
    url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors',
    maxZoom: 19,
  },
  cartoDark: {
    name: 'OSM Dark Matter',
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    maxZoom: 20,
    subdomains: 'abcd',
  },
  humanitarian: {
    name: 'OSM Humanitarian',
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by HOT',
    maxZoom: 19,
    subdomains: 'abc',
  },
};

export default function LiveWorldMap() {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);
  const accuracyCircleRef = useRef<L.Circle | null>(null);
  const watchIdRef = useRef<number | null>(null);

  const [userLocation, setUserLocation] = useState<UserLocationState | null>(null);
  const [locatingStatus, setLocatingStatus] = useState<'idle' | 'locating' | 'success' | 'error'>('locating');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentStyle, setCurrentStyle] = useState<keyof typeof MAP_STYLES>('osm');
  const [isFollowingUser, setIsFollowingUser] = useState<boolean>(true);
  const [selectedCoords, setSelectedCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [showLayerMenu, setShowLayerMenu] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Utility to validate coordinates
  const isValidLatLng = (lat: any, lng: any): boolean => {
    const latNum = typeof lat === 'string' ? parseFloat(lat) : lat;
    const lngNum = typeof lng === 'string' ? parseFloat(lng) : lng;
    return (
      typeof latNum === 'number' && !isNaN(latNum) &&
      typeof lngNum === 'number' && !isNaN(lngNum) &&
      latNum >= -90 && latNum <= 90 &&
      lngNum >= -180 && lngNum <= 180
    );
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // Default global center view
    const initialMap = L.map(mapContainerRef.current, {
      center: [20, 0],
      zoom: 2.5,
      zoomControl: false,
      worldCopyJump: true,
      minZoom: 2,
      maxZoom: 19,
    });

    // Add Tile Layer
    const style = MAP_STYLES[currentStyle];
    const tileLayer = L.tileLayer(style.url, {
      attribution: style.attribution,
      maxZoom: style.maxZoom,
      subdomains: (style as any).subdomains || 'abc',
    }).addTo(initialMap);

    tileLayerRef.current = tileLayer;
    mapInstanceRef.current = initialMap;

    // Handle map drag/move to disengage strict follow mode if user pan away
    initialMap.on('dragstart', () => {
      setIsFollowingUser(false);
    });

    // Click on map to inspect coordinates
    initialMap.on('click', (e: L.LeafletMouseEvent) => {
      setSelectedCoords({
        lat: Number(e.latlng.lat.toFixed(6)),
        lng: Number(e.latlng.lng.toFixed(6)),
      });
    });

    // Resize observer to ensure Leaflet renders correctly when container dimensions settle
    const resizeObserver = new ResizeObserver(() => {
      initialMap.invalidateSize();
    });
    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
      initialMap.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim() || !mapInstanceRef.current) return;

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1`
      );
      if (response.ok) {
        const results = await response.json();
        if (results.length > 0) {
          const { lat, lon } = results[0];
          const latNum = parseFloat(lat);
          const lonNum = parseFloat(lon);

          if (isNaN(latNum) || isNaN(lonNum)) {
            console.error("Invalid coordinates received from search", { lat, lon });
            return;
          }

          const latLng: L.LatLngTuple = [latNum, lonNum];
          
          mapInstanceRef.current.flyTo(latLng, 16, {
            duration: 2.0,
            easeLinearity: 0.25,
          });

          setSelectedCoords({ lat: latNum, lng: lonNum });
          setIsFollowingUser(false);
        }
      }
    } catch (error) {
      console.error("Search failed", error);
    } finally {
      setIsSearching(false);
    }
  };

  // Switch Tile Style
  const handleStyleChange = (styleKey: keyof typeof MAP_STYLES) => {
    setCurrentStyle(styleKey);
    setShowLayerMenu(false);
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    mapInstanceRef.current.removeLayer(tileLayerRef.current);
    const style = MAP_STYLES[styleKey];
    const newLayer = L.tileLayer(style.url, {
      attribution: style.attribution,
      maxZoom: style.maxZoom,
      subdomains: (style as any).subdomains || 'abc',
    }).addTo(mapInstanceRef.current);

    tileLayerRef.current = newLayer;
  };

  // Reverse geocode location via OSM Nominatim
  const fetchAddress = async (lat: number, lng: number): Promise<string | undefined> => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`,
        {
          headers: {
            'Accept-Language': 'en',
          },
        }
      );
      if (response.ok) {
        const data = await response.json();
        return data.display_name || undefined;
      }
    } catch {
      // Nominatim might be rate-limited or blocked; fallback gracefully
    }
    return undefined;
  };

  // Update or create user marker on the map
  const updateUserMarker = useCallback((loc: UserLocationState, autoFly: boolean = false) => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Validate coordinates
    if (!isValidLatLng(loc.lat, loc.lng)) {
      console.error("Invalid user location coordinates rejected", loc);
      return;
    }

    const latLng: L.LatLngTuple = [loc.lat, loc.lng];

    // Create custom 3D / Pulsing HTML Marker
    const userLocationHtml = `
      <div class="relative flex items-center justify-center -translate-x-1/2 -translate-y-1/2">
        <!-- Outer Radar Pulse Animation -->
        <div class="absolute w-12 h-12 rounded-full bg-emerald-500/25 animate-ping"></div>
        <div class="absolute w-8 h-8 rounded-full bg-emerald-400/35 border border-emerald-300/60 shadow-lg"></div>
        
        <!-- 3D Center Core Pin -->
        <div class="relative w-4 h-4 rounded-full bg-emerald-400 border-2 border-white shadow-[0_2px_8px_rgba(0,0,0,0.6)] flex items-center justify-center">
          <div class="w-1.5 h-1.5 rounded-full bg-neutral-950"></div>
        </div>
      </div>
    `;

    const customIcon = L.divIcon({
      html: userLocationHtml,
      className: 'user-location-marker-container',
      iconSize: [32, 32],
      iconAnchor: [16, 16],
    });

    // Update or add marker
    if (userMarkerRef.current) {
      userMarkerRef.current.setLatLng(latLng);
    } else {
      const marker = L.marker(latLng, {
        icon: customIcon,
        zIndexOffset: 1000,
        title: 'Your Exact Location',
      }).addTo(map);

      userMarkerRef.current = marker;
    }

    // Update or add accuracy circle
    const accuracyRadius = Math.max(loc.accuracy || 15, 10);
    if (accuracyCircleRef.current) {
      accuracyCircleRef.current.setLatLng(latLng);
      accuracyCircleRef.current.setRadius(accuracyRadius);
    } else {
      const circle = L.circle(latLng, {
        radius: accuracyRadius,
        color: '#10b981',
        weight: 1.5,
        opacity: 0.8,
        fillColor: '#10b981',
        fillOpacity: 0.12,
      }).addTo(map);

      accuracyCircleRef.current = circle;
    }

    // Popup with exact details
    const popupContent = `
      <div style="font-family: inherit; font-size: 11px; line-height: 1.5; color: #171717; min-width: 180px;">
        <div style="font-weight: 700; color: #059669; margin-bottom: 2px; display: flex; items-center; gap: 4px;">
          📍 Your Exact Location
        </div>
        <div style="font-family: monospace; font-size: 10px; color: #404040;">
          ${loc.lat.toFixed(6)}°, ${loc.lng.toFixed(6)}°
        </div>
        <div style="margin-top: 4px; font-size: 10px; color: #525252;">
          GPS Accuracy: <strong>±${Math.round(loc.accuracy)}m</strong>
        </div>
        ${loc.address ? `<div style="margin-top: 4px; font-size: 9px; color: #404040; border-top: 1px solid #e5e5e5; padding-top: 4px;">${loc.address}</div>` : ''}
      </div>
    `;
    userMarkerRef.current.bindPopup(popupContent);

    if (autoFly) {
      map.flyTo(latLng, Math.max(map.getZoom(), 16), {
        duration: 2.0,
        easeLinearity: 0.25,
      });
    }
  }, []);

  // Query exact geolocation
  const requestLocation = useCallback(() => {
    setLocatingStatus('locating');
    setErrorMessage(null);

    if (!navigator.geolocation) {
      setLocatingStatus('error');
      setErrorMessage('Geolocation API is not supported by your browser.');
      fetchIpLocation();
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const { latitude, longitude, accuracy, altitude, speed } = pos.coords;
        
        if (!isValidLatLng(latitude, longitude)) {
          console.error("GPS returned invalid coordinates", { latitude, longitude });
          setLocatingStatus('error');
          setErrorMessage('Received invalid location data from device.');
          fetchIpLocation();
          return;
        }

        const newLoc: UserLocationState = {
          lat: latitude,
          lng: longitude,
          accuracy: accuracy || 20,
          altitude: altitude || null,
          speed: speed || null,
          timestamp: pos.timestamp || Date.now(),
          source: 'gps',
        };

        setUserLocation(newLoc);
        setLocatingStatus('success');
        setIsFollowingUser(true);
        updateUserMarker(newLoc, true);

        // Fetch reverse geocode address asynchronously
        const addr = await fetchAddress(latitude, longitude);
        if (addr) {
          setUserLocation(prev => prev ? { ...prev, address: addr } : null);
          if (userMarkerRef.current) {
            updateUserMarker({ ...newLoc, address: addr }, false);
          }
        }
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        let msg = 'Unable to retrieve exact location.';
        if (err.code === 1) {
          msg = 'Geolocation access was denied. Check browser location permissions.';
        } else if (err.code === 2) {
          msg = 'Location unavailable. Checking IP approximation...';
        } else if (err.code === 3) {
          msg = 'Location request timed out. Checking IP approximation...';
        }
        setErrorMessage(msg);
        setLocatingStatus('error');
        // Fallback to IP geolocation so map is immediately useful
        fetchIpLocation();
      },
      {
        enableHighAccuracy: true,
        timeout: 12000,
        maximumAge: 0,
      }
    );

    // Watch position for continuous real-time movement tracking
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const { latitude, longitude, accuracy, altitude, speed } = pos.coords;
        
        if (!isValidLatLng(latitude, longitude)) return;

        setUserLocation(prev => {
          const updated: UserLocationState = {
            lat: latitude,
            lng: longitude,
            accuracy: accuracy || 20,
            altitude: altitude || null,
            speed: speed || null,
            timestamp: pos.timestamp || Date.now(),
            address: prev?.address,
            source: 'gps',
          };
          updateUserMarker(updated, false);
          return updated;
        });
      },
      () => {},
      {
        enableHighAccuracy: true,
        maximumAge: 5000,
      }
    );
  }, [updateUserMarker]);

  // Fallback to IP Geolocation if HTML5 GPS is blocked/denied
  const fetchIpLocation = async () => {
    try {
      const res = await fetch('https://ipapi.co/json/');
      if (res.ok) {
        const data = await res.json();
        const lat = parseFloat(data.latitude);
        const lon = parseFloat(data.longitude);

        if (isValidLatLng(lat, lon)) {
          const ipLoc: UserLocationState = {
            lat: lat,
            lng: lon,
            accuracy: 2500, // IP accuracy is city-level
            altitude: null,
            speed: null,
            timestamp: Date.now(),
            address: `${data.city || ''}, ${data.region || ''}, ${data.country_name || ''}`,
            source: 'ip',
          };
          setUserLocation(ipLoc);
          setLocatingStatus('success');
          updateUserMarker(ipLoc, true);
        }
      }
    } catch {
      // If even IP fails, default to world view
    }
  };

  // Trigger location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  // Recenter / fly to user
  const handleRecenter = () => {
    if (userLocation && !isValidLatLng(userLocation.lat, userLocation.lng)) {
      console.error("Cannot recenter: User location contains invalid coordinates", userLocation);
      requestLocation();
      return;
    }
    
    setIsFollowingUser(true);
    if (!userLocation) {
      requestLocation();
      return;
    }

    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo([userLocation.lat, userLocation.lng], 16, {
      duration: 1.5,
    });
    if (userMarkerRef.current) {
      userMarkerRef.current.openPopup();
    }
  };

  // View entire world
  const handleWorldView = () => {
    if (!mapInstanceRef.current) return;
    setIsFollowingUser(false);
    mapInstanceRef.current.flyTo([20, 0], 2.5, { duration: 1.8 });
  };

  // Zoom controls
  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div id="live-map-viewport-wrapper" className="relative w-full h-full flex-1 min-h-[500px] overflow-hidden bg-[#FAF9F6]">
      {/* 1. The Leaflet Map Container */}
      <div 
        id="openstreetmap-container" 
        ref={mapContainerRef} 
        className="w-full h-full absolute inset-0 z-0 select-none"
      />

      {/* 2. Top Header HUD Bar */}
      <div 
        id="map-top-bar" 
        className="absolute top-3 inset-x-3 sm:inset-x-6 z-[1050] flex flex-wrap items-center justify-between gap-3 pointer-events-none"
      >
        {/* Search Bar */}
        <form 
          onSubmit={handleSearch}
          className="pointer-events-auto flex-1 max-w-md group"
        >
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Search address, street, city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white/95 backdrop-blur-md border border-neutral-200 rounded-2xl pl-10 pr-4 py-2.5 text-sm shadow-xl focus:ring-2 focus:ring-black/5 focus:border-neutral-400 outline-none transition-all placeholder:text-neutral-400 text-neutral-800"
            />
            <div className="absolute left-3.5 text-neutral-400 group-focus-within:text-black transition-colors">
              {isSearching ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            </div>
            <button 
              type="submit"
              className="absolute right-2 px-3 py-1 bg-black text-white text-[10px] font-bold rounded-xl hover:bg-neutral-800 transition-colors"
            >
              GO
            </button>
          </div>
        </form>

        {/* Right Actions: Map Style Switcher & World Button */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* Layer Selector */}
          <div className="relative">
            <button
              type="button"
              id="map-style-toggle-btn"
              onClick={() => setShowLayerMenu(!showLayerMenu)}
              className="px-2.5 py-1.5 rounded-xl bg-white/90 backdrop-blur-md border border-neutral-200/90 text-neutral-600 hover:text-neutral-900 text-xs font-mono flex items-center gap-1.5 shadow-lg transition-all"
            >
              <Layers className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{MAP_STYLES[currentStyle].name}</span>
            </button>

            {showLayerMenu && (
              <div className="absolute right-0 mt-1.5 w-48 rounded-xl bg-white/95 backdrop-blur-md border border-neutral-200 p-1.5 shadow-2xl z-30 space-y-1">
                {(Object.keys(MAP_STYLES) as (keyof typeof MAP_STYLES)[]).map((styleKey) => (
                  <button
                    key={styleKey}
                    type="button"
                    onClick={() => handleStyleChange(styleKey)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-mono transition-colors flex items-center justify-between ${
                      currentStyle === styleKey
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                        : 'text-neutral-500 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{MAP_STYLES[styleKey].name}</span>
                    {currentStyle === styleKey && (
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Full World View Button */}
          <button
            type="button"
            id="map-world-view-btn"
            onClick={handleWorldView}
            className="p-2 rounded-xl bg-white/90 backdrop-blur-md border border-neutral-200/90 text-neutral-600 hover:text-neutral-900 shadow-lg transition-all"
            title="Overview Entire World"
          >
            <Globe2 className="w-4 h-4 text-sky-600" />
          </button>
        </div>
      </div>

      {/* 3. Floating Right Control Cluster (Zoom & Recenter on GPS) */}
      <div 
        id="map-navigation-controls" 
        className="absolute right-4 bottom-28 z-20 flex flex-col items-center gap-2 pointer-events-auto"
      >
        {/* Recenter on Exact User Location */}
        <button
          type="button"
          id="btn-recenter-location"
          onClick={handleRecenter}
          className={`p-3 rounded-2xl border shadow-xl transition-all ${
            isFollowingUser && userLocation
              ? 'bg-emerald-600 text-white border-emerald-500 shadow-emerald-600/20'
              : 'bg-white/90 backdrop-blur-md border-neutral-200 text-neutral-600 hover:text-emerald-600 hover:border-emerald-400/50'
          }`}
          title="Recenter on My Exact Location"
        >
          <Crosshair className={`w-5 h-5 ${isFollowingUser && userLocation ? 'animate-spin-slow' : ''}`} />
        </button>

        {/* Zoom In & Out */}
        <div className="flex flex-col bg-white/90 backdrop-blur-md border border-neutral-200 rounded-2xl overflow-hidden shadow-xl">
          <button
            type="button"
            id="btn-map-zoom-in"
            onClick={handleZoomIn}
            className="p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors border-b border-neutral-100 font-mono text-base font-bold leading-none"
            title="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            id="btn-map-zoom-out"
            onClick={handleZoomOut}
            className="p-2.5 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-50 transition-colors font-mono text-base font-bold leading-none"
            title="Zoom Out"
          >
            −
          </button>
        </div>
      </div>

      {/* 4. Clicked Coordinate Banner (If user clicks anywhere on map) */}
      {selectedCoords && (
        <div 
          id="clicked-coordinates-banner"
          className="absolute left-4 bottom-28 z-20 bg-white/90 backdrop-blur-md border border-neutral-200 rounded-xl px-3 py-2 text-xs font-mono text-neutral-600 shadow-xl flex items-center gap-2"
        >
          <MapPin className="w-3.5 h-3.5 text-emerald-600" />
          <span>Point: {selectedCoords.lat}°, {selectedCoords.lng}°</span>
          <button
            type="button"
            onClick={() => setSelectedCoords(null)}
            className="text-neutral-400 hover:text-neutral-800 ml-1 text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* 5. Live OSM Attribution Badge */}
      <div className="absolute bottom-24 right-3 z-10 text-[9px] font-mono text-neutral-500 bg-white/70 backdrop-blur-xs px-2 py-0.5 rounded border border-neutral-200/50 pointer-events-auto">
        Live OpenStreetMap Data
      </div>
    </div>
  );
}
