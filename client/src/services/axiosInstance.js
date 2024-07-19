import axios from 'axios';

// Create an Axios instance with a base URL
const instance = axios.create({
  baseURL: 'http://localhost:5000/api', // Base URL for your API
});

// Add a request interceptor to include the token in headers
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken'); // Retrieve token from local storage
    if (token) {
      config.headers['x-auth-token'] = token; // Set token in headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;
