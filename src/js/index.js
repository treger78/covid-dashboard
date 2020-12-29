import '../sass/style.scss';
import * as diagram from './diagram/diagram';
import * as list from './list/list';
import * as map from './map/map';
import * as table from './table/table';

fetch('https://api.covid19api.com/summary')
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    table.tableInit(data);
    list.listInit(data);
    fetch('https://restcountries.eu/rest/v2/all?fields=name;alpha2Code;population;flag')
      .then((resp) => resp.json())
      .then((countryAdditionalInfo) => {
        map.mapInit(data, countryAdditionalInfo);
      })
    diagram.diagramInit(data);
  });
