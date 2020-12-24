import L from 'leaflet';
import create from '../utils/create';
// > 30,000,000 25
// > 10,000,000 – 30,000,000 22
// > 5,000,000 – 10,000,000 18
// > 1,000,000 – 5,000,000 15
// > 500,000 – 1,000,000 12
// > 250,000 – 500,000 10
// > 100,000 – 250,000 8
// > 50,000 – 100,000 6
// > 20,000 – 50,000 5
// > 5,000 – 20,000 4
// > 1,000 – 5,000 3
// 1 – 1,000 2

const radiusHandler = (number) => {
  if (number > 30000000) return 25;
  if (number > 10000000) return 22;
  if (number > 5000000) return 18;
  if (number > 1000000) return 15;
  if (number > 500000) return 12;
  if (number > 250000) return 10;
  if (number > 100000) return 8;
  if (number > 50000) return 6;
  if (number > 20000) return 5;
  if (number > 5000) return 4;
  if (number > 1000) return 3;
  return 2;
};

export function totalConfirmedGeoData(geoJson) {
  const geoData = new L.GeoJSON(geoJson, {
    pointToLayer: (feature, latlng) => {
      const { properties } = feature;
      const { TotalConfirmed } = properties;
      const radius = radiusHandler(TotalConfirmed);
      const html = create('span', `icon-circle comulative-cases-icon circle-${radius}`, null, null);
      return L.marker(latlng, {
        icon: L.divIcon({
          className: 'icon-marker',
          html,
        }),
        raiseOnHover: true,
      });
    },
  });
  return geoData;
}

export function totalActiveGeoData(geoJson) {
  const geoData = new L.GeoJSON(geoJson, {
    pointToLayer: (feature, latlng) => {
      const { properties } = feature;
      const { TotalConfirmed, TotalRecovered, TotalDeaths } = properties;
      const radius = radiusHandler(TotalConfirmed - TotalRecovered - TotalDeaths);
      const html = create('span', `icon-circle active-cases-icon circle-${radius}`, null, null);
      return L.marker(latlng, {
        icon: L.divIcon({
          className: 'icon-marker',
          html,
        }),
        raiseOnHover: true,
      });
    },
  });
  return geoData;
}

export function totalDeathsGeoData(geoJson) {
  const geoData = new L.GeoJSON(geoJson, {
    pointToLayer: (feature, latlng) => {
      const { properties } = feature;
      const { TotalDeaths } = properties;
      const radius = radiusHandler(TotalDeaths);
      const html = create('span', `icon-circle fatality-ratio-icon circle-${radius}`, null, null);
      return L.marker(latlng, {
        icon: L.divIcon({
          className: 'icon-marker',
          html,
        }),
        raiseOnHover: true,
      });
    },
  });
  return geoData;
}

export function IncidenceRateGeoData(geoJson) {
  const geoData = new L.GeoJSON(geoJson, {
    pointToLayer: (feature, latlng) => {
      const { properties } = feature;
      const { TotalConfirmed, population } = properties;
      const populationCoef = population / 100000;
      let radius;
      const incidenceRate = TotalConfirmed / populationCoef; // incidence rate per 100,000 people
      if (incidenceRate > 30000) radius = 12;
      else if (incidenceRate > 10000) radius = 10;
      else if (incidenceRate > 5000) radius = 8;
      else if (incidenceRate > 2500) radius = 6;
      else if (incidenceRate > 1500) radius = 5;
      else if (incidenceRate > 750) radius = 4;
      else if (incidenceRate > 250) radius = 3;
      else radius = 2;
      const html = create('span', `icon-circle incidence-rate-icon circle-${radius}`, null, null);
      return L.marker(latlng, {
        icon: L.divIcon({
          className: 'icon-marker',
          html,
        }),
        raiseOnHover: true,
      });
    },
  });
  return geoData;
}
