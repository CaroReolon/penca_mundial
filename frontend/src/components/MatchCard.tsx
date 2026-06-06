import { useState } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { Match } from '@/types/match';
import { predictionService } from '@/services/predictionService';
import { useLanguage } from '@/contexts/LanguageContext';
import { teamName, teamShortName, stadiumName, formatKickoff } from '@/lib/localize';

type Props = {
  match: Match;
};

export function MatchCard({ match }: Props) {
  const [saving, setSaving] = useState(false);
  const [prediction, setPrediction] = useState(match.prediction ?? null);
  const [homeScore, setHomeScore] = useState<number | null>(
    match.prediction?.home_score ?? null
  );
  const [awayScore, setAwayScore] = useState<number | null>(
    match.prediction?.away_score ?? null
  );

  const { language, t } = useLanguage();

  const hasChanges =
    homeScore !== prediction?.home_score ||
    awayScore !== prediction?.away_score;

  const canSave = homeScore !== null && awayScore !== null && hasChanges;

  const handleSave = async () => {
    if (!canSave) return;

    try {
      setSaving(true);

      let savedPrediction;

      if (prediction) {
        savedPrediction = await predictionService.update(
          prediction.id,
          homeScore,
          awayScore
        );
      } else {
        savedPrediction = await predictionService.create(
          match.id,
          homeScore,
          awayScore
        );
      }

      setPrediction(savedPrediction);
    } catch (error) {
      console.error('Error saving prediction', error);
    } finally {
      setSaving(false);
    }
  };

  const formattedDate = formatKickoff(match.kickoff_at, language);

  const homeShort = teamShortName(match.home_team, language);
  const awayShort = teamShortName(match.away_team, language);
  const stadium   = stadiumName(match, language);

  return (
    <Card className="flex flex-col justify-between overflow-hidden p-5 transition-all hover:shadow-md">
      <div>
        <div className="mb-6 flex items-center justify-between border-b pb-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-0.5">
            {t('match.group')} {match.group}
          </span>

          <span className="capitalize">{formattedDate}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Home team */}
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <div className="select-none text-4xl transition-transform hover:scale-110">
              {match.home_team.flag}
            </div>

            <div
              className="w-full text-center text-sm font-semibold leading-tight tracking-tight"
              title={teamName(match.home_team, language)}
            >
              {homeShort}
            </div>

            <div className="mt-1 flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-md"
                onClick={() =>
                  setHomeScore((current) =>
                    current === null ? null : Math.max(0, current - 1)
                  )
                }
              >
                -
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-md"
                onClick={() => setHomeScore((current) => (current ?? -1) + 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Score */}
          <div className="flex items-center justify-center gap-2 px-2">
            <span className="w-8 text-center text-3xl font-black tabular-nums tracking-tighter">
              {homeScore ?? '-'}
            </span>

            <span className="select-none text-lg font-bold text-muted-foreground/60">
              -
            </span>

            <span className="w-8 text-center text-3xl font-black tabular-nums tracking-tighter">
              {awayScore ?? '-'}
            </span>
          </div>

          {/* Away team */}
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <div className="select-none text-4xl transition-transform hover:scale-110">
              {match.away_team.flag}
            </div>

            <div
              className="w-full text-center text-sm font-semibold leading-tight tracking-tight"
              title={teamName(match.away_team, language)}
            >
              {awayShort}
            </div>

            <div className="mt-1 flex items-center gap-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-md"
                onClick={() =>
                  setAwayScore((current) =>
                    current === null ? null : Math.max(0, current - 1)
                  )
                }
              >
                -
              </Button>

              <Button
                type="button"
                variant="outline"
                size="icon"
                className="h-7 w-7 rounded-md"
                onClick={() => setAwayScore((current) => (current ?? -1) + 1)}
              >
                +
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center justify-center gap-1 text-[11px] text-muted-foreground/80">
          <span>📍</span>
          <span className="max-w-[200px] truncate">{stadium}</span>
        </div>
      </div>

      {prediction && !hasChanges && (
        <div className="mt-4 text-center text-sm font-medium text-green-600">
          {t('match.saved')}
        </div>
      )}

      <Button
        className="mt-5 w-full font-medium shadow-sm"
        onClick={handleSave}
        disabled={saving || !canSave}
      >
        {saving
          ? t('match.saving')
          : prediction
          ? t('match.update')
          : t('match.save')}
      </Button>
    </Card>
  );
}
