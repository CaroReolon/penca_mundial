import { api } from './api';

export interface AdminMatch {
  id: number;
  stage: string;
  kickoff_at: string;
  stadium: string | null;
  stadium_en: string | null;
  group: string | null;
  home_team: AdminTeam | null;
  away_team: AdminTeam | null;
  home_score: number | null;
  away_score: number | null;
  completed: boolean;
  went_to_penalties: boolean;
  penalty_winner_team_id: number | null;
}

export interface AdminTeam {
  id: number;
  name: string;
  name_en: string;
  flag: string;
  short_name: string;
}

export async function adminGetMatches(): Promise<AdminMatch[]> {
  const res = await api.get('/api/admin/matches');
  return res.data;
}

export async function adminGetTeams(): Promise<AdminTeam[]> {
  const res = await api.get('/api/admin/teams');
  return res.data;
}

export async function adminCreateMatch(data: {
  home_team_id: number;
  away_team_id: number;
  kickoff_at: string;
  stadium: string;
  stadium_en: string;
  stage: string;
}): Promise<AdminMatch> {
  const res = await api.post('/api/admin/matches', { match: data });
  return res.data;
}

export async function adminUpdateMatch(
  id: number,
  data: Partial<{
    home_team_id: number;
    away_team_id: number;
    home_score: number;
    away_score: number;
    completed: boolean;
    kickoff_at: string;
    stadium: string;
    stadium_en: string;
    went_to_penalties: boolean;
    penalty_winner_team_id: number | null;
  }>
): Promise<AdminMatch> {
  const res = await api.patch(`/api/admin/matches/${id}`, { match: data });
  return res.data;
}
