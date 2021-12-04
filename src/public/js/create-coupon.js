import axios from 'axios';
import { showAlert } from './alert';

export const createCoupons = async (data) => {
  try {
    // Send a POST request
    const response = await axios.post('/api/v1/coupons', data); // Since the view and the
    // server are on the same server, hosted in the same place, using the same URL, then we can
    // specify '/api/v1/auth/login' without the base URL 'http://localhost:5000'. This is important
    // for deployment
    // NOTE: You can use fetch directly from the browser console

    if (response.data && response.data.status) {
      const { message, data } = response.data;
      showAlert('success', message);
      window.setTimeout(() => {
        location.assign('/coupons/me');
      }, 1500);
    }
  } catch (error) {
    showAlert('error', error.response.data.message);
  }
};
