import { api } from './api';

export interface PlayGroup {
  id: number;
  name: string;
  member_count: number;
  is_admin: boolean;
}

export interface PlayGroupDetail extends PlayGroup {
  members: GroupMember[];
  pending_invitations: PendingInvitation[];
}

export interface GroupMember {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'member';
  avatar_url: string | null;
}

export interface PendingInvitation {
  id: number;
  invite_url: string;
}

export interface InvitationPreview {
  group_name: string;
  invited_by: string;
  status: string;
}

// ── Groups ────────────────────────────────────────────────────────

export async function getMyGroups(): Promise<PlayGroup[]> {
  const res = await api.get('/api/play_groups');
  return res.data;
}

export async function getGroup(id: number): Promise<PlayGroupDetail> {
  const res = await api.get(`/api/play_groups/${id}`);
  return res.data;
}

export async function createGroup(name: string): Promise<PlayGroupDetail> {
  const res = await api.post('/api/play_groups', { name });
  return res.data;
}

export async function deleteGroup(id: number): Promise<void> {
  await api.delete(`/api/play_groups/${id}`);
}

export async function leaveGroup(id: number): Promise<void> {
  await api.delete(`/api/play_groups/${id}/leave`);
}

export async function removeMember(groupId: number, userId: number): Promise<void> {
  await api.delete(`/api/play_groups/${groupId}/members/${userId}`);
}

// ── Invitations ───────────────────────────────────────────────────

export async function createInviteLink(groupId: number): Promise<PendingInvitation> {
  const res = await api.post(`/api/play_groups/${groupId}/invitations`);
  return res.data;
}

export async function cancelInvitation(groupId: number, invitationId: number): Promise<void> {
  await api.delete(`/api/play_groups/${groupId}/invitations/${invitationId}`);
}

export async function getInvitationPreview(token: string): Promise<InvitationPreview> {
  const res = await api.get(`/api/invitations/${token}`);
  return res.data;
}

export async function acceptInvitation(
  token: string
): Promise<{ group_id: number; group_name: string }> {
  const res = await api.post(`/api/invitations/${token}/accept`);
  return res.data;
}
