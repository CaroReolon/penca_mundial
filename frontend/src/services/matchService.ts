import { api } from './api';

export async function getMatchGroupPredictions(matchId: string | number, playGroupId: number) {
  const response = await api.get(`/api/matches/${matchId}/group_predictions`, {
    params: { play_group_id: playGroupId },
  });
  return response.data;
}
