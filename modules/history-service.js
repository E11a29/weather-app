import { CONFIG } from './config.js';
import { logger } from './logger.js';

export class HistoryService {
  constructor() {
    this.storageKey = CONFIG.STORAGE_KEYS.SEARCH_HISTORY;
    this.maxItems = CONFIG.MAX_HISTORY_ITEMS;
  }

  addLocation(weatherData) {
    try {
      const city = weatherData.name;
      const country = weatherData.sys.country;
      const coordinates = weatherData.coord;

      const history = this._loadFromStorage();

      const existingIndex = history.findIndex(
        (item) => item.city.toLowerCase() === city.toLowerCase()
      );

      const newEntry = {
        city,
        country,
        coordinates,
        timestamp: Date.now()
      };

      if (existingIndex !== -1) {
        // Mutăm în top
        const [existing] = history.splice(existingIndex, 1);
        history.unshift(existing);
        logger.info(`Mutat în top: ${city}`);
      } else {
        // Adăugăm nou
        history.unshift(newEntry);
        logger.info(`Locație adăugată în istoric: ${city}`);
      }

      // Limităm istoricul
      if (history.length > this.maxItems) {
        history.splice(this.maxItems);
      }

      this._saveToStorage(history);
    } catch (error) {
      logger.error('Eroare la salvarea locației în istoric', error);
    }
  }

  getHistory() {
    return this._loadFromStorage();
  }

  removeLocation(city) {
    const history = this._loadFromStorage();
    const updated = history.filter(
      (item) => item.city.toLowerCase() !== city.toLowerCase()
    );
    this._saveToStorage(updated);
    logger.info(`Locație ștearsă din istoric: ${city}`);
  }

  clearHistory() {
    localStorage.removeItem(this.storageKey);
    logger.info('Istoric șters complet');
  }

  _saveToStorage(historyArray) {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(historyArray));
    } catch (error) {
      logger.error('Eroare la scrierea în localStorage', error);
    }
  }

  _loadFromStorage() {
    try {
      const stored = localStorage.getItem(this.storageKey);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      logger.error('Eroare la citirea din localStorage', error);
      return [];
    }
  }
}

export const historyService = new HistoryService();
