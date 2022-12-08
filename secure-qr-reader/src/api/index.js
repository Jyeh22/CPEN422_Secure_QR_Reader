import axios from 'axios'

const contentExtractorApiBlob = axios.create({
  responseType: 'blob',
  withCredentials: true,
  baseURL: 'http://localhost:5000',
});

const contentExtractorApi = axios.create({
  withCredentials: true,
  baseURL: 'http://localhost:5000',
});

export const getContent = async(payload) => contentExtractorApiBlob.put(`/screencap`, payload);
export const getMetrics = async(payload) => contentExtractorApi.put(`/QRAnalysis`, payload);

const api = {
  getContent,
  getMetrics
};

export default api;