export const getCoords = () =>
  new Promise((resolve, reject) => {
    const fallbackToIp = async () => {
      try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        resolve({
          latitude: data.latitude,
          longitude: data.longitude,
          source: 'ip',
          accuracy: 'city'
        });
      } catch {
        reject(new Error('Nu am putut determina locația'));
      }
    };

    if (!navigator.geolocation) {
      return fallbackToIp();
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          source: 'gps',
          accuracy: 'precise'
        });
      },
      (error) => {
        console.warn('Geolocation failed:', error.message);
        fallbackToIp();
      },
      {
        timeout: 5000,
        enableHighAccuracy: true,
        maximumAge: 0
      }
    );
  });
