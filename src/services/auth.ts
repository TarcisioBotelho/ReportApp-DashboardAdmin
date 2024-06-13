import axios from 'axios';

export const login = async (email: string, password: string) => {
  const response = await axios.post('/api/admin/login', { email, password });
  localStorage.setItem('token', response.data.token);
};

export const logout = () => {
  localStorage.removeItem('token');
};

export {};