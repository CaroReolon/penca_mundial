import { SideBarProfile } from '@/components/SideBarProfile';
import { MatchHistoryTab } from '@/components/tabs/MatchHistoryTab';
import { RankingTab } from '@/components/tabs/RankingTab';
import { UpcomingMatchesTab } from '@/components/tabs/UpcomingMatchesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMatches } from '@/services/matches';
import { getTornamentsRanking } from '@/services/tournamentService';
import { useEffect, useState } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [ranking, setRanking] = useState([]);
  const { t } = useLanguage();

  useEffect(() => {
    getMatches('upcoming').then(setMatches);
    getMatches('past').then((data) =>
      setPastMatches(data.filter((m: any) => m.prediction !== null))
    );
    getTornamentsRanking(1).then(setRanking);
  }, []);

  return (
    <div className="min-h-screen">
      <div className="min-h-screen mx-auto max-w-7xl bg-white px-6 py-6">
      <header className="mb-8 flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-black">
            {t('dashboard.title')}
          </h1>

          <p className="hidden text-sm text-muted-foreground sm:block">
            {t('dashboard.subtitle')}
          </p>
        </div>

        <SideBarProfile />
      </header>

      <Tabs defaultValue="partidos">
        <TabsList className="grid w-full max-w-[500px] grid-cols-3">
          <TabsTrigger value="partidos">{t('dashboard.tab.upcoming')}</TabsTrigger>

          <TabsTrigger value="historial">{t('dashboard.tab.results')}</TabsTrigger>

          <TabsTrigger value="ranking">{t('dashboard.tab.ranking')}</TabsTrigger>
        </TabsList>

        <TabsContent value="partidos">
          <UpcomingMatchesTab matches={matches} />
        </TabsContent>

        <TabsContent value="historial">
          <MatchHistoryTab matches={pastMatches} />
        </TabsContent>

        <TabsContent value="ranking">
          <RankingTab ranking={ranking} />
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}
