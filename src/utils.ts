import { EVENT_API_URL_PREFIX, EVENT_URL_PREFIX, IMAGE_URL_PREFIX } from './const.js';
import type { EventURLOptions } from './types.js';

export function getEventLink(eventId: string): string {
    return `${EVENT_URL_PREFIX}/${eventId}`;
}

export function getImageURL(eventId: string, shareImage: string): string {
    return `${IMAGE_URL_PREFIX}/${eventId}/${shareImage}.jpg`;
}

export function buildEventURL({ page = 0, since, till, limit = 100, cityId, categoryId }: EventURLOptions = {}) {
    const queryParams = new URLSearchParams();

    queryParams.append('page', String(page));
    queryParams.append('perPage', String(limit));
    queryParams.append('cityId', cityId ?? '');
    queryParams.append('categories', categoryId ?? '');
    queryParams.append('since', since ?? '');
    queryParams.append('till', till ?? '');
    queryParams.append('withoutStream', 'true');

    return `${EVENT_API_URL_PREFIX}?${queryParams.toString()}`;
}

/** Format a millisecond (UTC) timestamp as an ISO string with the given numeric offset (seconds). */
function formatFromMsWithOffset(ms: number, offsetSeconds: number): string {
    const shifted = new Date(ms + offsetSeconds * 1000);

    const pad = (n: number) => String(n).padStart(2, '0');
    const Y = shifted.getUTCFullYear();
    const M = pad(shifted.getUTCMonth() + 1);
    const D = pad(shifted.getUTCDate());
    const h = pad(shifted.getUTCHours());
    const m = pad(shifted.getUTCMinutes());
    const s = pad(shifted.getUTCSeconds());

    const sign = offsetSeconds >= 0 ? '+' : '-';
    const absSec = Math.abs(offsetSeconds);
    const offH = pad(Math.floor(absSec / 3600));
    const offM = pad(Math.floor((absSec % 3600) / 60));

    return `${Y}-${M}-${D}T${h}:${m}:${s}${sign}${offH}:${offM}`;
}

/**
 * Convert a UTC ISO string and an offset in seconds (e.g. 3600) to an ISO-like string
 * with local time + explicit offset (e.g. "2025-12-01T18:00:00+01:00").
 */
export function isoWithOffset(utcIso: string, offsetSeconds: number): string {
    const ms = Date.parse(utcIso);
    if (Number.isNaN(ms)) throw new Error('Invalid ISO date');
    return formatFromMsWithOffset(ms, offsetSeconds);
}

/**
 * Take a raw date string and return a local ISO string with timezone applied.
 * - If endOfDay=false (default) the instant represented by `rawDate` is used.
 * - If endOfDay=true the function returns the local 23:59:59 of that date (taking local DST into account).
 *
 * Returns `undefined` when `rawDate` is missing or invalid.
 */
export function rawToLocalISOString(rawDate: string | undefined, endOfDay = false): string | undefined {
    if (!rawDate) return undefined;

    const parsed = new Date(rawDate);
    if (Number.isNaN(parsed.getTime())) return undefined;

    if (endOfDay) {
        const localEnd = new Date(parsed.getFullYear(), parsed.getMonth(), parsed.getDate(), 23, 59, 59);
        const ms = localEnd.getTime();
        const offsetSeconds = -localEnd.getTimezoneOffset() * 60;
        return formatFromMsWithOffset(ms, offsetSeconds);
    }
    const ms = parsed.getTime();
    const offsetSeconds = -parsed.getTimezoneOffset() * 60;
    return formatFromMsWithOffset(ms, offsetSeconds);
}
