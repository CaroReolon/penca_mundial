import { useState, useEffect } from 'react';
import { PastMatchCard } from '@/components/PastMatchCard';
import { MatchFilterBar } from '@/components/MatchFilterBar';
import { Card } from '@/components/ui/card';
import { GroupPredictionsList } from '@/components/GroupPredictionsList';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MatchStage } from '@/types/match';
import type { StageFilter, GroupFilter } from '@/components/MatchFilterBar';

type Props = { matches: any[] };

const SCORING_ROWS = [
  { pts: 'history.scoring.exact.pts',  label: 'history.scoring.exact.label',  desc: 'history.scoring.exact.desc',  color: 'bg-green-100 text-green-800 border-green-300' },
  { pts: 'history.scoring.diff.pts',   label: 'history.scoring.diff.label',   desc: 'history.scoring.diff.desc',   color: 'bg-blue-100 text-blue-800 border-blue-300' },
  { pts: 'history.scoring.winner.pts', label: 'history.scoring.winner.label', desc: 'history.scoring.winner.desc', color: 'bg-yellow-100 text-yellow-800 border-yellow-300' },
  { pts: 'history.scoring.zero.pts',   label: 'history.scoring.zero.label',   desc: 'history.scoring.zero.desc',   color: 'bg-gray-100 text-gray-500 border-gray-200' },
] as const;

function ScoringGuide() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-5">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors group"
      >
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-xs font-bold group-hover:border-gray-500 transition-colors">?</span>
        <span className="font-medium">{t('history.scoring.title')}</span>
        <span className="text-gray-300 text-xs">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SCORING_ROWS.map((row) => (
            <div key={row.pts} className="flex items-start gap-3 rounded-xl border bg-white p-3 shadow-sm">
              <span className={`mt-0.5 shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-tight ${row.color}`}>
                {t(row.pts)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-snug">{t(row.label)}</p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">{t(row.desc)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MatchHistoryTab({ matches }: Props) {
  const { t, language } = useLanguage();
  const [selectedStage, setSelectedStage] = useState<StageFilter>('all');
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>('all');
  const [expandedMatchId, setExpandedMatchId] = useState<string | null>(null);
  const [modalMatchId, setModalMatchId] = useState<string | null>(null);

  const handleCardClick = (matchId: string) => {
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      setExpandedMatchId((prev) => (prev === matchId ? null : matchId));
    } else {
      setModalMatchId(matchId);
    }
  };

  if (!matches || matches.length === 0) {
    return (
      <>
        <ScoringGuide />
        <Card className="p-8 text-center text-muted-foreground">{t('history.empty')}</Card>
      </>
    );
  }

  const availableStages = Array.from(new Set(matches.map((m) => m.stage as MatchStage)));
  const availableGroups = Array.from(
    new Set(matches.filter((m) => m.stage === 'group_stage' && m.group).map((m) => m.group as string))
  ).sort();

  let displayed = matches;
  if (selectedStage !== 'all') displayed = displayed.filter((m) => m.stage === selectedStage);
  if (selectedGroup !== 'all') displayed = displayed.filter((m) => m.group === selectedGroup);

  return (
    <div>
      <ScoringGuide />

      <MatchFilterBar
        availableStages={availableStages}
        availableGroups={availableGroups}
        selectedStage={selectedStage}
        selectedGroup={selectedGroup}
        onStageChange={setSelectedStage}
        onGroupChange={setSelectedGroup}
      />

      {displayed.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          {t('filter.noMatches')}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((match) => (
            <>
              <div
                key={match.id}
                onClick={() => handleCardClick(String(match.id))}
                className="cursor-pointer"
              >
                <PastMatchCard match={match} />
              </div>

              {/* Mobile accordion — only visible on small screens, spans full width */}
              {expandedMatchId === String(match.id) && (
                <div key={`accordion-${match.id}`} className="col-span-full md:hidden -mt-2 mb-2 rounded-xl border bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold text-muted-foreground uppercase mb-3">
                    {language === 'es' ? 'Predicciones del grupo' : 'Group predictions'}
                  </p>
                  <GroupPredictionsList matchId={match.id} />
                </div>
              )}
            </>
          ))}
        </div>
      )}

      {/* Desktop modal */}
      {modalMatchId && (() => {
        const m = matches.find((x) => String(x.id) === modalMatchId);
        return (
          <div
            className="fixed inset-0 z-50 hidden md:flex items-start justify-center bg-black/40 p-6 pt-16 overflow-y-auto"
            onClick={(e) => { if (e.target === e.currentTarget) setModalMatchId(null); }}
          >
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 space-y-4">
              {/* Header */}
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg">
                  {language === 'es' ? 'Predicciones del grupo' : 'Group predictions'}
                </h3>
                <button
                  onClick={() => setModalMatchId(null)}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  ✕
                </button>
              </div>

              {/* Match result */}
              {m && (
                <div className="rounded-xl border bg-muted/30 px-4 py-3">
                  <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-3xl">{m.home_team.flag}</span>
                      <span className="text-xs font-medium text-center">{m.home_team.short_name_en ?? m.home_team.short_name}</span>
                    </div>
                    <div className="text-center">
                      {m.completed ? (
                        <>
                          <span className="text-2xl font-black tabular-nums">{m.home_score} - {m.away_score}</span>
                          <p className="text-[10px] text-muted-foreground mt-0.5">FT</p>
                        </>
                      ) : (
                        <span className="text-base font-bold text-muted-foreground">vs</span>
                      )}
                    </div>
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-3xl">{m.away_team.flag}</span>
                      <span className="text-xs font-medium text-center">{m.away_team.short_name_en ?? m.away_team.short_name}</span>
                    </div>
                  </div>
                </div>
              )}

              <GroupPredictionsList matchId={modalMatchId} />
            </div>
          </div>
        );
      })()}
    </div>
  );
}
