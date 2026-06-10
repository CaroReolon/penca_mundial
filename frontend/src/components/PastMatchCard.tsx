import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { teamName, teamShortName, stadiumName, formatKickoff } from '@/lib/localize';
import type { Team, MatchStage } from '@/types/match';

type PastMatch = {
  id: string;
  stage: MatchStage;
  group: string | null;
  kickoff_at: string;
  stadium: string;
  stadium_en?: string;
  home_team: Team;
  away_team: Team;
  home_score: number | null;
  away_score: number | null;
  completed: boolean;
  prediction: {
    id: string;
    away_score: number;
    home_score: number;
    points_awarded: number;
  } | null;
};

type Props = {
  match: PastMatch;
  /** Override the prediction label (e.g. "Prediction by Juan"). Defaults to the translated "Your prediction". */
  predictionLabel?: string;
};

const getPredictionBg = (pts: number | null) => {
  if (pts === null) return 'bg-muted/40';
  if (pts >= 5) return 'bg-green-100';
  if (pts >= 3) return 'bg-blue-100';
  if (pts >= 1) return 'bg-yellow-100';
  return 'bg-muted/40';
};

const getPredictionMuted = (pts: number) => {
  if (pts >= 5) return 'text-green-700';
  if (pts >= 3) return 'text-blue-700';
  if (pts >= 1) return 'text-yellow-700';
  return 'text-muted-foreground';
};

const getPredictionScore = (pts: number) => {
  if (pts >= 5) return 'border-green-300 bg-green-50 text-green-900';
  if (pts >= 3) return 'border-blue-300 bg-blue-50 text-blue-900';
  if (pts >= 1) return 'border-yellow-300 bg-yellow-50 text-yellow-900';
  return 'border bg-background text-foreground';
};

const MATCH_DURATION_MS = 115 * 60 * 1000; // 115 minutes

type MatchStatus = 'finished' | 'processing' | 'live';

function getMatchStatus(kickoff_at: string, completed: boolean): MatchStatus {
  if (completed) return 'finished';
  const elapsed = Date.now() - new Date(kickoff_at).getTime();
  return elapsed >= MATCH_DURATION_MS ? 'processing' : 'live';
}

const STATUS_STYLES: Record<MatchStatus, { border: string; banner: string }> = {
  finished:   { border: 'border-t-muted-foreground/20', banner: '' },
  live:       { border: 'border-t-orange-400',          banner: 'bg-orange-500' },
  processing: { border: 'border-t-amber-400',           banner: 'bg-amber-500' },
};

export function PastMatchCard({ match, predictionLabel }: Props) {
  const { language, t } = useLanguage();

  const label  = predictionLabel ?? t('past.myPrediction');
  const points = match.prediction?.points_awarded ?? null;
  const status = getMatchStatus(match.kickoff_at, match.completed);
  const styles = STATUS_STYLES[status];

  const homeShort = teamShortName(match.home_team, language);
  const awayShort = teamShortName(match.away_team, language);
  const stadium   = stadiumName(match, language);
  const formattedDate = formatKickoff(match.kickoff_at, language);

  const getBadgeColor = (pts: number | null) => {
    if (pts === null) return 'bg-muted text-muted-foreground border-transparent';
    if (pts >= 5) return 'bg-green-100 text-green-800 border-green-300';
    if (pts >= 3) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (pts >= 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-muted text-muted-foreground border-transparent';
  };

  return (
    <Card className={`relative overflow-hidden p-6 border-t-4 ${styles.border}`}>

      {/* STATUS BANNER — live (orange) or processing (amber) */}
      {status === 'live' && (
        <div className={`absolute inset-x-0 top-0 flex items-center justify-center gap-1.5 ${styles.banner} py-1 text-[11px] font-semibold uppercase tracking-widest text-white`}>
          <span className="inline-block h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
          {t('past.liveNotice')}
        </div>
      )}
      {status === 'processing' && (
        <div className={`absolute inset-x-0 top-0 flex items-center justify-center gap-1.5 ${styles.banner} py-1 text-[11px] font-semibold uppercase tracking-widest text-white`}>
          ⏳ {t('past.processingNotice')}
        </div>
      )}

      {/* POINTS BADGE — shown whenever the user has a prediction with points, at any status */}
      {points !== null && (
        <div className={`absolute right-3 ${status !== 'finished' ? 'top-7' : 'top-3'}`}>
          <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors ${getBadgeColor(points)}`}>
            +{points} {points === 1 ? t('past.point') : t('past.points')}
          </span>
        </div>
      )}

      <div className={`mb-2 text-center text-sm font-medium ${status !== 'finished' ? 'mt-6' : ''}`}>
        {match.stage === 'group_stage' ? (
          <span className="text-muted-foreground">
            {t('match.group')} {match.group}
            {status === 'finished' && <> • {t('past.final')}</>}
          </span>
        ) : (
          <span className="inline-flex items-center gap-1.5">
            <span className="rounded-md bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-800">
              {t(`match.stage.${match.stage}` as any)}
            </span>
            {status === 'finished' && (
              <span className="text-xs text-muted-foreground">• {t('past.final')}</span>
            )}
          </span>
        )}
      </div>

      <div className="mb-4 text-center text-xs text-muted-foreground">
        {formattedDate}
      </div>

      {/* TEAMS + SCORE */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
          <div className="text-4xl">{match.home_team.flag}</div>
          <div className="w-full text-center text-sm font-medium leading-tight" title={teamName(match.home_team, language)}>
            {homeShort}
          </div>
        </div>

        <div className="flex flex-shrink-0 items-center gap-3 px-2">
          {status === 'finished' ? (
            <>
              <span className="text-3xl font-black tabular-nums">{match.home_score}</span>
              <span className="text-muted-foreground font-bold text-xs">FT</span>
              <span className="text-3xl font-black tabular-nums">{match.away_score}</span>
            </>
          ) : status === 'processing' ? (
            <>
              <span className="text-3xl font-black tabular-nums text-amber-600">
                {match.home_score ?? '?'}
              </span>
              <span className="text-amber-500 font-bold text-xs">~FT</span>
              <span className="text-3xl font-black tabular-nums text-amber-600">
                {match.away_score ?? '?'}
              </span>
            </>
          ) : match.home_score !== null && match.away_score !== null ? (
            <>
              <span className="text-3xl font-black tabular-nums text-orange-500">{match.home_score}</span>
              <span className="text-orange-400 font-bold text-xs">LIVE</span>
              <span className="text-3xl font-black tabular-nums text-orange-500">{match.away_score}</span>
            </>
          ) : (
            <span className="text-2xl font-black text-orange-400 tabular-nums px-1">? - ?</span>
          )}
        </div>

        <div className="flex min-w-0 flex-col items-center gap-1 text-center">
          <div className="text-4xl">{match.away_team.flag}</div>
          <div className="w-full text-center text-sm font-medium leading-tight" title={teamName(match.away_team, language)}>
            {awayShort}
          </div>
        </div>
      </div>

      {/* USER PREDICTION */}
      {match.prediction ? (
        <div className={`mt-5 rounded-lg p-2 text-center text-xs ${getPredictionBg(points)}`}>
          <span className={`block mb-1 ${getPredictionMuted(points ?? 0)}`}>{label}</span>
          <div className="flex items-center justify-center gap-2 font-semibold text-sm">
            <span className="min-w-0 truncate" title={teamName(match.home_team, language)}>{homeShort}</span>
            <span className={`flex-shrink-0 rounded border px-2 py-0.5 ${getPredictionScore(points ?? 0)}`}>
              {match.prediction.home_score} - {match.prediction.away_score}
            </span>
            <span className="min-w-0 truncate" title={teamName(match.away_team, language)}>{awayShort}</span>
          </div>
        </div>
      ) : (
        <div className="mt-5 rounded-lg p-2 text-center text-xs bg-muted/40">
          <span className="text-muted-foreground">{t('past.noPrediction')}</span>
        </div>
      )}

      <div className="mt-3 text-center text-[11px] text-muted-foreground">
        📍 {stadium}
      </div>
    </Card>
  );
}
