export interface Team {
  id: number;
  name: string;
  name_en: string;
  short_name: string;
  short_name_en: string;
  code: string;
  flag: string;
}

export interface Match {
  id: number;
  group: string;
  kickoff_at: string;
  stadium: string;
  stadium_en?: string;
  home_team: Team;
  away_team: Team;
  prediction: {
    id: number;
    home_score: number;
    away_score: number;
    user_id: number;
    match_id: number;
    points_awarded?: number;
  } | null;
}
