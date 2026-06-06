import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge'; // Si no tienes Badge, puedes usar un div con estilos de Tailwind

type PastMatch = {
  id: string;
  group: string;
  kickoff_at: string;
  stadium: string;
  home_team: { name: string; flag: string };
  away_team: { name: string; flag: string };
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
};

export function PastMatchCard({ match }: Props) {
  // Color del badge según el puntaje obtenido
  const getBadgeColor = (points: number) => {
    if (points >= 3)
      return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-300';
    if (points > 0)
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-300';
    return 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="relative overflow-hidden p-6 border-t-4 border-t-muted-foreground/20">
      {/* BADGE DE PUNTOS OBTENIDOS */}
      <div className="absolute right-3 top-3">
        <span
          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-tight transition-colors ${getBadgeColor(
            match.prediction.points_awarded
          )}`}
        >
          +{match.prediction.points_awarded}{' '}
          {match.prediction.points_awarded === 1 ? 'punto' : 'puntos'}
        </span>
      </div>

      <div className="mb-2 text-center text-sm text-muted-foreground">
        Grupo {match.group} • Finalizado
      </div>

      <div className="mb-4 text-center text-xs text-muted-foreground">
        {new Date(match.kickoff_at).toLocaleString('es-UY')}
      </div>

      {/* DISEÑO SIMÉTRICO DE EQUIPOS Y MARCADOR REAL */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
        <div className="text-center">
          <div className="text-4xl">{match.home_team.flag}</div>
          <div className="font-medium text-sm sm:text-base">
            {match.home_team.name}
          </div>
        </div>

        {/* RESULTADO REAL (GRANDE Y EN NEGRITA) */}
        <div className="flex items-center gap-4 px-2">
          <span className="text-3xl font-black">{match.home_score}</span>
          <span className="text-muted-foreground font-bold text-sm">FT</span>
          <span className="text-3xl font-black">{match.away_score}</span>
        </div>

        <div className="text-center">
          <div className="text-4xl">{match.away_team.flag}</div>
          <div className="font-medium text-sm sm:text-base">
            {match.away_team.name}
          </div>
        </div>
      </div>

      {/* PRONÓSTICO DEL USUARIO (ZONA INFERIOR DE LA TARJETA) */}
      <div className="mt-5 rounded-lg bg-muted/40 p-2 text-center text-xs">
        <span className="text-muted-foreground block mb-1">Tu pronóstico</span>
        <div className="flex justify-center items-center gap-2 font-semibold text-sm">
          <span>{match.home_team.name}</span>
          <span className="bg-background px-2 py-0.5 rounded border text-foreground">
            {match.prediction.home_score} - {match.prediction.away_score}
          </span>
          <span>{match.away_team.name}</span>
        </div>
      </div>

      <div className="mt-3 text-center text-[11px] text-muted-foreground">
        📍 {match.stadium}
      </div>
    </Card>
  );
}
