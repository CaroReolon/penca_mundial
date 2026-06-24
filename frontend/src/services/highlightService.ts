import { api } from './api';

export type Highlight = {
  id: number;
  kind: string;
  title: string;
  description: string;
  title_en: string;
  description_en: string;
  shown: boolean;
  play_group_id: number | null;
};

export async function getHighlights(playGroupId: number): Promise<Highlight[]> {
  const response = await api.get(`/api/play_groups/${playGroupId}/highlights`);
  return response.data;
}
