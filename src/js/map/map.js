import L from 'leaflet';

const map = new L.Map('map', { center: [40, 20], zoom: 2 });
const layer = new L.TileLayer(
  'https://api.mapbox.com/styles/v1/abdulloh76/ckiuab9eh2phd19qk49l16mvl/tiles/256/{z}/{x}/{y}@2x?access_token=pk.eyJ1IjoiYWJkdWxsb2g3NiIsImEiOiJja2l1YTV6Z3EwOWdhMnpuenE3N3gxOHhjIn0.txVoKFibwsl1bMD2ylfxOA',
);
map.addLayer(layer);
export const mapInit = (data) => data;
export const mapConvert = (data) => data;
