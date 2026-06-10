import { useState } from 'react';
import { PastMatchCard } from '@/components/PastMatchCard';
import { MatchFilterBar } from '@/components/MatchFilterBar';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import type { MatchStage } from '@/types/match';
import type { StageFilter, GroupFilter } from '@/components/MatchFilterBar';

type Props = {
  matches: any[];
};

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
        <span className="inline-flex items-center justify-center w-5 h-5 rounded-full border border-gray-300 text-xs font-bold group-hover:border-gray-500 transition-colors">
          ?
        </span>
        <span className="font-medium">{t('history.scoring.title')}</span>
        <span className="text-gray-300 text-xs">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {SCORING_ROWS.map((row) => (
            <div
              key={row.pts}
              className="flex items-start gap-3 rounded-xl border bg-white p-3 shadow-sm"
            >
              <span className={`mt-0.5 shrink-0 inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-bold tracking-tight ${row.color}`}>
                {t(row.pts)}
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-800 leading-snug">
                  {t(row.label)}
                </p>
                <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                  {t(row.desc)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function MatchHistoryTab({ matches }: Props) {
  const { t } = useLanguage();
  const [selectedStage, setSelectedStage] = useState<StageFilter>('all');
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>('all');

  if (!matches || matches.length === 0) {
    return (
      <>
        <ScoringGuide />
        <Card className="p-8 text-center text-muted-foreground">
          {t('history.empty')}
        </Card>
      </>
    );
  }

  // Derive available filter options from the data
  const availableStages = Array.from(
    new Set(matches.map((m) => m.stage as MatchStage))
  );

  const availableGroups = Array.from(
    new Set(
      matches
        .filter((m) => m.stage === 'group_stage' && m.group)
        .map((m) => m.group as string)
    )
  ).sort();

  // Apply filters
  let displayed = matches;

  if (selectedStage !== 'all') {
    displayed = displayed.filter((m) => m.stage === selectedStage);
  }
  if (selectedGroup !== 'all') {
    displayed = displayed.filter((m) => m.group === selectedGroup);
  }

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
            <PastMatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
