import axios from 'axios';

const adminAxiosInstance = axios.create({
  baseURL: 'http://192.168.1.110:3000/api/admin', // Ajuste o caminho base para administração
});

export default adminAxiosInstance;