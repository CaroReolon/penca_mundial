import { useState } from 'react';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

import type { Match } from '@/types/match';
import { predictionService } from '@/services/predictionService';

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

  const formattedDate = new Date(match.kickoff_at).toLocaleString('es-UY', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <Card className="flex flex-col justify-between overflow-hidden p-5 transition-all hover:shadow-md">
      <div>
        <div className="mb-6 flex items-center justify-between border-b pb-2 text-xs font-medium text-muted-foreground">
          <span className="rounded-md bg-muted px-2 py-0.5">
            Grupo {match.group}
          </span>

          <span className="capitalize">{formattedDate}</span>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          {/* Equipo local */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="select-none text-4xl transition-transform hover:scale-110">
              {match.home_team.flag}
            </div>

            <div className="max-w-[100px] truncate text-sm font-semibold tracking-tight sm:max-w-none">
              {match.home_team.name}
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

          {/* Marcador */}
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

          {/* Equipo visitante */}
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="select-none text-4xl transition-transform hover:scale-110">
              {match.away_team.flag}
            </div>

            <div className="max-w-[100px] truncate text-sm font-semibold tracking-tight sm:max-w-none">
              {match.away_team.name}
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

          <span className="max-w-[200px] truncate">{match.stadium}</span>
        </div>
      </div>

      {prediction && !hasChanges && (
        <div className="mt-4 text-center text-sm font-medium text-green-600">
          ✓ Predicción guardada
        </div>
      )}

      <Button
        className="mt-5 w-full font-medium shadow-sm"
        onClick={handleSave}
        disabled={saving || !canSave}
      >
        {saving
          ? 'Guardando...'
          : prediction
          ? 'Actualizar predicción'
          : 'Guardar predicción'}
      </Button>
    </Card>
  );
}
