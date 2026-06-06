import type { Language } from '@/contexts/LanguageContext';
import type { Team } from '@/types/match';

/** Full display name for a team (e.g. headings, tables). */
export function teamName(team: Team, lang: Language): string {
  return lang === 'en' ? (team.name_en ?? team.name) : team.name;
}

/** Short display name for a team (e.g. inside cards where space is tight). */
export function teamShortName(team: Team, lang: Language): string {
  return lang === 'en'
    ? (team.short_name_en ?? team.short_name ?? team.name_en ?? team.name)
    : (team.short_name ?? team.name);
}

/** Stadium name for a match. */
export function stadiumName(
  match: { stadium: string; stadium_en?: string },
  lang: Language
): string {
  return lang === 'en' ? (match.stadium_en ?? match.stadium) : match.stadium;
}

/** BCP-47 locale string for date/number formatting. */
export function matchLocale(lang: Language): string {
  return lang === 'en' ? 'en-US' : 'es-UY';
}

/**
 * Formats a kickoff datetime string into the viewer's local timezone.
 * The browser detects the timezone automatically — a user in New York sees
 * "Jun 11, 3:00 PM EDT", while one in Montevideo sees "11 jun, 16:00 UYT".
 */
export function formatKickoff(dateString: string, lang: Language): string {
  return new Date(dateString).toLocaleString(matchLocale(lang), {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short',
  });
}
