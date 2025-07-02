import { CONFIG, API_ENDPOINTS, ERROR_MESSAGES } from './config.js';

const buildUrl = (endpoint, params = {}) => {
  const url = new URL(CONFIG.API_BASE_URL + endpoint);
  url.searchParams.set('appid', CONFIG.API_KEY);
  url.searchParams.set('units', CONFIG.DEFAULT_UNITS);
  url.searchParams.set('lang', CONFIG.DEFAULT_LANG);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== '') {
      url.searchParams.set(key, value);
    }
  });

  return url.toString();
};

const makeRequest = async (url) => {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      if (response.status === 404) throw new Error(ERROR_MESSAGES.CITY_NOT_FOUND);
      if (response.status === 401) throw new Error('Cheie API invalidă.');
      if (response.status >= 500) throw new Error('Serverul nu răspunde momentan.');
      throw new Error(ERROR_MESSAGES.UNKNOWN_ERROR);
    }

    return await response.json();
  } catch (error) {
    if (error.name === 'TypeError') {
      throw new Error(ERROR_MESSAGES.NETWORK_ERROR);
    }
    throw error;
  }
};

export const getCurrentWeather = async (city) => {
  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { q: city });
  return await makeRequest(url);
};

export const getWeatherByCoords = async (lat, lon) => {
  const url = buildUrl(API_ENDPOINTS.CURRENT_WEATHER, { lat, lon });
  return await makeRequest(url);
};

export const getWeather = getCurrentWeather;

