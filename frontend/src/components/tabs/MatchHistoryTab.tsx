import { PastMatchCard } from '@/components/PastMatchCard';
import { Card } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';

type Props = {
  matches: any[];
};

export function MatchHistoryTab({ matches }: Props) {
  const { t } = useLanguage();

  if (!matches || matches.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        {t('history.empty')}
      </Card>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {matches.map((match) => (
        <PastMatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}
