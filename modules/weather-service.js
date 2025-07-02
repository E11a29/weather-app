import { MOCK_DATA } from './config.js';

// Funcție pentru obținerea vremii după numele orașului
export function getCurrentWeather(city) {
  return new Promise(function(resolve, reject) {
    // Simulează delay API (~1 secundă)
    setTimeout(function() {
      try {

        if (!city || city.trim() === '') {
          reject(new Error('Numele orașului nu poate fi gol'));
          return;
        }
        
        // Returnează MOCK_DATA cu numele orașului actualizat
        var weatherData = {
          coord: MOCK_DATA.coord,
          weather: MOCK_DATA.weather,
          base: MOCK_DATA.base,
          main: MOCK_DATA.main,
          visibility: MOCK_DATA.visibility,
          wind: MOCK_DATA.wind,
          clouds: MOCK_DATA.clouds,
          dt: MOCK_DATA.dt,
          sys: MOCK_DATA.sys,
          timezone: MOCK_DATA.timezone,
          id: MOCK_DATA.id,
          name: city.trim(), 
          cod: MOCK_DATA.cod
        };
        
        resolve(weatherData);
      } catch (error) {
        reject(new Error('Eroare la obținerea datelor meteo pentru ' + city));
      }
    }, 1000);
  });
}


export function getWeatherByCoords(lat, lon) {
  return new Promise(function(resolve, reject) {
    // Simulează delay API (~1 secundă)
    setTimeout(function() {
      try {

        if (lat === undefined || lon === undefined) {
          reject(new Error('Coordonatele nu pot fi goale'));
          return;
        }
        
        if (lat < -90 || lat > 90) {
          reject(new Error('Latitudinea trebuie să fie între -90 și 90'));
          return;
        }
        
        if (lon < -180 || lon > 180) {
          reject(new Error('Longitudinea trebuie să fie între -180 și 180'));
          return;
        }
        

        var weatherData = {
          coord: {
            lat: lat,
            lon: lon
          },
          weather: MOCK_DATA.weather,
          base: MOCK_DATA.base,
          main: MOCK_DATA.main,
          visibility: MOCK_DATA.visibility,
          wind: MOCK_DATA.wind,
          clouds: MOCK_DATA.clouds,
          dt: MOCK_DATA.dt,
          sys: MOCK_DATA.sys,
          timezone: MOCK_DATA.timezone,
          id: MOCK_DATA.id,
          name: 'Lat: ' + lat + ', Lon: ' + lon,
          cod: MOCK_DATA.cod
        };
        
        resolve(weatherData);
      } catch (error) {
        reject(new Error('Eroare la obținerea datelor meteo pentru coordonatele ' + lat + ', ' + lon));
      }
    }, 1000);
  });
}

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

