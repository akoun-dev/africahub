
export const AFRICA_GEOJSON = {
  "type": "FeatureCollection" as const,
  "features": [
    {
      "type": "Feature" as const,
      "properties": {
        "name": "Nigeria",
        "iso_a2": "NG",
        "population": 218541000,
        "insurance_companies": 45,
        "market_size": "12.5B USD"
      },
      "geometry": {
        "type": "Polygon" as const,
        "coordinates": [[
          [2.676932, 6.258562],
          [2.676932, 13.892007],
          [14.678921, 13.892007],
          [14.678921, 6.258562],
          [2.676932, 6.258562]
        ]]
      }
    },
    {
      "type": "Feature" as const,
      "properties": {
        "name": "Kenya",
        "iso_a2": "KE",
        "population": 54027000,
        "insurance_companies": 28,
        "market_size": "3.2B USD"
      },
      "geometry": {
        "type": "Polygon" as const,
        "coordinates": [[
          [33.893608, -4.678079],
          [33.893608, 5.506146],
          [41.855083, 5.506146],
          [41.855083, -4.678079],
          [33.893608, -4.678079]
        ]]
      }
    },
    {
      "type": "Feature" as const,
      "properties": {
        "name": "South Africa",
        "iso_a2": "ZA",
        "population": 59308000,
        "insurance_companies": 35,
        "market_size": "18.7B USD"
      },
      "geometry": {
        "type": "Polygon" as const,
        "coordinates": [[
          [16.344977, -34.839828],
          [16.344977, -22.125799],
          [32.830122, -22.125799],
          [32.830122, -34.839828],
          [16.344977, -34.839828]
        ]]
      }
    },
    {
      "type": "Feature" as const,
      "properties": {
        "name": "Egypt",
        "iso_a2": "EG",
        "population": 102334000,
        "insurance_companies": 22,
        "market_size": "4.8B USD"
      },
      "geometry": {
        "type": "Polygon" as const,
        "coordinates": [[
          [24.70007, 22.0],
          [24.70007, 31.667049],
          [36.86623, 31.667049],
          [36.86623, 22.0],
          [24.70007, 22.0]
        ]]
      }
    },
    {
      "type": "Feature" as const,
      "properties": {
        "name": "Ghana",
        "iso_a2": "GH",
        "population": 31072000,
        "insurance_companies": 18,
        "market_size": "1.8B USD"
      },
      "geometry": {
        "type": "Polygon" as const,
        "coordinates": [[
          [-3.24437, 4.73677],
          [-3.24437, 11.173301],
          [1.06, 11.173301],
          [1.06, 4.73677],
          [-3.24437, 4.73677]
        ]]
      }
    },
    {
      "type": "Feature" as const,
      "properties": {
        "name": "Morocco",
        "iso_a2": "MA",
        "population": 36910000,
        "insurance_companies": 15,
        "market_size": "2.9B USD"
      },
      "geometry": {
        "type": "Polygon" as const,
        "coordinates": [[
          [-17.02044, 21.4207],
          [-17.02044, 35.7599],
          [-1.12455, 35.7599],
          [-1.12455, 21.4207],
          [-17.02044, 21.4207]
        ]]
      }
    }
  ]
};

export const getCountryByCode = (code: string) => {
  return AFRICA_GEOJSON.features.find(feature => feature.properties.iso_a2 === code);
};

export const getAllCountries = () => {
  return AFRICA_GEOJSON.features.map(feature => ({
    code: feature.properties.iso_a2,
    name: feature.properties.name,
    population: feature.properties.population,
    companies: feature.properties.insurance_companies,
    marketSize: feature.properties.market_size
  }));
};
