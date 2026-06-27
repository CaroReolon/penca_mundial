import { api } from './api';

export const predictionService = {
  create: async (
    matchId: number,
    homeTeamScore: number,
    awayTeamScore: number,
    penaltyWinnerTeamId?: number | null
  ) => {
    const response = await api.post('/api/predictions', {
      prediction: {
        match_id: matchId,
        home_score: homeTeamScore,
        away_score: awayTeamScore,
        penalty_winner_team_id: penaltyWinnerTeamId ?? null,
      },
    });

    return response.data;
  },

  update: async (
    predictionId: number,
    homeTeamScore: number,
    awayTeamScore: number,
    penaltyWinnerTeamId?: number | null
  ) => {
    const response = await api.patch(`/api/predictions/${predictionId}`, {
      prediction: {
        home_score: homeTeamScore,
        away_score: awayTeamScore,
        penalty_winner_team_id: penaltyWinnerTeamId ?? null,
      },
    });

    return response.data;
  },
};
