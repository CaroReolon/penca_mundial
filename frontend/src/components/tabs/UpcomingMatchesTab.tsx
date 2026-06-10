import { useState } from 'react';
import { MatchCard } from '@/components/MatchCard';
import { MatchFilterBar } from '@/components/MatchFilterBar';
import type { Match, MatchStage } from '@/types/match';
import type { StageFilter, GroupFilter } from '@/components/MatchFilterBar';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  matches: Match[];
};

export function UpcomingMatchesTab({ matches }: Props) {
  const { t } = useLanguage();
  const [onlyMissing, setOnlyMissing] = useState(false);
  const [selectedStage, setSelectedStage] = useState<StageFilter>('all');
  const [selectedGroup, setSelectedGroup] = useState<GroupFilter>('all');

  // Derive available filter options from the data
  const availableStages = Array.from(
    new Set(matches.map((m) => m.stage))
  ) as MatchStage[];

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
  if (onlyMissing) {
    displayed = displayed.filter((m) => m.prediction === null);
  }

  const missingCount = matches.filter((m) => m.prediction === null).length;

  return (
    <div>
      {/* Stage + group filter bar */}
      <MatchFilterBar
        availableStages={availableStages}
        availableGroups={availableGroups}
        selectedStage={selectedStage}
        selectedGroup={selectedGroup}
        onStageChange={setSelectedStage}
        onGroupChange={setSelectedGroup}
      />

      {/* Missing-prediction toggle */}
      <div className="mb-4 flex items-center gap-3">
        <button
          onClick={() => setOnlyMissing((v) => !v)}
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold transition-colors ${
            onlyMissing
              ? 'border-red-300 bg-red-50 text-red-700'
              : 'border-gray-200 bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700'
          }`}
        >
          <span className={`inline-flex h-4 w-4 items-center justify-center rounded-full text-[10px] font-bold ${
            onlyMissing ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-600'
          }`}>
            {missingCount}
          </span>
          {t('upcoming.filterMissing')}
        </button>
      </div>

      {displayed.length === 0 ? (
        <div className="rounded-lg border border-dashed p-10 text-center text-sm text-muted-foreground">
          {onlyMissing && selectedStage === 'all' && selectedGroup === 'all'
            ? t('upcoming.filterEmpty')
            : t('filter.noMatches')}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {displayed.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      )}
    </div>
  );
}
