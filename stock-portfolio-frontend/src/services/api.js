// src/services/api.js - CORRected version
import axios from 'axios';

const API = axios.create({
    baseURL: 'http://localhost:5000/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

export const loginUser = async (formData) => {
    const response = await API.post('/auth/login', formData);
    return response.data; // Return data part
};
export const signupUser = async (formData) => {
    const response = await API.post('/auth/register', formData);
    return response.data; // Return data part
};
export const getUserPortfolio = async () => {
    const response = await API.get('/portfolio');
    return response.data; // Return data part
};
export const addStockToPortfolio = async (stock) => {
    const response = await API.post('/portfolio', stock);
    return response.data; // Return data part
};
export const deleteStockFromPortfolio = async (portfolioItemId) => {
    const response = await API.delete(`/portfolio/${portfolioItemId}`);
    return response.data; // Return data part
};
export const getWatchlist = async () => {
    const response = await API.get('/watchlist');
    return response.data; // Return data part
};
export const addToWatchlist = async (stock) => {
    const response = await API.post('/watchlist', stock);
    return response.data; // Return data part
};
export const deleteFromWatchlist = async (watchlistId) => {
    const response = await API.delete(`/watchlist/${watchlistId}`);
    return response.data; // Return data part
};
export const getStockHistory = async () => {
    const response = await API.get('/history');
    return response.data; // Return data part
};
export const getAllUsers = async () => {
    const response = await API.get('/admin/users');
    return response.data; // Return data part
};
export const fetchMarketNews = async () => {
    const response = await API.get('/market/news'); // Calls your backend proxy
    return response.data;
};

export const fetchStockSymbols = async (exchangeCode = 'US') => { // Default to US
    // Pass exchange code as a query parameter to your backend
    const response = await API.get(`/market/symbols?exchange=${exchangeCode}`);
    return response.data;
};

export const fetchQuote = async (symbol) => {
    if (!symbol) throw new Error("Symbol is required for fetching quote.");
    const response = await API.get(`/market/quote/${symbol}`); // Calls backend proxy
    return response.data; // Returns { c, d, dp, h, l, o, pc, t, timestamp }
};

export const fetchTop100US = async () => {
    const response = await API.get('/market/top100/us');
    return response.data;
};

export const fetchTop100Nifty = async () => {
    const response = await API.get('/market/top100/nifty');
    return response.data;
};

export const fetchTop100Sensex = async () => {
    const response = await API.get('/market/top100/sensex');
    return response.data;
};