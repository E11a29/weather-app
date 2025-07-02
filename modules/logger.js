import { CONFIG } from './config.js';

// Definim nivelurile de logging
const levels = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3
};

export class Logger {
  constructor() {
    this.logs = [];
    this.level = CONFIG.LOGGING.LEVEL || 'info';
    this.maxLogs = CONFIG.LOGGING.MAX_LOGS || 100;
    this.enabled = CONFIG.LOGGING.ENABLED ?? true;
  }

  // Log pentru debug
  debug(message, data) {
    this._addLog('debug', message, data);
  }

  // Log pentru informații generale
  info(message, data) {
    this._addLog('info', message, data);
  }

  // Log pentru avertismente
  warn(message, data) {
    this._addLog('warn', message, data);
  }

  // Log pentru erori
  error(message, errorObj) {
    const data = errorObj instanceof Error
      ? { message: errorObj.message, stack: errorObj.stack }
      : errorObj;
    this._addLog('error', message, data);
  }

  // Intern: adaugă un log dacă nivelul e permis
  _addLog(level, message, data) {
    if (!this.enabled || levels[level] < levels[this.level]) return;

    const timestamp = new Date().toLocaleTimeString();
    const logEntry = {
      time: timestamp,
      level,
      message,
      data: data || null
    };

    this.logs.push(logEntry);

    if (this.logs.length > this.maxLogs) {
      this.logs.shift(); // elimină cel mai vechi log
    }

    // Afișare în consolă
    const tag = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    console[level === 'debug' ? 'log' : level](tag, data || '');
  }

  getLogs() {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  show() {
    console.table(this.logs);
  }
}

// Export instanță globală
export const logger = new Logger();

// Expune interfață pentru browser
window.logs = {
  show: () => logger.show(),
  clear: () => logger.clearLogs(),
  get: () => logger.getLogs()
};
