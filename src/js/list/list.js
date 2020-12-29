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
var countriesAllDeaths = {};
var countriesNewDeaths = {};
var countriesAllRecovered = {};
var countriesNewRecovered = {};
var countriesAllDeathsByCode = {};
var countriesNewDeathsByCode = {};
var countriesAllRecoveredByCode = {};
var countriesNewRecoveredByCode = {};
var countriesAllDeathsPerPopulation = {};
var countriesNewDeathsPerPopulation = {};
var countriesAllRecoveredPerPopulation = {};
var countriesNewRecoveredPerPopulation = {};

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
		countriesAllDeaths[country.Country] = country.TotalDeaths;
		countriesNewDeaths[country.Country] = country.NewDeaths;
		countriesAllRecovered[country.Country] = country.TotalRecovered;
		countriesNewRecovered[country.Country] = country.NewRecovered;
		countriesAllDeathsByCode[country.CountryCode] = country.TotalDeaths;
		countriesNewDeathsByCode[country.CountryCode] = country.NewDeaths;
		countriesAllRecoveredByCode[country.CountryCode] = country.TotalRecovered;
		countriesNewRecoveredByCode[country.CountryCode] = country.NewRecovered;
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
	countriesAllDeathsPerPopulation = calcPerPopulation(countriesAllDeaths, countriesAllDeathsByCode);
	countriesNewDeathsPerPopulation = calcPerPopulation(countriesNewDeaths, countriesNewDeathsByCode);
	countriesAllRecoveredPerPopulation = calcPerPopulation(countriesAllRecovered, countriesAllRecoveredByCode);
	countriesNewRecoveredPerPopulation = calcPerPopulation(countriesNewRecovered, countriesNewRecoveredByCode);
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

	const totalCasesBtn = document.querySelector('.total__cases__btn');
	const newCasesBtn = document.querySelector('.new__cases__btn');
	const absCasesBtn = document.querySelector('.abs__cases__btn');
	const populationCasesBtn = document.querySelector('.per__population__btn');

	const confirmedCasesBtn = document.querySelector('.confirmed__btn');
	const recoveredCasesBtn = document.querySelector('.recovered__btn');
	const deathsCasesBtn = document.querySelector('.deaths__btn');

	const covidGlobalCases = document.querySelector('.general-info__global__cases');
	const tableCasesByCountry = document.querySelector('.table__cases__by__country');

	function changeGlobalCases(casesViewType) {
		const covidGlobalCases = document.querySelector('.general-info__global__cases');
		let sum = 0;
		for (let i in casesViewType) {
			sum += casesViewType[i];
		}
		covidGlobalCases.innerHTML = sum;
	}

	function currentCasesViewStyle() {
		if (confirmedCasesBtn.classList.contains('active')) {
			covidGlobalCases.style.color = '#cbcbcb';
			let countryCases = document.querySelectorAll('.county__cases').forEach((countryCase) => {
				countryCase.style.color = '#cbcbcb';
			});
		} else if (recoveredCasesBtn.classList.contains('active')) {
			covidGlobalCases.style.color = 'green';
			let countryCases = document.querySelectorAll('.county__cases').forEach((countryCase) => {
				countryCase.style.color = 'green';
			});
		} else {
			covidGlobalCases.style.color = '#e60000';
			let countryCases = document.querySelectorAll('.county__cases').forEach((countryCase) => {
				countryCase.style.color = '#e60000';
			});
		}
	}

	currentCasesViewStyle();	

	function changeCasesView(confirmedObj) {
		clearTable();
		insertConfirmedData(confirmedObj);
		currentCasesViewStyle();
		changeGlobalCases(confirmedObj);
	}

	function selectCaseTypeView(btnIsActive, confirmed, recovered, deaths, elseConfirmed, elseRecovered, elseDeaths) {
		if (btnIsActive.classList.contains('active')) {
			if (confirmedCasesBtn.classList.contains('active')) {
				changeCasesView(confirmed);
			}
			if (recoveredCasesBtn.classList.contains('active')) {
				changeCasesView(recovered);
			}
			if (deathsCasesBtn.classList.contains('active')) {
				changeCasesView(deaths);
			}
		} else {
			if (confirmedCasesBtn.classList.contains('active')) {
				changeCasesView(elseConfirmed);
			}
			if (recoveredCasesBtn.classList.contains('active')) {
				changeCasesView(elseRecovered);
			}
			if (deathsCasesBtn.classList.contains('active')) {
				changeCasesView(elseDeaths);
			}
		}
	}

	function addAndRemoveActiveStyle(addBtn, removeBtn) {
		addBtn.classList.add('active');
		removeBtn.classList.remove('active');		
	}

	totalCasesBtn.addEventListener('click', function() {
		if (!totalCasesBtn.classList.contains('active')) {
			addAndRemoveActiveStyle(totalCasesBtn, newCasesBtn);
			selectCaseTypeView(absCasesBtn, countriesAllConfirmed, countriesAllRecovered, countriesAllDeaths, 
				countriesAllConfirmedPerPopulation, countriesAllRecoveredPerPopulation, countriesAllDeathsPerPopulation);
		}
	});

	newCasesBtn.addEventListener('click', function() {
		if (!newCasesBtn.classList.contains('active')) {
			addAndRemoveActiveStyle(newCasesBtn, totalCasesBtn);
			selectCaseTypeView(absCasesBtn, countriesNewConfirmed, countriesNewRecovered, countriesNewDeaths, 
				countriesNewConfirmedPerPopulation, countriesNewRecoveredPerPopulation, countriesNewDeathsPerPopulation);
		}
	});

	absCasesBtn.addEventListener('click', function() {
		if (!absCasesBtn.classList.contains('active')) {
			addAndRemoveActiveStyle(absCasesBtn, populationCasesBtn);
			selectCaseTypeView(totalCasesBtn, countriesAllConfirmed, countriesAllRecovered, countriesAllDeaths, 
				countriesNewConfirmed, countriesNewRecovered, countriesNewDeaths);
		}
	});

	populationCasesBtn.addEventListener('click', function() {
		if (!populationCasesBtn.classList.contains('active')) {
			addAndRemoveActiveStyle(populationCasesBtn, absCasesBtn);
			selectCaseTypeView(totalCasesBtn, countriesAllConfirmedPerPopulation, countriesAllRecoveredPerPopulation, 
				countriesAllDeathsPerPopulation, countriesNewConfirmedPerPopulation, countriesNewRecoveredPerPopulation, 
				countriesNewDeathsPerPopulation);
		}
	});

	function addActiveAndRemoveIfContainsActive(addBtn, removeBtn1, removeBtn2) {
		addBtn.classList.add('active');
		if (removeBtn1.classList.contains('active')) {
			removeBtn1.classList.remove('active');
		}
		if (removeBtn2.classList.contains('active')) {
			removeBtn2.classList.remove('active');
		}
	}

	function changeViewIfActive(obj1, obj2, obj3, obj4) {
		if (totalCasesBtn.classList.contains('active')) {
			if (absCasesBtn.classList.contains('active')) {
				changeCasesView(obj1);
			} else {
				changeCasesView(obj2);
			}
		} else {
			if (absCasesBtn.classList.contains('active')) {
				changeCasesView(obj3);
			} else {
				changeCasesView(obj4);
			}
		}
	}

	confirmedCasesBtn.addEventListener('click', function() {
		if (!confirmedCasesBtn.classList.contains('active')) {
			addActiveAndRemoveIfContainsActive(confirmedCasesBtn, recoveredCasesBtn, deathsCasesBtn);
			changeViewIfActive(countriesAllConfirmed, countriesAllConfirmedPerPopulation, countriesNewConfirmed, 
				countriesNewConfirmedPerPopulation);
		}
	});

	recoveredCasesBtn.addEventListener('click', function() {
		if (!recoveredCasesBtn.classList.contains('active')) {
			addActiveAndRemoveIfContainsActive(recoveredCasesBtn, confirmedCasesBtn, deathsCasesBtn);
			changeViewIfActive(countriesAllRecovered, countriesAllRecoveredPerPopulation, countriesNewRecovered, 
				countriesNewRecoveredPerPopulation);
		}
	});

	deathsCasesBtn.addEventListener('click', function() {
		if (!deathsCasesBtn.classList.contains('active')) {
			addActiveAndRemoveIfContainsActive(deathsCasesBtn, confirmedCasesBtn, recoveredCasesBtn);
			changeViewIfActive(countriesAllDeaths, countriesAllDeathsPerPopulation, countriesNewDeaths, 
				countriesNewDeathsPerPopulation);
		}
	});

}

selectCasesView();

export const listInit = (data) => data;
export const listConvert = (data) => data;
