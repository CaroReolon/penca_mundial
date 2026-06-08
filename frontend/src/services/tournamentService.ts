import { api } from './api';

export const getTornamentsRanking = async (
  tournamentId: number,
  playGroupId?: number
) => {
  const params = playGroupId ? { play_group_id: playGroupId } : {};
  const response = await api.get(
    `/api/tournaments/${tournamentId}/tournament_rankings`,
    { params }
  );
  return response.data;
};
