import { SideBarProfile } from '@/components/SideBarProfile';
import { MatchHistoryTab } from '@/components/tabs/MatchHistoryTab';
import { RankingTab } from '@/components/tabs/RankingTab';
import { UpcomingMatchesTab } from '@/components/tabs/UpcomingMatchesTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getMatches } from '@/services/matches';
import { getTornamentsRanking } from '@/services/tournamentService';
import { useEffect, useState } from 'react';

export default function Dashboard() {
  const [matches, setMatches] = useState([]);
  const [pastMatches, setPastMatches] = useState([]);
  const [ranking, setRanking] = useState([]);

  useEffect(() => {
    getMatches('upcoming').then(setMatches);
    getMatches('past').then(setPastMatches);
    getTornamentsRanking(1).then(setRanking);
  }, []);

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <header className="mb-8 flex items-center justify-between border-b pb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            🏆 Penca Mundial 2026
          </h1>

          <p className="hidden text-sm text-muted-foreground sm:block">
            Pronostica los partidos, suma puntos y domina la tabla.
          </p>
        </div>

        <SideBarProfile />
      </header>

      <Tabs defaultValue="partidos">
        <TabsList className="grid w-full max-w-[500px] grid-cols-3">
          <TabsTrigger value="partidos">Próximos</TabsTrigger>

          <TabsTrigger value="historial">Mis Resultados</TabsTrigger>

          <TabsTrigger value="ranking">Ranking</TabsTrigger>
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
  );
}
