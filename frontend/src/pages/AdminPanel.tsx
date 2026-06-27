import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { SideBarProfile } from '@/components/SideBarProfile';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  adminGetMatches,
  adminGetTeams,
  adminCreateMatch,
  adminUpdateMatch,
  type AdminMatch,
  type AdminTeam,
} from '@/services/adminService';

const STAGE_LABELS: Record<string, string> = {
  group_stage: 'Fase de Grupos',
  round_of_32: 'Ronda de 32',
  round_of_16: 'Octavos de Final',
  quarter_final: 'Cuartos de Final',
  semi_final: 'Semifinal',
  third_place: 'Tercer Puesto',
  final: 'Final',
};

const KNOCKOUT_STAGES = [
  'round_of_32',
  'round_of_16',
  'quarter_final',
  'semi_final',
  'third_place',
  'final',
];

function TeamSelect({
  label,
  teams,
  value,
  onChange,
}: {
  label: string;
  teams: AdminTeam[];
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-gray-500">{label}</Label>
      <select
        className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">— Seleccionar —</option>
        {teams.map((t) => (
          <option key={t.id} value={String(t.id)}>
            {t.flag} {t.name}
          </option>
        ))}
      </select>
    </div>
  );
}

// ── Result editor inline ──────────────────────────────────────────
function ResultRow({
  match,
  teams,
  onSaved,
}: {
  match: AdminMatch;
  teams: AdminTeam[];
  onSaved: (updated: AdminMatch) => void;
}) {
  const [home, setHome] = useState(String(match.home_score ?? ''));
  const [away, setAway] = useState(String(match.away_score ?? ''));
  const [homeTeamId, setHomeTeamId] = useState(
    String(match.home_team?.id ?? '')
  );
  const [awayTeamId, setAwayTeamId] = useState(
    String(match.away_team?.id ?? '')
  );
  const [completed, setCompleted] = useState(match.completed);
  const [wentToPenalties, setWentToPenalties] = useState(match.went_to_penalties ?? false);
  const [penaltyWinnerId, setPenaltyWinnerId] = useState(String(match.penalty_winner_team_id ?? ''));
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [editingKickoff, setEditingKickoff] = useState(false);
  const toLocalInput = (iso: string) => {
    const d = new Date(iso);
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
  };
  const [kickoffInput, setKickoffInput] = useState(toLocalInput(match.kickoff_at));

  const mark = () => setDirty(true);

  const save = async () => {
    setSaving(true);
    try {
      const updated = await adminUpdateMatch(match.id, {
        home_score: home !== '' ? Number(home) : undefined,
        away_score: away !== '' ? Number(away) : undefined,
        completed,
        home_team_id: homeTeamId ? Number(homeTeamId) : undefined,
        away_team_id: awayTeamId ? Number(awayTeamId) : undefined,
        kickoff_at: new Date(kickoffInput).toISOString(),
        went_to_penalties: wentToPenalties,
        penalty_winner_team_id: penaltyWinnerId ? Number(penaltyWinnerId) : null,
      });
      onSaved(updated);
      setDirty(false);
      setEditingKickoff(false);
    } finally {
      setSaving(false);
    }
  };

  const kickoff = new Date(match.kickoff_at).toLocaleString('es-UY', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  });

  const isKnockout = match.stage !== 'group_stage';

  return (
    <div className="grid grid-cols-[1fr_auto] gap-3 items-start py-3 border-b last:border-0">
      <div className="space-y-2">
        {/* Stage + date */}
        <div className="flex items-center gap-2 flex-wrap">
          <Badge
            variant={match.completed ? 'default' : 'secondary'}
            className="text-xs"
          >
            {STAGE_LABELS[match.stage] ?? match.stage}
            {match.group ? ` · Grupo ${match.group}` : ''}
          </Badge>
          {editingKickoff ? (
            <input
              type="datetime-local"
              value={kickoffInput}
              onChange={(e) => { setKickoffInput(e.target.value); mark(); }}
              onBlur={() => setEditingKickoff(false)}
              autoFocus
              className="text-xs border rounded px-1 py-0.5"
            />
          ) : (
            <span
              className="text-xs text-gray-400 cursor-pointer hover:text-gray-600 hover:underline"
              onClick={() => setEditingKickoff(true)}
              title="Click to edit kickoff time"
            >
              {kickoff} ✏️
            </span>
          )}
          {match.stadium && (
            <span className="text-xs text-gray-400">📍 {match.stadium}</span>
          )}
        </div>

        {/* Teams — editable only for knockout (TBD teams) */}
        {isKnockout ? (
          <div className="grid grid-cols-2 gap-2">
            <TeamSelect
              label="Local"
              teams={teams}
              value={homeTeamId}
              onChange={(v) => {
                setHomeTeamId(v);
                mark();
              }}
            />
            <TeamSelect
              label="Visitante"
              teams={teams}
              value={awayTeamId}
              onChange={(v) => {
                setAwayTeamId(v);
                mark();
              }}
            />
          </div>
        ) : (
          <div className="flex items-center gap-2 text-sm font-medium">
            <span>
              {match.home_team?.flag} {match.home_team?.name}
            </span>
            <span className="text-gray-400">vs</span>
            <span>
              {match.away_team?.flag} {match.away_team?.name}
            </span>
          </div>
        )}

        {/* Score */}
        <div className="flex items-center gap-2">
          <Input
            type="number"
            min="0"
            placeholder="–"
            value={home}
            onChange={(e) => {
              setHome(e.target.value);
              mark();
            }}
            className="w-16 h-8 text-center text-sm"
          />
          <span className="text-gray-400 font-bold">:</span>
          <Input
            type="number"
            min="0"
            placeholder="–"
            value={away}
            onChange={(e) => {
              setAway(e.target.value);
              mark();
            }}
            className="w-16 h-8 text-center text-sm"
          />
          <label className="flex items-center gap-1.5 text-sm text-gray-600 ml-2 cursor-pointer">
            <input
              type="checkbox"
              className="accent-green-600"
              checked={completed}
              onChange={(e) => {
                setCompleted(e.target.checked);
                mark();
              }}
            />
            Finalizado
          </label>
        </div>

        {KNOCKOUT_STAGES.includes(match.stage) && (
          <div className="flex items-center gap-3 flex-wrap">
            <label className="flex items-center gap-1.5 text-sm text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                className="accent-amber-500"
                checked={wentToPenalties}
                onChange={(e) => { setWentToPenalties(e.target.checked); mark(); }}
              />
              Fue a penales
            </label>
            {wentToPenalties && (
              <select
                className="h-8 rounded-md border border-input bg-background px-2 text-sm"
                value={penaltyWinnerId}
                onChange={(e) => { setPenaltyWinnerId(e.target.value); mark(); }}
              >
                <option value="">— Ganador penales —</option>
                {[match.home_team, match.away_team].filter(Boolean).map((t) => (
                  <option key={t!.id} value={String(t!.id)}>
                    {t!.flag} {t!.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      <Button
        size="sm"
        disabled={!dirty || saving}
        onClick={save}
        className="bg-green-600 hover:bg-green-700 text-white mt-6"
      >
        {saving ? '...' : 'Guardar'}
      </Button>
    </div>
  );
}

// ── New knockout match form ───────────────────────────────────────
function NewMatchForm({
  teams,
  onCreated,
}: {
  teams: AdminTeam[];
  onCreated: (m: AdminMatch) => void;
}) {
  const [stage, setStage] = useState('round_of_16');
  const [homeTeamId, setHomeTeamId] = useState('');
  const [awayTeamId, setAwayTeamId] = useState('');
  const [kickoff, setKickoff] = useState('');
  const [stadium, setStadium] = useState('');
  const [stadiumEn, setStadiumEn] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!kickoff) {
      setError('La fecha es obligatoria');
      return;
    }
    setSaving(true);
    setError('');
    try {
      const m = await adminCreateMatch({
        stage,
        home_team_id: homeTeamId ? Number(homeTeamId) : (undefined as any),
        away_team_id: awayTeamId ? Number(awayTeamId) : (undefined as any),
        kickoff_at: new Date(kickoff).toISOString(),
        stadium,
        stadium_en: stadiumEn,
      });
      onCreated(m);
      setHomeTeamId('');
      setAwayTeamId('');
      setKickoff('');
      setStadium('');
      setStadiumEn('');
    } catch (err: any) {
      setError(err?.response?.data?.errors?.join(', ') ?? 'Error al guardar');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Fase</Label>
        <select
          className="w-full h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm focus:outline-none focus:ring-1 focus:ring-green-500"
          value={stage}
          onChange={(e) => setStage(e.target.value)}
        >
          {KNOCKOUT_STAGES.map((s) => (
            <option key={s} value={s}>
              {STAGE_LABELS[s]}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <TeamSelect
          label="Equipo Local (puede dejarse vacío)"
          teams={teams}
          value={homeTeamId}
          onChange={setHomeTeamId}
        />
        <TeamSelect
          label="Equipo Visitante (puede dejarse vacío)"
          teams={teams}
          value={awayTeamId}
          onChange={setAwayTeamId}
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-gray-500">Fecha y hora</Label>
        <Input
          type="datetime-local"
          value={kickoff}
          onChange={(e) => setKickoff(e.target.value)}
          className="h-9"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">Estadio (ES)</Label>
          <Input
            value={stadium}
            onChange={(e) => setStadium(e.target.value)}
            placeholder="Estadio Azteca"
            className="h-9"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-xs text-gray-500">Estadio (EN)</Label>
          <Input
            value={stadiumEn}
            onChange={(e) => setStadiumEn(e.target.value)}
            placeholder="Azteca Stadium"
            className="h-9"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 border border-red-200 rounded px-3 py-2">
          {error}
        </p>
      )}

      <Button
        type="submit"
        disabled={saving}
        className="w-full bg-green-600 hover:bg-green-700 text-white"
      >
        {saving ? 'Guardando...' : '+ Agregar partido'}
      </Button>
    </form>
  );
}

// ── Main page ─────────────────────────────────────────────────────
export default function AdminPanel() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [matches, setMatches] = useState<AdminMatch[]>([]);
  const [teams, setTeams] = useState<AdminTeam[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.admin) {
      navigate('/dashboard');
      return;
    }
    Promise.all([adminGetMatches(), adminGetTeams()])
      .then(([m, t]) => {
        setMatches(m);
        setTeams(t);
      })
      .finally(() => setLoading(false));
  }, [user]);

  const handleSaved = (updated: AdminMatch) =>
    setMatches((prev) => prev.map((m) => (m.id === updated.id ? updated : m)));

  const handleCreated = (created: AdminMatch) =>
    setMatches((prev) =>
      [...prev, created].sort(
        (a, b) =>
          new Date(a.kickoff_at).getTime() - new Date(b.kickoff_at).getTime()
      )
    );

  const upcoming = matches.filter((m) => !m.completed);
  const completed = matches.filter((m) => m.completed);
  const knockout = matches.filter((m) => m.stage !== 'group_stage');

  return (
    <div className="min-h-screen">
      <div className="min-h-screen mx-auto max-w-5xl bg-white px-6 py-6">
        <header className="mb-8 flex items-center justify-between border-b pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <button
                onClick={() => navigate('/dashboard')}
                className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
              >
                ← Dashboard
              </button>
            </div>
            <h1 className="text-2xl font-black text-gray-900">
              ⚙️ Panel de Administración
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Gestión de partidos y resultados
            </p>
          </div>
          <SideBarProfile />
        </header>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-gray-400">
            Cargando...
          </div>
        ) : (
          <Tabs defaultValue="results">
            <TabsList className="grid w-full max-w-md grid-cols-3 mb-6">
              <TabsTrigger value="results">Próximos</TabsTrigger>
              <TabsTrigger value="completed">Finalizados</TabsTrigger>
              <TabsTrigger value="new">+ Nuevo partido</TabsTrigger>
            </TabsList>

            {/* ── Tab: upcoming / set results ── */}
            <TabsContent value="results">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-700">
                    Partidos pendientes ({upcoming.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {upcoming.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">
                      No hay partidos pendientes.
                    </p>
                  ) : (
                    upcoming.map((m) => (
                      <ResultRow
                        key={m.id}
                        match={m}
                        teams={teams}
                        onSaved={handleSaved}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab: completed ── */}
            <TabsContent value="completed">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-700">
                    Partidos finalizados ({completed.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {completed.length === 0 ? (
                    <p className="text-sm text-gray-400 py-6 text-center">
                      Aún no hay partidos finalizados.
                    </p>
                  ) : (
                    completed.map((m) => (
                      <ResultRow
                        key={m.id}
                        match={m}
                        teams={teams}
                        onSaved={handleSaved}
                      />
                    ))
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* ── Tab: new knockout match ── */}
            <TabsContent value="new">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base font-semibold text-gray-700">
                    Agregar partido de eliminación directa
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <NewMatchForm teams={teams} onCreated={handleCreated} />

                  {knockout.length > 0 && (
                    <div className="mt-6">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Partidos de fase final creados
                      </p>
                      {knockout.map((m) => (
                        <div
                          key={m.id}
                          className="flex items-center gap-2 py-1.5 border-b last:border-0 text-sm"
                        >
                          <Badge variant="outline" className="text-xs">
                            {STAGE_LABELS[m.stage]}
                          </Badge>
                          <span>
                            {m.home_team
                              ? `${m.home_team.flag} ${m.home_team.name}`
                              : 'TBD'}
                            {' vs '}
                            {m.away_team
                              ? `${m.away_team.flag} ${m.away_team.name}`
                              : 'TBD'}
                          </span>
                          {m.completed && (
                            <span className="ml-auto text-gray-400 text-xs">
                              {m.home_score} – {m.away_score}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
