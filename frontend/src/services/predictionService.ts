import { api } from './api';

export const predictionService = {
  create: async (
    matchId: number,
    homeTeamScore: number,
    awayTeamScore: number
  ) => {
    const response = await api.post('/api/predictions', {
      prediction: {
        match_id: matchId,
        home_score: homeTeamScore,
        away_score: awayTeamScore,
      },
    });

    return response.data;
  },

  update: async (
    predictionId: number,
    homeTeamScore: number,
    awayTeamScore: number
  ) => {
    const response = await api.patch(`/api/predictions/${predictionId}`, {
      prediction: {
        home_score: homeTeamScore,
        away_score: awayTeamScore,
      },
    });

    return response.data;
  },
};
