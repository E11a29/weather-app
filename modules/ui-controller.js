// Obține elementele din DOM
export const elements = {
  cityInput: document.getElementById('cityInput'),
  unitSelect: document.getElementById('unit-select'),
  langSelect: document.getElementById('lang-select'),
  weatherDisplay: document.getElementById('weatherResult'),
  historySection: document.getElementById('history-section'),
  historyList: document.getElementById('history-list'),
  clearHistoryBtn: document.getElementById('clear-history-btn')
};

// Returnează elementele - folosit de app.js
export const getElements = () => elements;

// ✅ UI pentru vreme
export const updateWeatherUI = (data, cityName) => {
  const container = elements.weatherDisplay;
  container.innerHTML = '';
  container.classList.remove('fade-in');

  if (!data || !data.main || !data.weather) {
    container.textContent = `Nu s-au găsit date pentru "${cityName}".`;
    return;
  }

  const city = document.createElement('h2');
  city.textContent = data.name;

  const temp = document.createElement('p');
  const symbol = data.units === 'imperial' ? '°F' : '°C';
  temp.textContent = `Temperatura: ${Math.round(data.main.temp)}${symbol}`;

  const desc = document.createElement('p');
  desc.textContent = `Condiții: ${data.weather[0].description}`;

  container.appendChild(city);
  container.appendChild(temp);
  container.appendChild(desc);

  container.classList.add('fade-in');
};

// ✅ Salvare / încărcare preferințe
export const saveUserPreferences = (unit, lang) => {
  localStorage.setItem('weatherAppPreferences', JSON.stringify({ unit, lang }));
};

export const loadUserPreferences = () => {
  const stored = localStorage.getItem('weatherAppPreferences');
  if (stored) {
    return JSON.parse(stored);
  }
  return {
    unit: 'metric',
    lang: 'ro'
  };
};

// ✅ Afișare istoric
export const showHistory = () => {
  elements.historySection?.classList.remove('hidden');
};

export const hideHistory = () => {
  elements.historySection?.classList.add('hidden');
};

export const renderHistory = (historyItems) => {
  if (!elements.historyList) return;

  if (historyItems.length === 0) {
    elements.historyList.innerHTML = '<p class="no-history">Nu ai căutări recente</p>';
    return;
  }

  const historyHTML = historyItems.map((item) => {
    const timeAgo = getTimeAgo(item.timestamp);
    return `
      <div class="history-item" data-city="${item.city}" data-lat="${item.coordinates.lat}" data-lon="${item.coordinates.lon}">
        <div class="history-location">
          <span class="city">${item.city}</span>, 
          <span class="country">${item.country}</span>
        </div>
        <div class="history-time">${timeAgo}</div>
      </div>
    `;
  }).join('');

  elements.historyList.innerHTML = historyHTML;
};

// ✅ Evenimente pentru click pe istoric și ștergere
export const addHistoryEventListeners = (onClickItem, onClear) => {
  if (elements.historyList) {
    elements.historyList.addEventListener('click', (e) => {
      const item = e.target.closest('.history-item');
      if (item) {
        const city = item.dataset.city;
        const lat = item.dataset.lat;
        const lon = item.dataset.lon;
        onClickItem(city, lat, lon);
      }
    });
  }

  if (elements.clearHistoryBtn) {
    elements.clearHistoryBtn.addEventListener('click', onClear);
  }
};

// ✅ Utilitar pentru afișare "acum X minute/ore"
const getTimeAgo = (timestamp) => {
  const now = Date.now();
  const diff = now - timestamp;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 60) return `${minutes} minute în urmă`;
  if (hours < 24) return `${hours} ore în urmă`;
  return `${days} zile în urmă`;
};
