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