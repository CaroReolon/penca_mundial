import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
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
  stage: string;
  group: string | null;
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

export default function MatchGroupPredictions() {
  const { matchId } = useParams<{ matchId: string }>();
  const navigate = useNavigate();
  const { language, t } = useLanguage();

  const [groups, setGroups] = useState<PlayGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [match, setMatch] = useState<MatchData | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [loadingPredictions, setLoadingPredictions] = useState(false);
  const [error, setError] = useState(false);

  // Load groups on mount
  useEffect(() => {
    getMyGroups()
      .then((gs) => {
        setGroups(gs);
        if (gs.length > 0) setSelectedGroupId(gs[0].id);
      })
      .catch(() => setError(true))
      .finally(() => setLoadingGroups(false));
  }, []);

  // Load predictions whenever group or match changes
  useEffect(() => {
    if (!matchId || !selectedGroupId) return;
    setLoadingPredictions(true);
    setError(false);
    getMatchGroupPredictions(matchId, selectedGroupId)
      .then((data) => { setMatch(data.match); setMembers(data.members); })
      .catch(() => setError(true))
      .finally(() => setLoadingPredictions(false));
  }, [matchId, selectedGroupId]);

  if (loadingGroups) {
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground animate-pulse">
        {language === 'es' ? 'Cargando...' : 'Loading...'}
      </div>
    );
  }

  const homeShort = match ? teamShortName(match.home_team, language) : '';
  const awayShort = match ? teamShortName(match.away_team, language) : '';

  return (
    <div className="min-h-screen mx-auto max-w-2xl md:max-w-4xl px-4 py-6">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="text-muted-foreground mb-4"
      >
        ← {t('profile.back')}
      </Button>

      {/* Match header */}
      {match && (
        <Card className="p-5 mb-6">
          <p className="text-center text-xs text-muted-foreground mb-3">
            {match.stage === 'group_stage'
              ? `${language === 'es' ? 'Grupo' : 'Group'} ${match.group}`
              : match.stage.replace(/_/g, ' ')}
          </p>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{match.home_team.flag}</span>
              <span className="text-sm font-medium text-center">{homeShort}</span>
            </div>
            <div className="text-center">
              {match.completed ? (
                <span className="text-3xl font-black tabular-nums">
                  {match.home_score} - {match.away_score}
                </span>
              ) : (
                <span className="text-lg font-bold text-muted-foreground">vs</span>
              )}
              {match.completed && (
                <p className="text-xs text-muted-foreground mt-1">
                  FT{match.went_to_penalties ? ' · PEN' : ''}
                </p>
              )}
              {match.went_to_penalties && match.penalty_winner_team_id && (
                <p className="text-xs font-medium text-amber-700 mt-1">
                  🥅 {match.penalty_winner_team_id === match.home_team.id ? homeShort : awayShort}{' '}
                  {language === 'es' ? 'ganó penales' : 'won on pens'}
                </p>
              )}
            </div>
            <div className="flex flex-col items-center gap-1">
              <span className="text-4xl">{match.away_team.flag}</span>
              <span className="text-sm font-medium text-center">{awayShort}</span>
            </div>
          </div>
        </Card>
      )}

      {/* Group tabs */}
      {groups.length > 1 && (
        <div className="flex gap-2 flex-wrap mb-4">
          {groups.map((g) => (
            <button
              key={g.id}
              onClick={() => setSelectedGroupId(g.id)}
              className={`px-4 py-1.5 rounded-full text-sm font-medium border transition-colors ${
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

      {/* Members predictions */}
      <h2 className="text-sm font-semibold text-muted-foreground uppercase mb-3">
        {language === 'es' ? 'Predicciones del grupo' : 'Group predictions'}
      </h2>

      {loadingPredictions ? (
        <Card>
          <div className="divide-y">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-14 animate-pulse bg-muted/40" />
            ))}
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center text-muted-foreground">
          {language === 'es' ? 'No se pudo cargar.' : 'Could not load.'}
        </Card>
      ) : (
        <Card>
          <div className="divide-y">
            {members
              .slice()
              .sort((a, b) => (b.prediction?.points_awarded ?? -1) - (a.prediction?.points_awarded ?? -1))
              .map((member) => {
                const pts = member.prediction?.points_awarded ?? null;
                const isKnockout = match?.stage !== 'group_stage';
                const wentToPenalties = match?.went_to_penalties ?? false;
                const matchPenWinner = match?.penalty_winner_team_id ?? null;
                const userPenWinner = member.prediction?.penalty_winner_team_id ?? null;
                const penCorrect = wentToPenalties && matchPenWinner != null && userPenWinner === matchPenWinner;

                return (
                  <div key={member.id} className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {/* Avatar */}
                      <Avatar className="h-8 w-8 shrink-0">
                        {member.avatar_url && <AvatarImage src={member.avatar_url} alt={member.name} />}
                        <AvatarFallback className="text-xs">{getInitials(member.name)}</AvatarFallback>
                      </Avatar>

                      {/* Name */}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-sm truncate">{member.name}</p>
                      </div>

                      {/* Prediction score */}
                      {member.prediction ? (
                        <div className="flex items-center gap-1.5 shrink-0 text-sm font-bold tabular-nums">
                          <span>{member.prediction.home_score}</span>
                          <span className="text-muted-foreground font-normal">-</span>
                          <span>{member.prediction.away_score}</span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic shrink-0">
                          {language === 'es' ? 'Sin pred.' : 'No pred.'}
                        </span>
                      )}

                      {/* Points */}
                      {match?.completed && pts !== null ? (
                        <span className={`shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${pointsBadge(pts)}`}>
                          +{pts} pts
                        </span>
                      ) : (
                        <span className="shrink-0 text-xs text-muted-foreground">—</span>
                      )}
                    </div>

                    {/* Penalty row — only for knockout matches that started/ended */}
                    {isKnockout && member.prediction && (
                      <div className="ml-11 mt-1.5 flex items-center gap-2">
                        <span className="text-[10px] text-muted-foreground">
                          🥅 {language === 'es' ? 'Penales:' : 'Pens:'}
                        </span>
                        {userPenWinner != null ? (() => {
                          const team = userPenWinner === match?.home_team?.id ? match?.home_team : match?.away_team;
                          const correct = wentToPenalties && penCorrect;
                          const wrong = wentToPenalties && !penCorrect && matchPenWinner != null;
                          return (
                            <span className={`inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[10px] font-semibold ${
                              correct ? 'border-green-300 bg-green-50 text-green-800' :
                              wrong   ? 'border-red-200 bg-red-50 text-red-700' :
                                        'border-gray-200 bg-gray-50 text-gray-500'
                            }`}>
                              {team?.flag} {team ? teamShortName(team, language) : '?'}
                              {correct && <span className="ml-1 text-green-700">+2</span>}
                            </span>
                          );
                        })() : (
                          <span className="text-[10px] text-muted-foreground italic">
                            {language === 'es' ? 'sin elección' : 'no pick'}
                          </span>
                        )}
                        {wentToPenalties && matchPenWinner != null && (
                          <>
                            <span className="text-[10px] text-gray-300">→</span>
                            <span className="text-[10px] text-gray-500">
                              {(() => {
                                const winner = matchPenWinner === match?.home_team?.id ? match?.home_team : match?.away_team;
                                return `${winner?.flag} ${winner ? teamShortName(winner, language) : '?'}`;
                              })()}
                            </span>
                          </>
                        )}
                        {!wentToPenalties && (
                          <span className="text-[10px] text-muted-foreground italic">
                            ({language === 'es' ? 'no hubo penales' : 'no pens needed'})
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
          </div>
        </Card>
      )}
    </div>
  );
}
