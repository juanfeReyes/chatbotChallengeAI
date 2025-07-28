import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';


// Create an axios instance
const api = axios.create();

// Add a response interceptor
api.interceptors.response.use(
  response => response,
  error => {
    // Handle error globally
    if (error.response) {
      // Server responded with a status other than 2xx
      console.error('API Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // No response received
      console.error('No response from server');
    } else {
      // Something else happened
      console.error('Error', error.message);
    }
    toast.error(error.response.data.error )
    return Promise.reject(error);
  }
);

export default api;
