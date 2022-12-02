import axios from 'axios'

const contentExtractorApi = axios.create({
  responseType: 'blob',
  withCredentials: true,
  baseURL: 'http://localhost:5000',
});

export const getContent = async(payload) => contentExtractorApi.put(`/screencap`, payload);

const apis = {
  getContent
};

export default apis;