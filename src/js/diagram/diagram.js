const MONTH_NAME = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
//const ctx = document.("myChart").getContext("2d");
const ctx = document.querySelector('.cases__diagrams');

  countryMemory = currentCountry;
  caseMemory = currentCase;
  periodMemory = currentPeriod;
  unitMemory = currentUnit;

let userCountry = currentCountry;

let allDates = [],
    formatedDates = [],
    casesList = [],
    recoveredList = [],
    deathsList = [];
    
function fetchData(country) {
      userCountry = country;
      
          casesList = [],
          recoveredList = [],
          deathsList = [];
          allDates = [],
          formatedDates = [];
    
          var requestOptions = {
            method: "GET",
            redirect: "follow",
          };
              
        const api_fetch = async (country) => {
          await fetch(
            `https://api.covid19api.com/total/country/${country}/status/confirmed`,requestOptions
          )
            .then(response => response.json())
            .then((data) => {
              data.forEach((entry) => {
                allDates.push(entry.Date);
                casesList.push(entry.Cases);
              });
            })
            .catch(error => console.log('error', error));
      
          await fetch(
            `https://api.covid19api.com/total/country/${country}/status/recovered`,requestOptions
          )
            .then(response =>  response.json())
            .then((data) => {
              data.forEach(entry => recoveredList.push(entry.Cases));
            })
            .catch(error => console.log('error', error));
      
          await fetch(
             `https://api.covid19api.com/total/country/${country}/status/deaths`,requestOptions
          )
            .then(response => response.json())
            .then((data) => {
              data.forEach(entry => deathsList.push(entry.Cases));
            })
            .catch(error => console.log('error', error));
      
          updateUI();
        };

        api_fetch(country);
      }

fetchData(userCountry);
      
function updateUI() {
         updateDates();
         onCountryClick();  
      }
        
let  myChart ;
    
function drawGraphTotal() {
        
  if (myChart != undefined) {
    myChart.destroy();
  }

  myChart = new Chart(ctx, {
          // The type of chart we want to create
          type: "line",
          // The data for our dataset
          data: {
            datasets: [
              {
                label: "Total",
                data: casesList,
                fill: true,
                borderColor: "#EFF30A",
                backgroundColor: "#EFF30A",
              },
            ],
            labels: formatedDates,
          },
          // Configuration options go here
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });

      }

function drawGraphRecovered() {
        
        if (myChart != undefined) {
          myChart.destroy();
          }

          myChart = new Chart(ctx, {
          // The type of chart we want to create
          type: "line",
          // The data for our dataset
          data: {
            datasets: [
              {
                label: "Recovered",
                data: recoveredList,
                fill: true,
                borderColor: "green",
                backgroundColor: "green",
              },
            ],
            labels: formatedDates,
          },
          // Configuration options go here
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }

function drawGraphDeaths() {
        
        if (myChart != undefined) {
          myChart.destroy();
          }

          myChart = new Chart(ctx, {
          // The type of chart we want to create
          type: "line",
          // The data for our dataset
          data: {
            datasets: [
              {
                label: "Deaths",
                data: deathsList,
                fill: true,
                borderColor: "red",
                backgroundColor: "red",
              },
            ],
            labels: formatedDates,
          },
          // Configuration options go here
          options: {
            responsive: true,
            maintainAspectRatio: false,
          },
        });
      }

       
function updateDates() {
        allDates.forEach(date => formatedDates.push(formatDate(date)));
      }
    
function formatDate(dateString) {
        const date = new Date(dateString);
        
        return `${date.getDate()} ${MONTH_NAME[date.getMonth()]}`;
      }

function onCountryClick() {
  switch (currentCase) {
    case 'Confirmed':
        drawGraphTotal(); 
      break;
    case 'Recovered':
        drawGraphRecovered();
      break;
    case 'Deaths':
        drawGraphDeaths();
      break;

  }
 
}

export const diagramInit = (data) => data;
export const diagramConvert = (data) => data;
