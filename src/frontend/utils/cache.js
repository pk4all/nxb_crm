const CACHE_KEY_PREFIX = 'api_cache_';

export const getFromCache = (key) => {
  const cachedData = localStorage.getItem(CACHE_KEY_PREFIX + key);
  if (cachedData) {
    const { data, expiry } = JSON.parse(cachedData);
    if (expiry && Date.now() < expiry) {
      return data;
    } else {
      localStorage.removeItem(CACHE_KEY_PREFIX + key);
    }
  }
  return null;
};

export const setInCache = (key, data, ttl = 600000) => { // ttl default to 10 minutes
  const expiry = Date.now() + ttl;
  localStorage.setItem(CACHE_KEY_PREFIX + key, JSON.stringify({ data, expiry }));
};