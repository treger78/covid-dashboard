import ResizeButton from '../utils/resize-button.js';

var requestOptions = {
	method: 'GET',
	redirect: 'follow'
};

var countriesAllConfirmed = {};
var countriesNewConfirmed = {};
var countriesAllConfirmedByCode = {};
var countriesNewConfirmedByCode = {};
var currentSortType = 'decrease';
var lastCasesViewObj = {};
var countriesFlags = {};
var countriesPopulations = {};
var countriesFlagsByCode = {};
var countriesPopulationsByCode = {};
var countriesAllConfirmedPerPopulation = {};
var countriesNewConfirmedPerPopulation = {};

function sortByCases(casesObj, increaseOrDecrease) {
	let sortedObj = {};
	if (increaseOrDecrease == 'increase') {
		Object.entries(casesObj).sort((a, b) => a[1] - b[1]).forEach(function(item){
		    sortedObj[item[0]] = item[1];
		});
	} else if (increaseOrDecrease == 'decrease') {
		Object.entries(casesObj).sort((a, b) => b[1] - a[1]).forEach(function(item){
		    sortedObj[item[0]] = item[1];
		});
	}
	return sortedObj;
}

function insertConfirmedData(confirmedObj) {
	const tableCasesByCountry = document.querySelector('.table__cases__by__country');
	confirmedObj = sortByCases(confirmedObj, currentSortType);
	for (let i in confirmedObj) {
	  	tableCasesByCountry.insertAdjacentHTML('beforeend', `
	  	  <div class="table__tr">
	         <span class="county__cases">${confirmedObj[i]}</span> <span class="county__name">${i}</span> 
	         <span class="county__flag"><img src="${countriesFlags[i]}"></span>
	      </div>
	    `);
	}
	lastCasesViewObj = confirmedObj;
}

function clearTable() {
	let elem = document.querySelectorAll('.table__tr').forEach((elem) => {
		elem.remove();
	});
}

function sortCases() {
	const sortBtn = document.querySelector('.min__max__sort__btn');

	sortBtn.addEventListener('click', function() {
		if (sortBtn.checked) {
			currentSortType = 'increase';
			clearTable();
			insertConfirmedData(lastCasesViewObj);
		} else {
			currentSortType = 'decrease';
			clearTable();			
			insertConfirmedData(lastCasesViewObj);
		}
	});	
}

sortCases();

async function getConfirmedData() {

	const covidGlobalCases = document.querySelector('.general-info__global__cases');
	const tableCasesByCountry = document.querySelector('.table__cases__by__country');

	//получаем общее число случаев заражения по всей планете
	await fetch('https://api.covid19api.com/summary', requestOptions)
	  .then(res => res.json())
	  .then(res => {
	  	covidGlobalCases.innerHTML = res.Global.TotalConfirmed;
	  });

	//получаем страны и кол-во случаев заражения для каждой страны
	await fetch('https://api.covid19api.com/summary', requestOptions)
	  .then(res => res.json())
	  .then(res => res.Countries.forEach((country) => {
	  	countriesAllConfirmed[country.Country] = country.TotalConfirmed;
	  	countriesNewConfirmed[country.Country] = country.NewConfirmed;
	  	countriesAllConfirmedByCode[country.CountryCode] = country.TotalConfirmed;
	  	countriesNewConfirmedByCode[country.CountryCode] = country.NewConfirmed;	  	
	  }));

	//получаем флаги и популяцию для каждой страны
	await fetch('https://restcountries.eu/rest/v2/all', requestOptions)
	  .then(res => res.json())
	  .then(res => res.forEach((country, i) => {
  		countriesFlags[country.name] = country.flag;
  		countriesPopulations[country.name] = country.population;
  		countriesFlagsByCode[country.alpha2Code] = country.flag;
  		countriesPopulationsByCode[country.alpha2Code] = country.population; 	
	  }));

	countriesAllConfirmedPerPopulation = calcPerPopulation(countriesAllConfirmed, countriesAllConfirmedByCode);
	countriesNewConfirmedPerPopulation = calcPerPopulation(countriesNewConfirmed, countriesNewConfirmedByCode);

	//т. к. кол-во случаев заражения и флаги получаются с разных api, некоторые ключи отлючаются
	//здесь мы добавляем в объект countriesFlags ключ, совпадающий с ключом из другого api
	for (let i in countriesAllConfirmed) {
		if (countriesFlags[i] == undefined) {
			for (let j in countriesAllConfirmedByCode) {
				if (countriesAllConfirmed[i] == countriesAllConfirmedByCode[j]) {
					for (let k in countriesFlagsByCode) {
						if (k == j) {
							countriesFlags[i] = countriesAllConfirmed[i];
							countriesFlags[i] = countriesFlagsByCode[k];
						}
					}
				}
			}
		}
	}

	//отображаем полученные данные, вставляя в таблицу
	insertConfirmedData(countriesAllConfirmed);

}

getConfirmedData();

function calcPerPopulation(confirmedObj, confirmedObjByCode) {
	let bufObj = JSON.parse(JSON.stringify(confirmedObj));
	for (let i in bufObj) {
		if (countriesPopulations[i] != undefined) {
			bufObj[i] = Math.round((bufObj[i] / countriesPopulations[i]) * 100000);
		} else {
			for (let j in confirmedObjByCode) {
				bufObj[i] = Math.round((confirmedObjByCode[j] / countriesPopulationsByCode[j]) * 100000);
			}
		}
	}
	return bufObj;
}

function extendSection() {
	const generalInfoContainer = document.querySelector('.dashboard__general-info');
	const extendBtn = new ResizeButton(generalInfoContainer);
}

extendSection();

function selectCasesView() {

	function changeCasesView(clickedBtn, oldViewBtn, casesViewType) {
		if (!clickedBtn.classList.contains('active')) {
			clickedBtn.classList.add('active');
			oldViewBtn.classList.remove('active');			
			clearTable();
			insertConfirmedData(casesViewType);
		}
	}

	const totalCasesBtn = document.querySelector('.total__cases__btn');
	const newCasesBtn = document.querySelector('.new__cases__btn');
	const absCasesBtn = document.querySelector('.abs__cases__btn');
	const populationCasesBtn = document.querySelector('.per__population__btn');

	totalCasesBtn.addEventListener('click', function() {
		if (absCasesBtn.classList.contains('active')) {
			changeCasesView(totalCasesBtn, newCasesBtn, countriesAllConfirmed);
		} else {
			changeCasesView(totalCasesBtn, newCasesBtn, countriesAllConfirmedPerPopulation);
		}
	});
	newCasesBtn.addEventListener('click', function() {
		if (absCasesBtn.classList.contains('active')) {
			changeCasesView(newCasesBtn, totalCasesBtn, countriesNewConfirmed);
		} else {
			changeCasesView(newCasesBtn, totalCasesBtn, countriesNewConfirmedPerPopulation);
		}
	});
	absCasesBtn.addEventListener('click', function() {
		if (totalCasesBtn.classList.contains('active')) {
			changeCasesView(absCasesBtn, populationCasesBtn, countriesAllConfirmed);		
		} else {
			changeCasesView(absCasesBtn, populationCasesBtn, countriesNewConfirmed);
		}
	});
	populationCasesBtn.addEventListener('click', function() {
		if (totalCasesBtn.classList.contains('active')) {
			changeCasesView(populationCasesBtn, absCasesBtn, countriesAllConfirmedPerPopulation);
		} else {
			changeCasesView(populationCasesBtn, absCasesBtn, countriesNewConfirmedPerPopulation);
		}
	});

}

selectCasesView();
/*
export const listInit = (data) => data;
export const listConvert = (data) => data;
*/