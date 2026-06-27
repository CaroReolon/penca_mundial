import { useState } from 'react';
import { MatchCard } from '@/components/MatchCard';
import { MatchFilterBar } from '@/components/MatchFilterBar';
import type { Match, MatchStage } from '@/types/match';
import type { StageFilter, GroupFilter } from '@/components/MatchFilterBar';
import { useLanguage } from '@/contexts/LanguageContext';

function KnockoutDisclaimer({ language }: { language: string }) {
  if (language === 'es') {
    return (
      <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-semibold mb-2">⚽ Nueva fase — ¿cómo se cuentan los puntos?</p>
        <ul className="space-y-1.5 text-xs leading-relaxed">
          <li>
            <span className="font-medium">El resultado que predices</span> es el marcador al final
            del tiempo reglamentario <span className="font-medium">incluyendo el alargue</span> (prórroga).
          </li>
          <li>
            Si el partido termina en empate y se va a penales, puedes ganar
            <span className="font-medium"> +2 puntos extra</span> si aciertas al equipo ganador en la tanda.
          </li>
          <li>
            Los puntos de penales son <span className="font-medium">completamente independientes</span> del
            resultado que predijiste. Por ejemplo: si predijiste 2–1 a favor del equipo A pero seleccionaste
            que el equipo B gana los penales, igual ganas los +2 si B gana la tanda.
          </li>
        </ul>
      </div>
    );
  }

  return (
    <div className="mb-5 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
      <p className="font-semibold mb-2">⚽ Knockout phase — how are points counted?</p>
      <ul className="space-y-1.5 text-xs leading-relaxed">
        <li>
          <span className="font-medium">The score you predict</span> is the result at the end
          of regular time <span className="font-medium">including extra time</span> (if played).
        </li>
        <li>
          If the match ends in a draw and goes to a penalty shootout, you can earn
          <span className="font-medium"> +2 extra points</span> by picking the correct winner.
        </li>
        <li>
          Penalty points are <span className="font-medium">completely independent</span> from
          your score prediction. For example: if you predicted a 2–1 win for team A but picked
          team B to win on penalties, you still earn the +2 if team B wins the shootout.
        </li>
      </ul>
    </div>
  );
}

type Props = {
  matches: Match[];
};

export function UpcomingMatchesTab({ matches }: Props) {
  const { t, language } = useLanguage();
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
  const hasKnockout = matches.some((m) => m.stage !== 'group_stage');

  return (
    <div>
      {hasKnockout && <KnockoutDisclaimer language={language} />}

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
