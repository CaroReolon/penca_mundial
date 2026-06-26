export interface Team {
  id: number;
  name: string;
  name_en: string;
  short_name: string;
  short_name_en: string;
  code: string;
  flag: string;
}

export type MatchStage =
  | 'group_stage'
  | 'round_of_32'
  | 'round_of_16'
  | 'quarter_final'
  | 'semi_final'
  | 'third_place'
  | 'final';

export interface Match {
  id: number;
  stage: MatchStage;
  group: string | null;
  kickoff_at: string;
  stadium: string;
  stadium_en?: string;
  home_team: Team;
  away_team: Team;
  home_score?: number;
  away_score?: number;
  completed?: boolean;
  went_to_penalties?: boolean;
  penalty_winner_team_id?: number | null;
  prediction: {
    id: number;
    home_score: number;
    away_score: number;
    user_id: number;
    match_id: number;
    points_awarded?: number;
    penalty_winner_team_id?: number | null;
  } | null;
}

export function isKnockoutStage(stage: MatchStage): boolean {
  return stage !== 'group_stage';
}
