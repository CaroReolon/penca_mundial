import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { teamName, teamShortName, stadiumName, formatKickoff } from '@/lib/localize';
import type { Team } from '@/types/match';

type PastMatch = {
  id: string;
  group: string;
  kickoff_at: string;
  stadium: string;
  stadium_en?: string;
  home_team: Team;
  away_team: Team;
  home_score: number;
  away_score: number;
  prediction: {
    id: string;
    away_score: number;
    home_score: number;
    points_awarded: number;
  };
};

type Props = {
  match: PastMatch;
  /** Override the prediction label (e.g. "Prediction by Juan"). Defaults to the translated "Your prediction". */
  predictionLabel?: string;
};

export function PastMatchCard({ match, predictionLabel }: Props) {
  const { language, t } = useLanguage();

  const label  = predictionLabel ?? t('past.myPrediction');
  const points = match.prediction.points_awarded;

  const homeShort = teamShortName(match.home_team, language);
  const awayShort = teamShortName(match.away_team, language);
  const stadium   = stadiumName(match, language);

  const formattedDate = formatKickoff(match.kickoff_at, language);

  const getBadgeColor = (pts: number) => {
    if (pts >= 3)
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300';
    if (pts > 0)
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="relative overflow-hidden p-6 border-t-4 border-t-muted-foreground/20">
      {/* POINTS BADGE */}
      <div className="absolute right-3 top-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors ${getBadgeColor(points)}`}
        >
          +{points} {points === 1 ? t('past.point') : t('past.points')}
        </span>
      </div>

      <div className="mb-2 text-center text-sm text-muted-foreground">
        {t('match.group')} {match.group} • {t('past.final')}
      </div>

      <div className="mb-4 text-center text-xs text-muted-foreground">
        {formattedDate}
      </div>

      {/* TEAMS + SCORE */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
          <div className="text-4xl">{match.home_team.flag}</div>
          <div
            className="w-full text-center text-sm font-medium leading-tight"
            title={teamName(match.home_team, language)}
          >
            {homeShort}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-3 px-2">
          <span className="text-3xl font-black tabular-nums">{match.home_score}</span>
          <span className="text-muted-foreground font-bold text-xs">FT</span>
          <span className="text-3xl font-black tabular-nums">{match.away_score}</span>
        </div>

        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
          <div className="text-4xl">{match.away_team.flag}</div>
          <div
            className="w-full text-center text-sm font-medium leading-tight"
            title={teamName(match.away_team, language)}
          >
            {awayShort}
          </div>
        </div>
      </div>

      {/* USER PREDICTION */}
      <div className="mt-5 rounded-lg bg-muted/40 p-2 text-center text-xs">
        <span className="text-muted-foreground block mb-1">{label}</span>
        <div className="flex items-center justify-center gap-2 font-semibold text-sm">
          <span className="min-w-0 truncate" title={teamName(match.home_team, language)}>
            {homeShort}
          </span>
          <span className="flex-shrink-0 rounded border bg-background px-2 py-0.5 text-foreground">
            {match.prediction.home_score} - {match.prediction.away_score}
          </span>
          <span className="min-w-0 truncate" title={teamName(match.away_team, language)}>
            {awayShort}
          </span>
        </div>
      </div>

      <div className="mt-3 text-center text-[11px] text-muted-foreground">
        📍 {stadium}
      </div>
    </Card>
  );
}
