import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAuth } from '@/contexts/AuthContext';
import { getTornamentsRanking } from '@/services/tournamentService';
import {
  getMyGroups, getGroup, createGroup, leaveGroup, deleteGroup, removeMember,
  createInviteLink, cancelInvitation,
  type PlayGroup, type PlayGroupDetail, type PendingInvitation,
} from '@/services/playGroupService';

type Participant = {
  points: number;
  position: number;
  previous_position: number;
  user: { id: number; name: string; email: string; avatar_url: string | null };
};

type Props = { ranking: Participant[] };

// ─── Copy link button ─────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="text-xs text-green-600 hover:underline ml-1 shrink-0"
    >
      {copied ? '✓ Copiado' : 'Copiar link'}
    </button>
  );
}

// ─── Group management panel ───────────────────────────────────────
function GroupPanel({ group, currentUserId, onClose, onLeft, onDeleted }: {
  group: PlayGroupDetail;
  currentUserId: number;
  onClose: () => void;
  onLeft: () => void;
  onDeleted: () => void;
}) {
  const [inviting, setInviting] = useState(false);
  const [invitations, setInvitations] = useState<PendingInvitation[]>(group.pending_invitations);
  const [members, setMembers] = useState(group.members);
  const [leaving, setLeaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [removingId, setRemovingId] = useState<number | null>(null);
  const [error, setError] = useState('');

  const handleGenerateLink = async () => {
    setInviting(true); setError('');
    try {
      const inv = await createInviteLink(group.id);
      setInvitations(prev => [...prev, inv]);
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Error al generar el link');
    } finally { setInviting(false); }
  };

  const handleCancelInvite = async (invId: number) => {
    await cancelInvitation(group.id, invId);
    setInvitations(prev => prev.filter(i => i.id !== invId));
  };

  const handleRemoveMember = async (userId: number, name: string) => {
    if (!confirm(`¿Eliminar a ${name} del grupo?`)) return;
    setRemovingId(userId);
    try {
      await removeMember(group.id, userId);
      setMembers(prev => prev.filter(m => m.id !== userId));
    } catch (err: any) {
      setError(err?.response?.data?.error ?? 'Error al eliminar miembro');
    } finally { setRemovingId(null); }
  };

  const handleLeave = async () => {
    if (!confirm('¿Seguro que querés salir de este grupo?')) return;
    setLeaving(true);
    try { await leaveGroup(group.id); onLeft(); }
    catch (err: any) { setError(err?.response?.data?.error ?? 'Error'); setLeaving(false); }
  };

  const handleDelete = async () => {
    if (!confirm(`¿Eliminar el grupo "${group.name}"? Esta acción no se puede deshacer.`)) return;
    setDeleting(true);
    try { await deleteGroup(group.id); onDeleted(); }
    catch { setDeleting(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/30"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <div>
            <h2 className="font-bold text-gray-900">{group.name}</h2>
            <p className="text-xs text-gray-400">{members.length} miembro{members.length !== 1 ? 's' : ''}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-lg">✕</button>
        </div>

        <div className="overflow-y-auto flex-1 p-5 space-y-5">

          {/* Members list */}
          <div>
            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Miembros</p>
            <div className="space-y-2">
              {members.map(m => {
                const isSelf = m.id === currentUserId;
                const canRemove = group.is_admin && !isSelf;
                return (
                  <div key={m.id} className="flex items-center gap-2">
                    <Avatar className="h-7 w-7 shrink-0">
                      <AvatarImage src={m.avatar_url ?? undefined} />
                      <AvatarFallback className="text-xs">{m.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm flex-1 truncate">{m.name}{isSelf && <span className="text-gray-400 ml-1">(vos)</span>}</span>
                    <Badge variant="outline" className="text-[10px] shrink-0">
                      {m.role === 'admin' ? '👑 Admin' : 'Miembro'}
                    </Badge>
                    {canRemove && (
                      <button
                        onClick={() => handleRemoveMember(m.id, m.name)}
                        disabled={removingId === m.id}
                        title="Eliminar del grupo"
                        className="text-gray-300 hover:text-red-400 transition-colors ml-1 shrink-0 disabled:opacity-40"
                      >
                        {removingId === m.id ? '...' : '✕'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Invite links (admin only) */}
          {group.is_admin && (
            <div>
              <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Invitar al grupo</p>
              <Button size="sm" onClick={handleGenerateLink} disabled={inviting}
                className="bg-green-600 hover:bg-green-700 text-white h-8 w-full">
                {inviting ? '...' : '🔗 Generar link de invitación'}
              </Button>
              {invitations.length > 0 && (
                <div className="mt-3 space-y-1.5">
                  <p className="text-[11px] text-gray-400">Compartí el link por WhatsApp, Telegram o como quieras</p>
                  {invitations.map(inv => (
                    <div key={inv.id} className="flex items-center gap-1.5 text-xs bg-gray-50 rounded px-2 py-1.5">
                      <span className="flex-1 text-gray-400 truncate font-mono">{inv.invite_url}</span>
                      <CopyButton text={inv.invite_url} />
                      <button onClick={() => handleCancelInvite(inv.id)} className="text-gray-300 hover:text-red-400 ml-1">✕</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && <p className="text-xs text-red-500">{error}</p>}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t flex gap-2 justify-end">
          <Button variant="outline" size="sm" onClick={handleLeave} disabled={leaving}
            className="text-red-500 border-red-200 hover:bg-red-50">
            {leaving ? '...' : 'Salir del grupo'}
          </Button>
          {group.is_admin && (
            <Button variant="destructive" size="sm" onClick={handleDelete} disabled={deleting}>
              {deleting ? '...' : 'Eliminar grupo'}
            </Button>
          )}
          <Button size="sm" onClick={onClose} className="bg-green-600 hover:bg-green-700 text-white">Listo</Button>
        </div>
      </div>
    </div>
  );
}

// ─── Create group modal ───────────────────────────────────────────
function CreateGroupModal({ onCreated, onClose }: { onCreated: (g: PlayGroup) => void; onClose: () => void }) {
  const [name, setName] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    setSaving(true);
    try { onCreated(await createGroup(name.trim())); }
    catch (err: any) { setError(err?.response?.data?.errors?.join(', ') ?? 'Error'); setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30"
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-6">
        <h2 className="font-bold text-gray-900 mb-4">Crear nuevo grupo</h2>
        <form onSubmit={submit} className="space-y-3">
          <Input placeholder="Ej: Familia, Trabajo, Amigos..." value={name}
            onChange={e => setName(e.target.value)} maxLength={60} autoFocus />
          {error && <p className="text-xs text-red-500">{error}</p>}
          <div className="flex gap-2 justify-end">
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>Cancelar</Button>
            <Button type="submit" size="sm" disabled={saving || !name.trim()}
              className="bg-green-600 hover:bg-green-700 text-white">
              {saving ? 'Creando...' : 'Crear grupo'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────
export function RankingTab({ ranking: _initialRanking }: Props) {
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user: me } = useAuth();

  const [groups, setGroups] = useState<PlayGroup[]>([]);
  const [selectedGroupId, setSelectedGroupId] = useState<number | null>(null);
  const [groupsLoaded, setGroupsLoaded] = useState(false);
  const [ranking, setRanking] = useState<Participant[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [panelGroup, setPanelGroup] = useState<PlayGroupDetail | null>(null);

  // Load my groups on mount, auto-select the first one
  useEffect(() => {
    getMyGroups()
      .then(gs => {
        setGroups(gs);
        if (gs.length > 0) setSelectedGroupId(gs[0].id);
        setGroupsLoaded(true);
      })
      .catch(() => setGroupsLoaded(true));
  }, []);

  // Reload ranking whenever the selected group changes (only after groups are loaded)
  useEffect(() => {
    if (!groupsLoaded || selectedGroupId === null) return;
    setLoadingRanking(true);
    getTornamentsRanking(1, selectedGroupId)
      .then(setRanking)
      .finally(() => setLoadingRanking(false));
  }, [selectedGroupId, groupsLoaded]);

  const openPanel = async (g: PlayGroup) => { setPanelGroup(await getGroup(g.id)); };

  const handleGroupCreated = (g: PlayGroup) => {
    setGroups(prev => [...prev, g]);
    setSelectedGroupId(g.id);
    setShowCreate(false);
  };

  const handleLeft = () => {
    setGroups(prev => prev.filter(g => g.id !== panelGroup?.id));
    if (selectedGroupId === panelGroup?.id) setSelectedGroupId(null);
    setPanelGroup(null);
  };

  const handleDeleted = () => {
    setGroups(prev => prev.filter(g => g.id !== panelGroup?.id));
    if (selectedGroupId === panelGroup?.id) setSelectedGroupId(null);
    setPanelGroup(null);
  };

  const canViewProfile = (p: Participant) => {
    if (p.user.id === me?.id) return true;
    // All visible users are group members, so profiles are always accessible
    return true;
  };

  const goToProfile = (item: Participant) => {
    if (!canViewProfile(item)) return;
    navigate(`/users/${item.user.id}`, {
      state: { name: item.user.name, points: item.points, position: item.position, avatar_url: item.user.avatar_url },
    });
  };

  const getTrend = (cur: number, prev: number, iconOnly = false) => {
    if (cur < prev) return <span className="text-green-600 font-semibold">{iconOnly ? t('ranking.risingIcon') : t('ranking.rising')}</span>;
    if (cur > prev) return <span className="text-destructive font-semibold">{iconOnly ? t('ranking.fallingIcon') : t('ranking.falling')}</span>;
    return <span className="text-muted-foreground">{iconOnly ? t('ranking.steadyIcon') : t('ranking.steady')}</span>;
  };

  const getGridCols = (n: number) => n === 1 ? 'grid-cols-1 max-w-md mx-auto' : n === 2 ? 'sm:grid-cols-2 max-w-2xl mx-auto' : 'sm:grid-cols-3';
  const topThree = ranking.slice(0, 3);

  return (
    <div className="space-y-4">

      {/* ── Group selector bar ── */}
      <div className="flex flex-wrap items-center gap-2 pb-2 border-b">
        {groups.map(g => (
          <div key={g.id} className="flex items-center gap-1">
            <button
              onClick={() => setSelectedGroupId(g.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                selectedGroupId === g.id
                  ? 'bg-green-600 text-white border-green-600'
                  : 'border-gray-200 text-gray-600 hover:border-green-400 hover:text-green-700'
              }`}
            >
              👥 {g.name}
            </button>
            <button onClick={() => openPanel(g)} title="Gestionar grupo"
              className="text-gray-300 hover:text-gray-500 text-sm transition-colors">
              ⚙️
            </button>
          </div>
        ))}

        <button
          onClick={() => setShowCreate(true)}
          className="px-3 py-1.5 rounded-full text-sm font-medium border border-dashed border-gray-300 text-gray-400 hover:border-green-500 hover:text-green-600 transition-colors"
        >
          + Nuevo grupo
        </button>
      </div>

      {/* ── Content ── */}
      {!groupsLoaded ? (
        <div className="py-16 text-center text-gray-400 animate-pulse">Cargando...</div>
      ) : groups.length === 0 ? (
        <Card className="p-10 text-center space-y-3">
          <p className="text-2xl">👥</p>
          <p className="font-semibold text-gray-700">Aún no perteneces a ningún grupo</p>
          <p className="text-sm text-gray-400">Crea un grupo e invita a tus amigos, familia o compañeros para comparar predicciones.</p>
          <button
            onClick={() => setShowCreate(true)}
            className="mt-2 px-4 py-2 rounded-full text-sm font-medium bg-green-600 text-white hover:bg-green-700 transition-colors"
          >
            + Crear mi primer grupo
          </button>
        </Card>
      ) : loadingRanking ? (
        <div className="py-16 text-center text-gray-400 animate-pulse">Cargando ranking...</div>
      ) : ranking.length === 0 ? (
        <Card className="p-8 text-center text-muted-foreground">
          Este grupo no tiene participantes aún. Invita a tus amigos usando ⚙️.
        </Card>
      ) : (
        <div className="space-y-6">
          {/* Podium */}
          <div className={`grid gap-4 ${getGridCols(topThree.length)}`}>
            {topThree.map((item, index) => {
              const medals = ['🥇', '🥈', '🥉'];
              const clickable = canViewProfile(item);
              return (
                <Card key={item.user.id} onClick={() => goToProfile(item)}
                  className={`overflow-hidden transition-all ${clickable ? 'cursor-pointer hover:shadow-md hover:border-primary/30' : 'cursor-default'} ${index === 0 ? 'border-primary bg-primary/5 shadow-sm' : ''}`}>
                  <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-sm font-medium">{medals[index]} {t('ranking.place')} {item.position}</CardTitle>
                    <span className="text-2xl font-bold tabular-nums">{item.points} {t('ranking.pts')}</span>
                  </CardHeader>
                  <CardContent className="flex items-center gap-3">
                    <Avatar className="h-10 w-10 border">
                      <AvatarImage src={item.user.avatar_url ?? undefined} />
                      <AvatarFallback>{item.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="overflow-hidden">
                      <p className="font-semibold text-sm truncate">{item.user.name}</p>
                      <p className="text-xs">{getTrend(item.position, item.previous_position)}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* Full table */}
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[60px] text-center">{t('ranking.pos')}</TableHead>
                    <TableHead>{t('ranking.participant')}</TableHead>
                    <TableHead className="text-right">{t('ranking.trend')}</TableHead>
                    <TableHead className="text-right font-bold">{t('ranking.points')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {ranking.map(item => {
                    const clickable = canViewProfile(item);
                    return (
                      <TableRow key={item.user.id} onClick={() => goToProfile(item)}
                        className={`transition-colors ${clickable ? 'cursor-pointer hover:bg-muted/50' : 'cursor-default'}`}>
                        <TableCell className="text-center font-bold">{item.position}</TableCell>
                        <TableCell className="py-3">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={item.user.avatar_url ?? undefined} />
                              <AvatarFallback>{item.user.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{item.user.name}</span>
                              {!clickable && <span className="text-[10px] text-gray-300">🔒 Perfil privado</span>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-right text-sm">{getTrend(item.position, item.previous_position, true)}</TableCell>
                        <TableCell className="text-right font-bold tabular-nums text-base">{item.points} {t('ranking.pts')}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modals */}
      {showCreate && <CreateGroupModal onCreated={handleGroupCreated} onClose={() => setShowCreate(false)} />}
      {panelGroup && <GroupPanel group={panelGroup} currentUserId={me!.id} onClose={() => setPanelGroup(null)} onLeft={handleLeft} onDeleted={handleDeleted} />}
    </div>
  );
}
