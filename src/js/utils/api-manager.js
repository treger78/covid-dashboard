async function loadData(url) {
  try {
    const response = await fetch(url);
    return response.json();
  } catch (error) {
    throw new Error(`Unable to load data from ${url}`);
  }
}

// returns an index of object in array,
// and returns -1 if object is not found
function findByField(objects, value, field) {
  if (objects.length < 1) return -1;
  let begin = 0;
  let end = objects.length - 1;
  let mid = null;
  while (begin <= end) {
    mid = Math.trunc((begin + end) / 2);
    if (value === objects[mid][field]) {
      return mid;
    }
    if (value > objects[mid][field]) {
      begin = mid + 1;
    } else {
      end = mid - 1;
    }
  }
  return -1;
}

export default class APIManager {
  constructor() {
    this.covidData = loadData('https://api.covid19api.com/summary');
    this.populationData = loadData('https://restcountries.eu/rest/v2/all?fields=name;population');
  }

  async getCovidData(status, country = 'Global') {
    if (country === 'Global') {
      return (await this.covidData).Global[status];
    }
    const countries = (await this.covidData).Countries;
    const i = findByField(countries, country, 'Country');
    return i >= 0 ? countries[i][status] : 'unknown';
  }

  async getPopulation(country = 'Global') {
    const countries = await this.populationData;
    if (country === 'Global') {
      return countries.reduce((acc, obj) => acc + obj.population, 0);
    }
    const i = findByField(countries, country, 'name');
    return i >= 0 ? countries[i].population : countries[0].population;
  }
}
