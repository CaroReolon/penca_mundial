import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMatchGroupPredictions } from '@/services/matchService';
import { getMyGroups, type PlayGroup } from '@/services/playGroupService';

type Member = {
  id: number;
  name: string;
  avatar_url: string | null;
  prediction: { home_score: number; away_score: number; points_awarded: number } | null;
};

type MatchData = {
  id: number;
  home_team: any;
  away_team: any;
  home_score: number | null;
  away_score: number | null;
  completed: boolean;
};

function getInitials(name: string) {
  const parts = name.trim().split(/\s+/);
  return parts.length >= 2
    ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
    : name.slice(0, 2).toUpperCase();
}

const pointsBadge = (pts: number) => {
  if (pts >= 5) return 'bg-green-100 text-green-800 border-green-300';
  if (pts >= 3) return 'bg-blue-100 text-blue-800 border-blue-300';
  if (pts >= 1) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

export function GroupPredictionsList({ matchId }: { matchId: string | number }) {
  const { language } = useLanguage();

  const [groups, setGroups] = useState<PlayGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [match, setMatch] = useState<MatchData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(false);

  useEffect(() => {
    getMyGroups()
      .then((gs) => {
        setGroups(gs);
        if (gs.length > 0) setSelectedGroupId(gs[0].id);
      })
      .finally(() => setLoadingGroups(false));
  }, []);

  useEffect(() => {
    if (!matchId || !selectedGroupId) return;
    setLoadingPredictions(true);
    getMatchGroupPredictions(matchId, selectedGroupId)
      .then((data) => { setMatch(data.match); setMembers(data.members); })
      .finally(() => setLoadingPredictions(false));
  }, [matchId, selectedGroupId]);


  const sorted = members
    .slice()
    .sort((a, b) => (b.prediction?.points_awarded ?? -1) - (a.prediction?.points_awarded ?? -1));

  if (loadingGroups) {

    return <div className="py-4 text-center text-sm text-muted-foreground animate-pulse">
      {language === 'es' ? 'Cargando...' : 'Loading...'}
    </div>;
  }

  return (
    <div className="space-y-3">
      {/* Group tabs */}
      {groups.length > 1 && (
        <div className="flex gap-2 flex-wrap">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                selectedGroupId === g.id
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-gray-600 border-gray-300 hover:border-primary'
              }`}
            >
              {g.name}
            </button>
          ))}
        </div>
      )}

      {/* List */}
      {loadingPredictions ? (
        <div className="divide-y rounded-lg border overflow-hidden">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-12 animate-pulse bg-muted/40" />
          ))}
        </div>
      ) : (
        <div className="divide-y rounded-lg border overflow-hidden">
          {sorted.map((member) => {
            const pts = member.prediction?.points_awarded ?? null;
            return (
              <div
                key={member.id}
                className="flex items-center gap-3 px-3 py-2.5 bg-white"
              >
                <Avatar className="h-7 w-7 shrink-0">
                  {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.name} />}
                  <AvatarFallback className="text-[10px]">{getInitials(member.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs truncate">{member.name}</p>
                </div>
                {member.prediction ? (
                  <span className="text-sm font-bold tabular-nums shrink-0">
                    {member.prediction.home_score} - {member.prediction.away_score}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground italic shrink-0">—</span>
                )}
                {match?.completed && pts !== null ? (
                  <span className={`shrink-0 inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${pointsBadge(pts)}`}>
                    +{pts}
                  </span>
                ) : (
                  <span className="w-8" />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
