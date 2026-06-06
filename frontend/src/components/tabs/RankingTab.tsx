import { useNavigate } from 'react-router-dom';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';

type Participant = {
  points: number;
  position: number;
  previous_position: number;
  user: {
    id: number;
    name: string;
    email: string;
    avatar_url: string | null;
  };
};

type Props = {
  ranking: Participant[];
};

export function RankingTab({ ranking }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const goToProfile = (item: Participant) => {
    navigate(`/users/${item.user.id}`, {
      state: {
        name: item.user.name,
        points: item.points,
        position: item.position,
        avatar_url: item.user.avatar_url,
      },
    });
  };

  if (!ranking || ranking.length === 0) {
    return (
      <Card className="p-8 text-center text-muted-foreground">
        {t('ranking.empty')}
      </Card>
    );
  }

  const topThree = ranking.slice(0, 3);

  const getTrendElement = (current: number, previous: number, isIconOnly = false) => {
    if (current < previous) {
      return (
        <span className="text-green-600 font-semibold">
          {isIconOnly ? t('ranking.risingIcon') : t('ranking.rising')}
        </span>
      );
    }
    if (current > previous) {
      return (
        <span className="text-destructive font-semibold">
          {isIconOnly ? t('ranking.fallingIcon') : t('ranking.falling')}
        </span>
      );
    }
    return (
      <span className="text-muted-foreground">
        {isIconOnly ? t('ranking.steadyIcon') : t('ranking.steady')}
      </span>
    );
  };

  const getGridCols = (count: number) => {
    if (count === 1) return 'grid-cols-1 max-w-md mx-auto';
    if (count === 2) return 'sm:grid-cols-2 max-w-2xl mx-auto';
    return 'sm:grid-cols-3';
  };

  return (
    <div className="space-y-6">
      {/* 1. PODIO DINÁMICO */}
      <div className={`grid gap-4 ${getGridCols(topThree.length)}`}>
        {topThree.map((item, index) => {
          const medals = ['🥇', '🥈', '🥉'];
          const userDetails = item.user;

          return (
            <Card
              key={userDetails.id}
              onClick={() => goToProfile(item)}
              className={`overflow-hidden transition-all cursor-pointer hover:shadow-md hover:border-primary/30 ${
                index === 0 ? 'border-primary bg-primary/5 shadow-sm' : ''
              }`}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  {medals[index] || '⭐'} {t('ranking.place')} {item.position}
                </CardTitle>
                <span className="text-2xl font-bold tabular-nums">
                  {item.points} {t('ranking.pts')}
                </span>
              </CardHeader>

              <CardContent className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={userDetails.avatar_url ?? undefined} />
                  <AvatarFallback>
                    {userDetails.name
                      ? userDetails.name.slice(0, 2).toUpperCase()
                      : '??'}
                  </AvatarFallback>
                </Avatar>

                <div className="overflow-hidden">
                  <p className="font-semibold text-sm truncate">
                    {userDetails.name}
                  </p>
                  <p className="text-xs">
                    {getTrendElement(item.position, item.previous_position)}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* 2. TABLA COMPLETA */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px] text-center">{t('ranking.pos')}</TableHead>
                <TableHead>{t('ranking.participant')}</TableHead>
                <TableHead className="text-right">{t('ranking.trend')}</TableHead>
                <TableHead className="text-right font-bold">{t('ranking.points')}</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {ranking.map((item) => {
                const userDetails = item.user;
                return (
                  <TableRow
                    key={userDetails.id}
                    onClick={() => goToProfile(item)}
                    className="transition-colors hover:bg-muted/50 cursor-pointer"
                  >
                    <TableCell className="text-center font-bold">
                      {item.position}
                    </TableCell>

                    <TableCell className="py-3">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={userDetails.avatar_url ?? undefined} />
                          <AvatarFallback>
                            {userDetails.name
                              ? userDetails.name.slice(0, 2).toUpperCase()
                              : '??'}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-medium text-sm">
                            {userDetails.name}
                          </span>
                          <span className="text-xs text-muted-foreground sm:hidden">
                            {userDetails.email}
                          </span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-right text-sm">
                      {getTrendElement(item.position, item.previous_position, true)}
                    </TableCell>

                    <TableCell className="text-right font-bold tabular-nums text-base">
                      {item.points} {t('ranking.pts')}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
