export const CONFIG = {
  API_KEY: '82becc2b51ae040e93d4cd9122164c73', 
  API_BASE_URL: 'https://api.openweathermap.org/data/2.5/',
  DEFAULT_UNITS: 'metric',
  DEFAULT_LANG: 'ro', 

  // Setări pentru istoric & preferințe
  MAX_HISTORY_ITEMS: 10,
  STORAGE_KEYS: {
    SEARCH_HISTORY: 'weather_search_history',
    USER_PREFERENCES: 'weather_user_prefs',
  },

  // Logging controlat
  LOGGING: {
    ENABLED: true,
    LEVEL: 'info',
    MAX_LOGS: 100,
  }
};

export const API_ENDPOINTS = {
  CURRENT_WEATHER: 'weather',
  FORECAST: 'forecast'
};

export const ERROR_MESSAGES = {
  CITY_NOT_FOUND: 'Orașul nu a fost găsit. Verifică scrierea.',
  NETWORK_ERROR: 'Eroare de rețea. Verifică conexiunea la internet.',
  UNKNOWN_ERROR: 'A apărut o eroare necunoscută. Încearcă din nou.'
};

