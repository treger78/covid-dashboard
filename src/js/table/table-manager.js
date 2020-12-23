import ControlPanel from './control-panel';
import APIManager from '../utils/api-manager';
import ResizeButton from '../utils/resize-button';

export default class TableManager {
  constructor(element) {
    this.data = {
      period: 'Total cases',
      unit: 'Absolute values',
      location: 'Global',
    };
    this.apiManager = new APIManager();
    this.caption = element.querySelector('.covid-table-caption th');
    this.topPanel = new ControlPanel(
      element.querySelector('.controls.top'),
      'period',
      this,
    );
    this.bottomPanel = new ControlPanel(
      element.querySelector('.controls.bottom'),
      'unit',
      this,
    );
    this.confirmedCell = element.querySelector('[data-status="confirmed"]');
    this.recoveredCell = element.querySelector('[data-status="recovered"]');
    this.deathsCell = element.querySelector('[data-status="deaths"]');

    this.resizeButton = new ResizeButton(element);

    document.body.addEventListener('click', (e) => {
      const menus = element.querySelectorAll('.popup-menu');
      if (e.target !== this.topPanel.selectButton
        && e.target !== this.bottomPanel.selectButton) {
        menus.forEach((m) => {
          m.classList.remove('active');
        });
      }
    });

    this.update();
  }

  update() {
    this.caption.textContent = this.getLocation();
    this.topPanel.selectButton.textContent = this.getPeriod();
    this.bottomPanel.selectButton.textContent = this.getUnit();
    this.updateCovidData();
    return this;
  }

  async updateCovidData() {
    let confirmed;
    let recovered;
    let deaths;
    if (this.getPeriod() === 'Total cases') {
      confirmed = (await this.apiManager.getCovidData('TotalConfirmed', this.getLocation()));
      recovered = (await this.apiManager.getCovidData('TotalRecovered', this.getLocation()));
      deaths = (await this.apiManager.getCovidData('TotalDeaths', this.getLocation()));
    } else if (this.getPeriod() === 'New cases') {
      confirmed = (await this.apiManager.getCovidData('NewConfirmed', this.getLocation()));
      recovered = (await this.apiManager.getCovidData('NewRecovered', this.getLocation()));
      deaths = (await this.apiManager.getCovidData('NewDeaths', this.getLocation()));
    }

    if (this.getUnit() === 'Per 100K population') {
      const calc = (x, y) => Math.round((x / y) * 100000);
      confirmed = calc(confirmed, (await this.apiManager.getPopulation(this.getLocation())));
      recovered = calc(recovered, (await this.apiManager.getPopulation(this.getLocation())));
      deaths = calc(deaths, (await this.apiManager.getPopulation(this.getLocation())));
    }
    this.confirmedCell.textContent = confirmed;
    this.recoveredCell.textContent = recovered;
    this.deathsCell.textContent = deaths;
    return this;
  }

  setPeriod(period) {
    this.data.period = period;
    return this;
  }

  setLocation(location) {
    this.data.location = location;
    return this;
  }

  setUnit(unit) {
    this.data.unit = unit;
    return this;
  }

  getPeriod() {
    return this.data.period;
  }

  getLocation() {
    return this.data.location;
  }

  getUnit() {
    return this.data.unit;
  }
}
