const getLocalIP = () => {
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    return window.location.hostname.split(':')[0];
  }
  return '192.168.0.2'; // fallback IP
};

export const API_BASE_URL = process.env.NODE_ENV === 'development'
  ? `http://${getLocalIP()}:3001/api`
  : '/api';

export const WS_BASE_URL = process.env.NODE_ENV === 'development'
  ? `ws://${getLocalIP()}:3001`
  : 'wss://the-x.shop';