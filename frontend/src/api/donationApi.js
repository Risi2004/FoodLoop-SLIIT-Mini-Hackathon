import axios from './axiosInstance';

export const createDonation = (data) => axios.post('/donations', data);
export const getActiveDonations = () => axios.get('/donations');
export const claimDonation = (donationId, quantity) =>
  axios.put(`/donations/${donationId}/claim`, { quantity });
export const updateDonation = (donationId, data) =>
  axios.put(`/donations/${donationId}`, data);

export const deleteDonation = (donationId) =>
  axios.delete(`/donations/${donationId}`);