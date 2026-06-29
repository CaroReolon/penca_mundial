import { useEffect, useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { getMatchGroupPredictions } from '@/services/matchService';
import { getMyGroups, type PlayGroup } from '@/services/playGroupService';
import { teamShortName } from '@/lib/localize';

type Member = {
  id: number;
  name: string;
  avatar_url: string | null;
  prediction: {
    home_score: number;
    away_score: number;
    points_awarded: number;
    penalty_winner_team_id?: number | null;
  } | null;
};

type MatchData = {
  id: number;
  home_team: any;
  away_team: any;
  home_score: number | null;
  away_score: number | null;
  completed: boolean;
  stage?: string;
  went_to_penalties?: boolean;
  penalty_winner_team_id?: number | null;
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

  const isKnockout = match?.stage !== 'group_stage';
  const wentToPenalties = match?.went_to_penalties ?? false;
  const matchPenWinner = match?.penalty_winner_team_id ?? null;
  const homeShort = match ? teamShortName(match.home_team, language) : '';
  const awayShort = match ? teamShortName(match.away_team, language) : '';

  return (
    <div className="space-y-3">

      {/* Penalty result — under match score, only when completed knockout */}
      {match?.completed && isKnockout && (
        <div className={`flex items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs ${
          wentToPenalties && matchPenWinner
            ? 'border-amber-200 bg-amber-50 text-amber-800'
            : 'border-gray-100 bg-gray-50 text-gray-400'
        }`}>
          <span>🥅</span>
          {wentToPenalties && matchPenWinner ? (
            <span>
              <span className="font-semibold">
                {matchPenWinner === match.home_team.id ? match.home_team.flag : match.away_team.flag}
                {' '}
                {matchPenWinner === match.home_team.id ? homeShort : awayShort}
              </span>
              {' '}{language === 'es' ? 'ganó en penales' : 'won on penalties'}
            </span>
          ) : (
            <span className="italic">{language === 'es' ? 'No hubo penales' : 'No penalty shootout'}</span>
          )}
        </div>
      )}

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
            const userPenWinner = member.prediction?.penalty_winner_team_id ?? null;
            const penCorrect = wentToPenalties && matchPenWinner != null && userPenWinner === matchPenWinner;

            // Penalty badge — shown when knockout and prediction exists
            const penBadge = isKnockout && member.prediction ? (() => {
              if (userPenWinner == null) return null;
              const team = userPenWinner === match?.home_team?.id ? match?.home_team : match?.away_team;
              const correct = match?.completed && wentToPenalties && penCorrect;
              const wrong = match?.completed && wentToPenalties && !penCorrect && matchPenWinner != null;
              return (
                <span className={`inline-flex items-center gap-0.5 rounded border px-1.5 py-0.5 text-[10px] font-semibold shrink-0 ${
                  correct ? 'border-green-300 bg-green-50 text-green-800' :
                  wrong   ? 'border-red-200 bg-red-50 text-red-700' :
                            'border-gray-200 bg-gray-100 text-gray-400'
                }`}>
                  🥅 {team?.flag} {team ? teamShortName(team, language) : '?'}
                </span>
              );
            })() : null;

            return (
              <div key={member.id} className="px-3 py-2.5 bg-white">
                <div className="flex items-center gap-2">
                  <Avatar className="h-7 w-7 shrink-0">
                    {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.name} />}
                    <AvatarFallback className="text-[10px]">{getInitials(member.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs truncate">{member.name}</p>
                  </div>
                  {penBadge}
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
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
