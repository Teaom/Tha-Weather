let searchForm = document.getElementById("searchForm");
let searchInput = document.getElementById("searchInput");
let current = document.getElementById("current");
let forecast = document.getElementById("forecast");
let searchHistory = document.getElementById("searchHistory");

let APIKey = "620c253d0c9e6dc17da38e9136d39bd1";


//Local Storage

let storedSearches;

function renderLocalStorage () {
    searchHistory.innerHTML = "";

    for (let i = 0; i < storedSearches.length; i++) {
        let searchHistoryDiv = document.createElement("div");
        searchHistoryDiv.className = "searchHistoryDiv";
      
        let searchHistoryBtn = document.createElement("button");
       
       searchHistoryBtn.textContent = storedSearches [i];

       searchHistoryDiv.append(searchHistoryBtn);
       searchHistory.append(searchHistoryBtn);
        
    }
}

 function getLocalStorage() {
    storedSearches = [];
    storedSearches = JSON.parse(localStorage.getItem("searches")) || [];
    renderLocalStorage();
 }

    getLocalStorage();

    //current weather
    function renderCurrentWeather(data) {
        current.innerHTML = "";
        let name = document.createElement("div");
        name.textContent = data.name;
        current.append(name);

        let date = document.createElement("div");
        date.textContent = new Date(data.dt * 1000).toLocaleTimeString("en-US", {
            weekday: "long", 
            year: "numeric",
            month: "short",
            day: "numeric",
        });
        current.append(date);

        let temp = document.createElement("div");
        temp.textContent = data.main.temp;
        current.append(temp);

        let humidity = document.createElement("div");
        humidity.textContent = data.main.humidity;
        current.append(humidity);

        let windSpeed = document.createElement("div");
        windSpeed.textContent = data.wind.speed;
        current.append(windSpeed);

        let icon = document.createElement("img");
        icon.src = "https://openweathermap.org/img/wn/" + data.weather[0].icon + "@2x.png";
        current.append(icon);
        
        
    }
    
    function displayCurrent(name) {
        let cityName = name;
        let cityQuery =
        "https://api.openweathermap.org/data/2.5/weather?q=" +
        cityName + 
        "&units=imperial" +
        "&appid=" +
        APIKey;

    fetch(cityQuery)
        .then(function (res) {
            return res.json()
    })
    .then(function (data) {
        console.log(data); 
        renderCurrentWeather(data);
    })
    .catch(function (err) {
         console.log(err);
    });
    
}


//5 Day

let forecastHigh = -100;

let forecastLow = 200;

let avgWindSpeed = 0;

let avgHumidity = 0;

let forcastIconSrc;


function renderForecast(data) {
    forecast.innerHTML = "";
    let infoIndex = [7, 15, 23, 31, 39];
    let iconIndex = []
    for (let i = 0; i < data.list.length; i++) {
        let forecastCard = document.createElement("div");
        let forecastIcon = document.createElement("img");

    if(data.list[i].main.temp_max > forecastHigh) {
         forecastHigh = data.list[i].main.temp_max;
    }
    if(data.list[i].main.temp_min < forecastLow) {
        forecastLow = data.list[i].main.temp_min;
    }

     avgHumidity = avgHumidity + data.list[i].main.humidity;

     avgWindSpeed = avgWindSpeed + data.list[i].wind.speed;
     
     if (infoIndex.includes(i)) {
        console.log("i", i);
    highTemp = document.createElement("div");
    highTemp.textContent = "High: " + parseInt(forecastHigh);
    forecastCard.append(highTemp);
    forecastHigh = -100;

    lowTemp = document.createElement("div");
    lowTemp.textContent = "Low: " + parseInt(forecastLow);
    forecastCard.append(lowTemp);
    forecastLow = 200;

    humidity = document.createElement("div");
    humidity.textContent = "Humidity: " + parseInt(avgHumidity / 8);
    forecastCard.append(humidity);
    avgHumidity = 0;

    windSpeed = document.createElement("div");
    windSpeed.textContent = "Wind: " + parseInt(avgWindSpeed / 8);
    forecastCard.append(windSpeed);
    avgWindSpeed = 0;

    forecastIcon.src =
    "https://openweathermap.org/img/wn/" +
    data.list[i].weather[0].icon +
    "@2x.png";
    forecastCard.append(forecastIcon);


    forecast.append(forecastCard);
     }
 } 
 }

function displayForecast(name) {
    let cityName = name;
        let forecastQuery =
        "https://api.openweathermap.org/data/2.5/forecast?q=" +
        cityName + 
        "&units=imperial" +
        "&appid=" +
        APIKey;

    fetch(forecastQuery)
        .then(function (res) {
            return res.json();
    })
    .then(function (data) {
        console.log(data); 
        renderForecast(data);
    })
    .catch(function (err) {
         console.log(err);
    });
}

function searchCity(e) {
    e.preventDefault();
    if (searchInput.value !== "") {
    displayCurrent(searchInput.value);
    displayForecast(searchInput.value);
    storedSearches.unshift(searchInput.value);
    localStorage.setItem("searches", JSON.stringify(storedSearches));
    getLocalStorage();
    }
}

function searchCityFromHistory(name) {
    displayCurrent(name);
    displayForecast(name);
}

searchHistory.addEventListener("click", function (e) {
    console.log(e.target.textContent);
    searchCityFromHistory(e.target.textContent);
});

searchForm.addEventListener("submit", searchCity);
