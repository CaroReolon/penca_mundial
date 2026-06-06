import { PastMatchCard } from '@/components/PastMatchCard';

type Props = {
  matches: any[];
};

export function MatchHistoryTab({ matches }: Props) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <PastMatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
