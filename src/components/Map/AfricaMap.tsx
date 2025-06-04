
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useMapboxToken } from '@/hooks/useMapboxToken';
import { AFRICA_GEOJSON } from '@/data/africaGeoJSON';

interface AfricaMapProps {
  onCountryClick?: (countryCode: string) => void;
  selectedCountry?: string;
  showCountryLabels?: boolean;
  height?: string;
  interactive?: boolean;
  showStats?: boolean;
  className?: string;
}

const AfricaMap: React.FC<AfricaMapProps> = ({
  onCountryClick,
  selectedCountry,
  showCountryLabels = true,
  height = "400px",
  interactive = true,
  showStats = false,
  className = ""
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const { token, configured, isLoading } = useMapboxToken();

  useEffect(() => {
    if (!mapContainer.current || !token || !configured) return;

    mapboxgl.accessToken = token;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [20, 0] as [number, number],
      zoom: 3,
      projection: 'globe',
      interactive: interactive,
    });

    map.current.on('style.load', () => {
      if (!map.current) return;

      map.current.setFog({
        color: 'rgb(255, 255, 255)',
        'high-color': 'rgb(200, 200, 225)',
        'horizon-blend': 0.2,
      });

      // Add Africa countries source
      map.current.addSource('africa-countries', {
        type: 'geojson',
        data: AFRICA_GEOJSON
      });

      // Add country fill layer
      map.current.addLayer({
        id: 'africa-countries-fill',
        type: 'fill',
        source: 'africa-countries',
        paint: {
          'fill-color': [
            'case',
            ['==', ['get', 'iso_a2'], selectedCountry || ''],
            '#10B981',
            '#E5E7EB'
          ],
          'fill-opacity': 0.7
        }
      });

      // Add country border layer
      map.current.addLayer({
        id: 'africa-countries-border',
        type: 'line',
        source: 'africa-countries',
        paint: {
          'line-color': '#374151',
          'line-width': 1
        }
      });

      if (showCountryLabels) {
        map.current.addLayer({
          id: 'africa-countries-labels',
          type: 'symbol',
          source: 'africa-countries',
          layout: {
            'text-field': ['get', 'name'],
            'text-font': ['Open Sans Semibold', 'Arial Unicode MS Bold'],
            'text-size': 12,
            'text-anchor': 'center'
          },
          paint: {
            'text-color': '#1F2937',
            'text-halo-color': '#FFFFFF',
            'text-halo-width': 1
          }
        });
      }

      if (showStats) {
        addStatsMarkers();
      }
    });

    if (onCountryClick) {
      map.current.on('click', 'africa-countries-fill', (e) => {
        if (e.features && e.features.length > 0) {
          const feature = e.features[0];
          if (feature.properties) {
            onCountryClick(feature.properties.iso_a2);
          }
        }
      });
    }

    if (interactive) {
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    return () => {
      map.current?.remove();
    };
  }, [token, configured, onCountryClick, selectedCountry, interactive, showStats, showCountryLabels]);

  const addStatsMarkers = () => {
    const statsData = [
      { country: 'Nigeria', coordinates: [8.6753, 9.0820] as [number, number], requests: 1250 },
      { country: 'Kenya', coordinates: [37.9062, -0.0236] as [number, number], requests: 890 },
      { country: 'South Africa', coordinates: [22.9375, -30.5595] as [number, number], requests: 1100 },
      { country: 'Egypt', coordinates: [30.8025, 26.8206] as [number, number], requests: 750 },
    ];

    statsData.forEach(stat => {
      const marker = document.createElement('div');
      marker.className = 'stats-marker';
      marker.style.cssText = `
        width: 30px;
        height: 30px;
        border-radius: 50%;
        background: linear-gradient(135deg, #3B82F6, #10B981);
        border: 2px solid white;
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 10px;
        font-weight: bold;
        cursor: pointer;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      `;
      marker.textContent = (stat.requests / 100).toFixed(0);

      new mapboxgl.Marker(marker)
        .setLngLat(stat.coordinates)
        .addTo(map.current!);
    });
  };

  if (isLoading) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`} style={{ height }}>
        <div className="text-gray-600">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-sm">Chargement de la configuration Mapbox...</p>
        </div>
      </div>
    );
  }

  if (!configured || !token) {
    return (
      <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`} style={{ height }}>
        <div className="text-gray-600">
          <h3 className="text-lg font-semibold mb-2">Configuration Mapbox requise</h3>
          <p className="text-sm">Veuillez configurer votre token Mapbox dans l'interface d'administration.</p>
          <p className="text-xs mt-2 text-gray-500">Allez dans Admin → Mapbox pour configurer le token</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative rounded-lg overflow-hidden shadow-lg ${className}`} style={{ height }}>
      <div ref={mapContainer} className="absolute inset-0" />
      {showCountryLabels && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg p-3 shadow-lg">
          <h4 className="font-semibold text-sm mb-1">Assurance en Afrique</h4>
          <p className="text-xs text-gray-600">Cliquez sur un pays pour explorer</p>
        </div>
      )}
    </div>
  );
};

export default AfricaMap;
