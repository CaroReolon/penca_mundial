import { MatchCard } from '@/components/MatchCard';
import type { Match } from '@/types/match';

type Props = {
  matches: Match[];
};

export function UpcomingMatchesTab({ matches }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
