import { api } from './api';
import type { Match } from '@/types/match';

export async function getMatches(
  status?: 'upcoming' | 'past'
): Promise<Match[]> {
  const response = await api.get('/api/matches', {
    params: { status },
  });

  return response.data;
}
