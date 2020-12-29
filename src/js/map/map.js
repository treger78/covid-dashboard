import L from 'leaflet';
import countries from '../layouts/countries';
import * as geoData from './geoJsonLayers';
import ResizeButton from '../utils/resize-button';

const map = new L.Map('map', { center: [40, 20], zoom: 2 });
const tileLayer = new L.TileLayer(
  'https://api.mapbox.com/styles/v1/abdulloh76/ckiuab9eh2phd19qk49l16mvl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWJkdWxsb2g3NiIsImEiOiJja2l1YTV6Z3EwOWdhMnpuenE3N3gxOHhjIn0.txVoKFibwsl1bMD2ylfxOA',
);
map.addLayer(tileLayer);

export function mapInit(data, countryAdditionalInfo) {
  // eslint-disable-next-line no-unused-vars
  const resizeButton = new ResizeButton(document.querySelector('#map'))
  data.Countries.forEach((country) => {
    const additionalInfo = countryAdditionalInfo.find(
      (el) => el.alpha2Code === country.CountryCode,
    );
    country.population = additionalInfo.population;
    country.flag = additionalInfo.flag;
    country.alpha3 = countries[country.CountryCode].alpha3;
  });

  const geoJson = {
    type: 'FeatureCollection',
    features: data.Countries.map((country = {}) => {
      const { latitude, longitude } = countries[country.CountryCode];
      return {
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [longitude, latitude],
        },
        properties: {
          ...country,
        },
      };
    }),
  };

  const totalConfirmedGeoData = geoData.totalConfirmedGeoData(geoJson);
  totalConfirmedGeoData.addTo(map);

  const totalActieGeoData = geoData.totalActiveGeoData(geoJson);
  totalActieGeoData.addTo(map);

  const totalDeathsGeoData = geoData.totalDeathsGeoData(geoJson);
  totalDeathsGeoData.addTo(map);

  const IncidenceRateGeoData = geoData.IncidenceRateGeoData(geoJson);
  IncidenceRateGeoData.addTo(map);
}

export const mapConvert = (data) => data;
