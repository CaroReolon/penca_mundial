import { api } from './api';

export const getTornamentsRanking = async (tournamentId) => {
  const response = await api.get(
    `/api/tournaments/${tournamentId}/tournament_rankings`
  );
  return response.data;
};
