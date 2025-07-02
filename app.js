import { getCurrentWeather } from './modules/weather-service.js';
import { 
  elements, 
  showLoading, 
  hideLoading, 
  showError, 
  displayWeather,
  getCityInput,
  clearInput
} from './modules/ui-controller.js';

// Cautare
function handleSearch() {
  
  const cityName = getCityInput();
  
  if (cityName === '') {
    showError('Te rog introdu numele unui oraș');
    return;
  }
  
  showLoading();
  
  getCurrentWeather(cityName)
    .then(function(weatherData) {

      displayWeather(weatherData);
    })
    .catch(function(error) {

      showError(error.message);
    });
}

function onSearchButtonClick() {
  handleSearch();
}

function onInputKeyPress(event) {
  
  if (event.key === 'Enter') {
    handleSearch();
  }
}


function initializeApp() {

  if (elements.searchBtn) {
    elements.searchBtn.addEventListener('click', onSearchButtonClick);
  }
  
  if (elements.cityInput) {
    elements.cityInput.addEventListener('keypress', onInputKeyPress);
  }
  
  hideLoading();
  if (elements.error) {
    elements.error.classList.add('hidden');
  }
  if (elements.weatherDisplay) {
    elements.weatherDisplay.classList.add('hidden');
  }
  
  console.log('App initialized successfully!');
}

window.addEventListener('load', initializeApp);

document.addEventListener('DOMContentLoaded', initializeApp);

import {
  getCurrentWeather,
  getWeatherByCoords
} from './modules/weather-service.js';
import {
  updateWeatherUI,
  getElements,
  saveUserPreferences,
  loadUserPreferences
} from './modules/ui-controller.js';
import { CONFIG } from './modules/config.js';
import { getCoords } from './modules/location-service.js';

const elements = getElements();

// Încarcă preferințele salvate
const preferences = loadUserPreferences();
CONFIG.DEFAULT_UNITS = preferences.unit;
CONFIG.DEFAULT_LANG = preferences.lang;
elements.unitSelect.value = CONFIG.DEFAULT_UNITS;
elements.langSelect.value = CONFIG.DEFAULT_LANG;

// Gestionare căutare prin formular
const form = document.getElementById('weatherForm');
const cityInput = document.getElementById('cityInput');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (!cityName) return;

  try {
    const weatherData = await getCurrentWeather(cityName);
    console.log('Weather response:', weatherData); // DEBUG

    if (weatherData && weatherData.main && weatherData.weather) {
      updateWeatherUI(weatherData, cityName);
    } else {
      updateWeatherUI(null, cityName);
    }
  } catch (error) {
    console.error('Eroare la încărcarea vremii:', error.message);
    updateWeatherUI(null, cityName);
  }

  cityInput.value = '';
});

// Gestionare locație automată
const handleLocationSearch = async () => {
  try {
    const coords = await getCoords();
    console.log('Coordonate primite:', coords);
    if (coords.source === 'ip') {
      console.warn('Locație aproximativă bazată pe IP');
    }

    const weather = await getWeatherByCoords(coords.latitude, coords.longitude);
    updateWeatherUI(weather, weather.name);
  } catch (error) {
    console.error('Eroare la determinarea locației:', error.message);
  }
};

// Evenimente pentru schimbarea preferințelor

elements.unitSelect.addEventListener('change', async (e) => {
  const newUnit = e.target.value;
  CONFIG.DEFAULT_UNITS = newUnit;
  const currentPrefs = loadUserPreferences();
  saveUserPreferences(newUnit, currentPrefs.lang);
});

elements.langSelect.addEventListener('change', async (e) => {
  const newLang = e.target.value;
  CONFIG.DEFAULT_LANG = newLang;
  const currentPrefs = loadUserPreferences();
  saveUserPreferences(currentPrefs.unit, newLang);
});

