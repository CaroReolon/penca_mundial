import { useLanguage } from '@/contexts/LanguageContext';
import type { MatchStage } from '@/types/match';

export type StageFilter = MatchStage | 'all';
export type GroupFilter = string | 'all';

// Canonical order for stages
const STAGE_ORDER: MatchStage[] = [
  'group_stage',
  'round_of_32',
  'round_of_16',
  'quarter_final',
  'semi_final',
  'third_place',
  'final',
];

type Props = {
  availableStages: MatchStage[];
  availableGroups: string[];
  selectedStage: StageFilter;
  selectedGroup: GroupFilter;
  onStageChange: (s: StageFilter) => void;
  onGroupChange: (g: GroupFilter) => void;
};

export function MatchFilterBar({
  availableStages,
  availableGroups,
  selectedStage,
  selectedGroup,
  onStageChange,
  onGroupChange,
}: Props) {
  const { t } = useLanguage();

  const showGroupFilter =
    availableGroups.length > 0 &&
    (selectedStage === 'all' || selectedStage === 'group_stage');

  const orderedStages = STAGE_ORDER.filter((s) => availableStages.includes(s));

  return (
    <div className="mb-4 flex flex-wrap gap-2">
      {/* Stage select */}
      <div className="relative">
        <select
          value={selectedStage}
          onChange={(e) => {
            onStageChange(e.target.value as StageFilter);
            onGroupChange('all');
          }}
          className={`h-8 appearance-none rounded-md border pl-3 pr-7 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors ${
            selectedStage !== 'all'
              ? 'border-gray-400 bg-gray-800 text-white'
              : 'border-gray-200 bg-white text-gray-600'
          }`}
        >
          <option value="all">{t('filter.allStages')}</option>
          {orderedStages.map((stage) => (
            <option key={stage} value={stage}>
              {t(`match.stage.${stage}` as any)}
            </option>
          ))}
        </select>
        {/* chevron */}
        <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] ${
          selectedStage !== 'all' ? 'text-gray-300' : 'text-gray-400'
        }`}>▼</span>
      </div>

      {/* Group select — only visible when group stage is in scope */}
      {showGroupFilter && (
        <div className="relative">
          <select
            value={selectedGroup}
            onChange={(e) => onGroupChange(e.target.value as GroupFilter)}
            className={`h-8 appearance-none rounded-md border pl-3 pr-7 text-xs font-semibold shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-300 transition-colors ${
              selectedGroup !== 'all'
                ? 'border-gray-400 bg-gray-800 text-white'
                : 'border-gray-200 bg-white text-gray-600'
            }`}
          >
            <option value="all">{t('filter.allGroups')}</option>
            {availableGroups.map((g) => (
              <option key={g} value={g}>
                {t('filter.group')} {g}
              </option>
            ))}
          </select>
          <span className={`pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[10px] ${
            selectedGroup !== 'all' ? 'text-gray-300' : 'text-gray-400'
          }`}>▼</span>
        </div>
      )}
    </div>
  );
}
