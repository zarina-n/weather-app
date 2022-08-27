const weatherApp = document.querySelector('.weather-app');
const weatherAppCardDisplay = weatherApp.querySelector('.weather-app__card-display');
const randomDetectBtn = weatherApp.querySelector('.random-detect__button');
const autoDetectBtn = weatherApp.querySelector('.auto-detect__button');
const randomDetectInput = weatherApp.querySelector('.random-detect__input');
const weatherAppCities = weatherApp.querySelector('.weather-app__cities');
const message = weatherApp.querySelector('.random__detect-message');


const API_ID = '351763d3ebca91328890559abe5a9027';
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const UNITS = 'metric';

function getWeatherCard(data) {
    const icon = `http://openweathermap.org/img/w/${data.weather[0].icon}.png`;
    const card = document.createElement("li");
    card.classList.add('city-card');

    const weatherAppCityList = weatherApp.querySelector('.weather-app__cities')

    const pattern = `
        <h2 class="city-name"><span>${data.name}</span><sup>${data.sys.country}</sup></h2>
        <div class="city-temp">${Math.round(data.main.temp)}<sup>°C</sup></div>
        <figure>
        <img class="city-icon" src=${icon} alt=${data.weather[0].main}>
        <figcaption class="city-description">${data.weather[0].description}</figcaption></figure>
    `;

    card.innerHTML = pattern;
    weatherAppCityList.appendChild(card);
}

autoDetectBtn.addEventListener('click', (event) => {
    event.preventDefault()
    navigator.geolocation.getCurrentPosition((data) => {
        const { latitude, longitude } = data.coords;

        request({
            url: `${API_BASE_URL}/weather`,
            params: {
                lat: latitude,
                lon: longitude,
                appid: API_ID,
                units: UNITS,
            },
            onSuccess: (data) => {
                getWeatherCard(data);
                autoDetectBtn.setAttribute('disabled', 'disabled');
            },
        });
    });
});

const weatherAppCitiesArray = [];

randomDetectBtn.addEventListener('click', (event) => {
    event.preventDefault()
    let cityNameValue = randomDetectInput.value;
    weatherAppCitiesArray.push(cityNameValue);

    const cityObject = {};

    for (var i = 0; i < weatherAppCitiesArray.length; i++) {
        if (cityObject[weatherAppCitiesArray[i]]) {
            cityObject[weatherAppCitiesArray[i]] += 1;
        } else {
            cityObject[weatherAppCitiesArray[i]] = 1;
        }
    }

    if (cityNameValue === '') {

        message.classList.remove('random__detect-message-hidden');
        message.textContent = "Please enter city name and country code, if you'd like";

    } else if (cityObject[`${cityNameValue}`] > 1) {

        message.classList.remove('random__detect-message-hidden');
        message.textContent = `You already checked weather in ${cityNameValue} city`;

    } else {
        message.classList.add('random__detect-message-hidden');

        request({
            url: `${API_BASE_URL}/weather`,
            params: {
                q: cityNameValue,
                appid: API_ID,
                units: UNITS,
            },
            onSuccess: (data) => {

                getWeatherCard(data);
                weatherApp.reset();
                randomDetectInput.focus();
            }
        });


    }

});
