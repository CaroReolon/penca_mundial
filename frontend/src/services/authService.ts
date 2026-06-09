import { api } from './api';

export const authService = {
  logout: () => api.delete('/api/logout'),
};
