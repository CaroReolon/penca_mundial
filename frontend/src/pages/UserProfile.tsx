import { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { PastMatchCard } from '@/components/PastMatchCard';
import { getUserMatches } from '@/services/userService';
import { useLanguage } from '@/contexts/LanguageContext';

type LocationState = {
  name?: string;
  points?: number;
  position?: number;
  avatar_url?: string | null;
};

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
  } | null;
};

export default function UserProfile() {
  const { userId } = useParams<{ userId: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const state = location.state as LocationState | null;
  const userName = state?.name ?? `Usuario #${userId}`;
  const userPoints = state?.points;
  const userPosition = state?.position;
  const userAvatarUrl = state?.avatar_url ?? null;

  const [matches, setMatches] = useState<PastMatch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [forbidden, setForbidden] = useState(false);

  useEffect(() => {
    if (!userId) return;

    setIsLoading(true);
    setForbidden(false);
    getUserMatches(Number(userId))
      .then((data: PastMatch[]) => {
        setMatches(data.filter((m) => m.prediction !== null));
      })
      .catch((err: any) => {
        if (err?.response?.status === 403) setForbidden(true);
      })
      .finally(() => setIsLoading(false));
  }, [userId]);

  const initials = userName
    .split(' ')
    .slice(0, 2)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase();

  const totalPoints = matches.reduce(
    (acc, m) => acc + (m.prediction?.points_awarded ?? 0),
    0
  );

  if (forbidden) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="bg-white rounded-2xl shadow-lg p-10 max-w-sm w-full text-center space-y-4">
          <div className="text-5xl">🔒</div>
          <h2 className="text-xl font-bold text-gray-900">Perfil privado</h2>
          <p className="text-sm text-gray-500">
            Solo podés ver el perfil de usuarios que están en alguno de tus grupos.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-2 w-full h-10 rounded-lg bg-green-600 hover:bg-green-700 text-white font-semibold text-sm transition-colors"
          >
            Volver al dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <div className="min-h-screen mx-auto max-w-7xl bg-white px-6 py-6">
      {/* HEADER */}
      <header className="mb-8 flex items-center justify-between border-b pb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/dashboard')}
            className="text-muted-foreground"
          >
            {t('profile.back')}
          </Button>

          <Avatar className="h-12 w-12 border-2 border-primary/20">
            {userAvatarUrl && <AvatarImage src={userAvatarUrl} alt={userName} />}
            <AvatarFallback className="text-base font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div>
            <h1 className="text-2xl font-bold tracking-tight">{userName}</h1>
            <p className="text-sm text-muted-foreground">
              {userPosition != null && `📍 ${t('profile.position')} ${userPosition} • `}
              {isLoading
                ? t('profile.loading')
                : `${userPoints ?? totalPoints} ${t('profile.totalPoints')} · ${matches.length} ${t('profile.predictions')}`}
            </p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="h-48 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : matches.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          😶 {userName} {t('profile.empty')}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {matches.map((match) => (
            <PastMatchCard
              key={match.id}
              match={match as any}
              predictionLabel={`${t('profile.predictionOf')} ${userName.split(' ')[0]}`}
            />
          ))}
        </div>
      )}
      </div>
    </div>
  );
}
