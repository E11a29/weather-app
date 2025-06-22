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