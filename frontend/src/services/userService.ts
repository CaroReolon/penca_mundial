import { api } from './api';

export async function getUserMatches(userId: number) {
  const response = await api.get(`/api/users/${userId}/matches`);
  return response.data;
}

export async function uploadAvatar(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('avatar', file);

  const response = await api.put('/api/me/avatar', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

  return response.data.avatar_url;
}

export async function deleteAvatar(): Promise<void> {
  await api.delete('/api/me/avatar');
}
