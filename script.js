const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");
const current = document.getElementById("current");
const forecast = document.getElementById("forecast");
const searchHistory = document.getElementById("searchHistory");

const APIKey = "620c253d0c9e6dc17da38e9136d39bd1";

let storedSearches = JSON.parse(localStorage.getItem("searches")) || [];

function renderLocalStorage() {
    searchHistory.innerHTML = "";

    storedSearches.slice(0, 5).forEach(search => {
        const searchHistoryBtn = document.createElement("button");
        searchHistoryBtn.className = "searchHistoryDiv";
        searchHistoryBtn.textContent = search;
        searchHistory.append(searchHistoryBtn);
    });
}

function renderCurrentWeather(data) {
    current.innerHTML = `
        <div>${data.name}</div>
        <div>${new Date(data.dt * 1000).toLocaleTimeString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "short",
            day: "numeric",
        })}</div>
        <div>Temperature: ${data.main.temp}</div>
        <div>Humidity: ${data.main.humidity}</div>
        <div>Wind: ${parseInt(data.wind.speed)}</div>
        <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />
    `;
}

function displayCurrent(name) {
    const cityQuery = `https://api.openweathermap.org/data/2.5/weather?q=${name}&units=imperial&appid=${APIKey}`;

    fetch(cityQuery)
        .then(res => res.json())
        .then(data => renderCurrentWeather(data))
        .catch(err => console.log(err));
}

function renderForecast(data) {
    const infoIndex = [7, 15, 23, 31, 39];

    forecast.innerHTML = data.list.reduce((acc, forecast, i) => {
        if (infoIndex.includes(i)) {
            return acc + `
                <div>
                    <div>High: ${parseInt(forecast.main.temp_max)}</div>
                    <div>Low: ${parseInt(forecast.main.temp_min)}</div>
                    <div>Humidity: ${parseInt(forecast.main.humidity)}</div>
                    <div>Wind: ${parseInt(forecast.wind.speed)}</div>
                    <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" />
                </div>
            `;
        }
        return acc;
    }, '');
}

function displayForecast(name) {
    const forecastQuery = `https://api.openweathermap.org/data/2.5/forecast?q=${name}&units=imperial&appid=${APIKey}`;

    fetch(forecastQuery)
        .then(res => res.json())
        .then(data => renderForecast(data))
        .catch(err => console.log(err));
}

function searchCity(e) {
    e.preventDefault();
    const cityName = searchInput.value.trim();
    if (cityName) {
        displayCurrent(cityName);
        displayForecast(cityName);
        storedSearches.unshift(cityName);
        localStorage.setItem("searches", JSON.stringify(storedSearches));
        renderLocalStorage();
    }
}

searchHistory.addEventListener("click", e => {
    const cityName = e.target.textContent;
    displayCurrent(cityName);
    displayForecast(cityName);
});

searchForm.addEventListener("submit", searchCity);

renderLocalStorage();
