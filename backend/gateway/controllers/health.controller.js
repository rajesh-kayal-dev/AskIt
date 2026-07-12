export const checkServiceHealth = async (url) => {
  try {
    const response = await fetch(`${url}/health`, { 
      method: 'GET',
      timeout: 2000 
    });
    return { status: response.status === 200 ? 'running' : 'error' };
  } catch (error) {
    return { status: 'down' };
  }
};

const getRegisteredServices = () => {
  const services = {};
  for (const [key, value] of Object.entries(process.env)) {
    if (key.endsWith('_SERVICE') && value) {
      const name = key.replace('_SERVICE', '').toLowerCase();
      services[name] = value;
    }
  }
  return services;
};

export const getHealth = async (req, res) => {
  const services = getRegisteredServices();
  const servicesStatus = {};

  for (const [name, url] of Object.entries(services)) {
    const { status } = await checkServiceHealth(url);
    try {
      servicesStatus[name] = {
        url,
        port: new URL(url).port,
        status
      };
    } catch (e) {
      servicesStatus[name] = { url, status: 'invalid url' };
    }
  }
  
  res.json({ 
    service: 'gateway', 
    port: process.env.PORT || 8000,
    services: servicesStatus
  });
};

export const logServiceStatuses = async () => {
  const services = getRegisteredServices();
  
  for (const [name, url] of Object.entries(services)) {
    const { status } = await checkServiceHealth(url);
    const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);
    console.log(`${capitalizedName} service ${url}: ${status}`);
  }
};
