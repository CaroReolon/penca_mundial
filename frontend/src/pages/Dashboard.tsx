import { useState, useEffect } from 'react';
import { SideBarProfile } from '@/components/SideBarProfile';
import { MatchHistoryTab } from '@/components/tabs/MatchHistoryTab';
import { RankingTab } from '@/components/tabs/RankingTab';
import { UpcomingMatchesTab } from '@/components/tabs/UpcomingMatchesTab';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMatches } from '@/services/matches';
import { getTornamentsRanking } from '@/services/tournamentService';
import { useLanguage } from '@/contexts/LanguageContext';

export default function Dashboard() {
  const [matches, setMatches] = useState<any[]>([]);
  const [pastMatches, setPastMatches] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState('partidos');
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

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full max-w-[500px] grid-cols-3">
            <TabsTrigger value="partidos">{t('dashboard.tab.upcoming')}</TabsTrigger>
            <TabsTrigger value="historial">{t('dashboard.tab.results')}</TabsTrigger>
            <TabsTrigger value="ranking">{t('dashboard.tab.ranking')}</TabsTrigger>
          </TabsList>

          {/* Tabs are always mounted — hidden with CSS so state is never lost */}
          <div className={activeTab !== 'partidos' ? 'hidden' : 'mt-2'}>
            <UpcomingMatchesTab matches={matches} />
          </div>
          <div className={activeTab !== 'historial' ? 'hidden' : 'mt-2'}>
            <MatchHistoryTab matches={pastMatches} />
          </div>
          <div className={activeTab !== 'ranking' ? 'hidden' : 'mt-2'}>
            <RankingTab ranking={ranking} />
          </div>
        </Tabs>
      </div>
    </div>
  );
}
