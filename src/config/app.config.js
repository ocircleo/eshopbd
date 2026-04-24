
// CHANGE THIS LINE ONLY TO SWITCH ENVIRONMENTS
const ACTIVE_ENV = "lan1"; // "local", "lan1", "lan2", "prod"
const CONFIG = {
  local: {
    webUrl: "http://localhost:3000",
    apiUrl: "http://localhost:5000",
    proxyApiUrl: "http://localhost:3000/api-proxy",
  },

  lan1: {
    webUrl: "http://192.168.0.100:3000",
    apiUrl: "http://192.168.0.100:5000",
    proxyApiUrl: "http://192.168.0.100:3000/api-proxy",
  },

  lan2: {
    webUrl: "http://192.168.0.120:3000",
    apiUrl: "http://192.168.0.120:5000",
    proxyApiUrl: "http://192.168.0.120:3000/api-proxy",
  },

  prod: {
    webUrl: "https://www.bangladeshcounsel.com",
    apiUrl: "https://api.bangladeshcounsel.com",
    proxyApiUrl: "https://www.bangladeshcounsel.com/api-proxy",
  },
};

export const APP_CONFIG = CONFIG[ACTIVE_ENV];
