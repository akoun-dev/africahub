
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { AFRICA_GEOJSON } from '@/data/africaGeoJSON';
import { MapPin } from 'lucide-react';
import { MapControls } from './MapControls';
import { MapLegend } from './MapLegend';
import { MapStatsPanel } from './MapStatsPanel';
import { MapInstructions } from './MapInstructions';

interface InteractiveAfricaMapProps {
  onCountryClick?: (countryCode: string) => void;
  selectedCountry?: string;
  height?: string;
  showControls?: boolean;
  showStats?: boolean;
  className?: string;
}

export const InteractiveAfricaMap: React.FC<InteractiveAfricaMapProps> = ({
  onCountryClick,
  selectedCountry,
  height = "600px",
  showControls = true,
  showStats = true,
  className = ""
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const popup = useRef<mapboxgl.Popup | null>(null);
  const { token, configured, isLoading } = useMapboxToken();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [hoveredCountry, setHoveredCountry] = useState<any>(null);

  useEffect(() => {
    if (!mapContainer.current || !token || !configured) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [20, 0],
      zoom: 3,
      projection: 'globe',
      interactive: true,
    });

    // Add navigation controls with custom styling
    if (showControls) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right');
    }

    map.current.on('style.load', () => {
      if (!map.current) return;

      // Add atmosphere with African-inspired colors
      map.current.setFog({
        color: 'rgb(252, 245, 230)', // Warm, sandy color
        'high-color': 'rgb(240, 220, 190)', // Golden tint
        'horizon-blend': 0.3,
      });

      // Add Africa countries source
      map.current.addSource('africa-countries', {
        type: 'geojson',
        data: AFRICA_GEOJSON
      });

      // Add country fill layer with African colors
      map.current.addLayer({
        id: 'africa-countries-fill',
        type: 'fill',
        source: 'africa-countries',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'iso_a2'], selectedCountry || ''],
            '#009639', // afroGreen for selected country
            [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              '#FCD116', // afroGold for hover
              '#F5F5DC'  // Beige/cream for default
            ]
          ],
          'fill-opacity': [
            'case',
            ['==', ['get', 'iso_a2'], selectedCountry || ''],
            0.85,
            [
              'case',
              ['boolean', ['feature-state', 'hover'], false],
              0.7,
              0.5
            ]
          ]
        }
      });

      // Add country border layer with African styling
      map.current.addLayer({
        id: 'africa-countries-border',
        type: 'line',
        source: 'africa-countries',
        paint: {
          'line-color': [
            'case',
            ['==', ['get', 'iso_a2'], selectedCountry || ''],
            '#009639',
            '#8C5E37' // afroBrown for borders
          ],
          'line-width': [
            'case',
            ['==', ['get', 'iso_a2'], selectedCountry || ''],
            3,
            1.5
          ]
        }
      });

      // Add labels layer with African styling
      map.current.addLayer({
        id: 'africa-countries-labels',
        type: 'symbol',
        source: 'africa-countries',
        layout: {
          'text-field': ['get', 'name'],
          'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
          'text-size': 13,
          'text-anchor': 'center'
        },
        paint: {
          'text-color': '#2D5016', // Dark green
          'text-halo-color': '#FFFFFF',
          'text-halo-width': 2
        }
      });

      // Add hover effects
      let hoveredStateId: string | number | null = null;

      map.current.on('mousemove', 'africa-countries-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          
          if (hoveredStateId !== null) {
            map.current?.setFeatureState(
              { source: 'africa-countries', id: hoveredStateId },
              { hover: false }
            );
          }

          hoveredStateId = feature.id || feature.properties?.iso_a2;
          
          if (hoveredStateId) {
            map.current?.setFeatureState(
              { source: 'africa-countries', id: hoveredStateId },
              { hover: true }
            );
          }

          setHoveredCountry(feature.properties);
          map.current!.getCanvas().style.cursor = 'pointer';

          // Show popup with African-themed styling
          if (popup.current) {
            popup.current.remove();
          }

          popup.current = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            className: 'african-map-popup'
          })
            .setLngLat(e.lngLat)
            .setHTML(`
              <div class="bg-white rounded-xl shadow-xl border-2 border-afroGold/20 p-4 max-w-xs">
                <div class="flex items-center gap-2 mb-3">
                  <div class="w-3 h-3 rounded-full bg-gradient-to-r from-afroGreen to-afroGold"></div>
                  <h3 class="font-bold text-gray-900 text-lg">${feature.properties?.name}</h3>
                </div>
                <div class="space-y-2 text-sm text-gray-700">
                  <div class="flex items-center gap-2 p-2 bg-afroGreen/5 rounded-lg">
                    <span class="text-afroGreen">👥</span>
                    <span><strong>${(feature.properties?.population / 1000000).toFixed(1)}M</strong> habitants</span>
                  </div>
                  <div class="flex items-center gap-2 p-2 bg-afroGold/5 rounded-lg">
                    <span class="text-afroGold">🏢</span>
                    <span><strong>${feature.properties?.insurance_companies}</strong> compagnies</span>
                  </div>
                  <div class="flex items-center gap-2 p-2 bg-afroRed/5 rounded-lg">
                    <span class="text-afroRed">💰</span>
                    <span>Marché: <strong>${feature.properties?.market_size}</strong></span>
                  </div>
                </div>
                <div class="mt-3 p-2 bg-gradient-to-r from-afroGreen/10 to-afroGold/10 rounded-lg">
                  <p class="text-xs text-afroGreen font-medium text-center">
                    ✨ Cliquez pour sélectionner ce pays
                  </p>
                </div>
              </div>
            `)
            .addTo(map.current!);
        }
      });

      map.current.on('mouseleave', 'africa-countries-fill', () => {
        if (hoveredStateId !== null) {
          map.current?.setFeatureState(
            { source: 'africa-countries', id: hoveredStateId },
            { hover: false }
          );
        }
        hoveredStateId = null;
        setHoveredCountry(null);
        map.current!.getCanvas().style.cursor = '';

        if (popup.current) {
          popup.current.remove();
        }
      });

      // Add click handler
      map.current.on('click', 'africa-countries-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          const countryCode = feature.properties?.iso_a2;
          
          if (countryCode && onCountryClick) {
            onCountryClick(countryCode);
            
            // Zoom to country with smooth animation
            const bounds = new mapboxgl.LngLatBounds();
            if (feature.geometry.type === 'Polygon') {
              feature.geometry.coordinates[0].forEach((coord: [number, number]) => {
                bounds.extend(coord);
              });
              map.current?.fitBounds(bounds, { 
                padding: 50, 
                duration: 1000,
                essential: true
              });
            }
          }
        }
      });
    });

    return () => {
      if (popup.current) {
        popup.current.remove();
      }
      map.current?.remove();
    };
  }, [token, configured, onCountryClick, selectedCountry, showControls]);

  const handleZoomIn = () => {
    map.current?.zoomIn();
  };

  const handleZoomOut = () => {
    map.current?.zoomOut();
  };

  const handleReset = () => {
    map.current?.flyTo({
      center: [20, 0],
      zoom: 3,
      duration: 1000
    });
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (isLoading) {
    return (
      <div className={`bg-gradient-to-br from-afroGold/5 to-afroGreen/5 border-2 border-dashed border-afroGold/30 rounded-xl p-8 text-center ${className}`} style={{ height }}>
        <div className="text-gray-600">
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-afroGreen border-t-transparent mx-auto mb-4"></div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-afroGreen">Chargement de la carte interactive...</p>
            <p className="text-sm text-gray-500">Préparation de votre expérience africaine</p>
          </div>
        </div>
      </div>
    );
  }

  if (!configured || !token) {
    return (
      <div className={`bg-gradient-to-br from-afroRed/5 to-afroGold/5 border-2 border-dashed border-afroRed/30 rounded-xl p-8 text-center ${className}`} style={{ height }}>
        <div className="text-gray-600">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r from-afroRed to-afroGold flex items-center justify-center">
            <MapPin className="h-8 w-8 text-white" />
          </div>
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-900">Configuration Mapbox requise</h3>
            <p className="text-sm text-gray-600 max-w-md mx-auto">
              Veuillez configurer votre token Mapbox pour activer cette magnifique carte interactive de l'Afrique.
            </p>
            <div className="p-3 bg-afroGold/10 rounded-lg">
              <p className="text-xs text-afroGold font-medium">
                💡 Allez dans Admin → Mapbox pour configurer le token
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${isFullscreen ? 'fixed inset-0 z-50 bg-white' : ''} ${className}`}>
      <div 
        className="relative rounded-xl overflow-hidden shadow-xl border-2 border-afroGold/20 bg-gradient-to-br from-white to-afroGold/5" 
        style={{ height: isFullscreen ? '100vh' : height }}
      >
        {/* African-themed decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-4 left-4 w-8 h-8 border-2 border-afroGreen rounded-lg rotate-12"></div>
          <div className="absolute bottom-4 right-4 w-6 h-6 border border-afroGold rounded-full"></div>
        </div>
        
        <div ref={mapContainer} className="absolute inset-0" />
        
        {/* Custom Controls with African styling */}
        {showControls && (
          <MapControls
            isFullscreen={isFullscreen}
            onZoomIn={handleZoomIn}
            onZoomOut={handleZoomOut}
            onReset={handleReset}
            onToggleFullscreen={toggleFullscreen}
          />
        )}

        {/* Legend with African colors */}
        <MapLegend />

        {/* Stats Panel with African theming */}
        {showStats && hoveredCountry && (
          <MapStatsPanel countryData={hoveredCountry} />
        )}

        {/* Instructions with African styling */}
        <MapInstructions />
      </div>
    </div>
  );
};
