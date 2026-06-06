export interface Match {
  prediction: {
    id: number;
    home_score: number;
    away_score: number;
    user_id: number;
    match_id: number;
  };
  id: number;
  group: string;

  stadium: string;

  kickoff_at: string;

  home_team: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };

  away_team: {
    id: number;
    name: string;
    code: string;
    flag: string;
  };
}
