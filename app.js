// Importuri actualizate
import {
  getCurrentWeather,
  getWeatherByCoords
} from './modules/weather-service.js';

import {
  updateWeatherUI,
  saveUserPreferences,
  loadUserPreferences,
  renderHistory,
  showHistory,
  addHistoryEventListeners
} from './modules/ui-controller.js';

import { CONFIG } from './modules/config.js';
import { getCoords } from './modules/location-service.js';
import { historyService } from './modules/history-service.js';
import { logger } from './modules/logger.js';

const elements = {
  cityInput: document.getElementById('cityInput'),
  unitSelect: document.getElementById('unit-select'),
  langSelect: document.getElementById('lang-select'),
  form: document.getElementById('weatherForm')
};

// Inițializare aplicație
const initializeApp = async () => {
  logger.info('Weather App starting...');

  loadPreferences();
  setupEventListeners();
  loadHistoryOnStart();

  logger.info('Weather App initialized successfully');
};

const loadPreferences = () => {
  const preferences = loadUserPreferences();
  CONFIG.DEFAULT_UNITS = preferences.unit;
  CONFIG.DEFAULT_LANG = preferences.lang;
  elements.unitSelect.value = CONFIG.DEFAULT_UNITS;
  elements.langSelect.value = CONFIG.DEFAULT_LANG;
};

const loadHistoryOnStart = () => {
  const history = historyService.getHistory();
  if (history.length > 0) {
    renderHistory(history);
    showHistory();
    logger.info(`Loaded ${history.length} items from history`);
  }
};

const handleSearch = async () => {
  const city = elements.cityInput.value.trim();

  logger.debug('Search initiated', { city });

  if (!city) {
    logger.warn('Empty city input');
    return;
  }

  try {
    logger.info('Fetching weather data', { city });
    const weatherData = await getCurrentWeather(city);
    historyService.addLocation(weatherData);
    updateWeatherUI(weatherData, city);
    elements.cityInput.value = '';

    const updatedHistory = historyService.getHistory();
    renderHistory(updatedHistory);
    showHistory();

    logger.info('Weather data displayed successfully', {
      city: weatherData.name,
      temp: weatherData.main.temp
    });
  } catch (error) {
    logger.error('Failed to fetch weather data', error);
  }
};

const handleHistoryClick = async (event) => {
  const historyItem = event.target.closest('.history-item');
  if (!historyItem) return;

  const city = historyItem.dataset.city;
  const lat = parseFloat(historyItem.dataset.lat);
  const lon = parseFloat(historyItem.dataset.lon);

  logger.info('History item clicked', { city, lat, lon });

  try {
    const weatherData = await getWeatherByCoords(lat, lon);
    historyService.addLocation(weatherData);
    updateWeatherUI(weatherData, city);

    const updatedHistory = historyService.getHistory();
    renderHistory(updatedHistory);

    logger.info('Weather loaded from history', { city });
  } catch (error) {
    logger.error('Failed to load weather from history', error);
  }
};

const handleClearHistory = () => {
  if (confirm('Sigur vrei să ștergi tot istoricul de căutări?')) {
    historyService.clearHistory();
    renderHistory([]);
    logger.info('Search history cleared');
  }
};

const setupEventListeners = () => {
  elements.form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleSearch();
  });

  elements.unitSelect.addEventListener('change', (e) => {
    const newUnit = e.target.value;
    CONFIG.DEFAULT_UNITS = newUnit;
    const currentPrefs = loadUserPreferences();
    saveUserPreferences(newUnit, currentPrefs.lang);
  });

  elements.langSelect.addEventListener('change', (e) => {
    const newLang = e.target.value;
    CONFIG.DEFAULT_LANG = newLang;
    const currentPrefs = loadUserPreferences();
    saveUserPreferences(currentPrefs.unit, newLang);
  });

  addHistoryEventListeners(handleHistoryClick, handleClearHistory);
};

initializeApp();
