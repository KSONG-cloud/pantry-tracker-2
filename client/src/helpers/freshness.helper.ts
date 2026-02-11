// Imports
import { getTimeDiff } from '../helpers/time.helper';
import type { DateType } from '../helpers/time.helper';

export type FreshnessLevel =
    | 'expired'
    | 'critical'
    | 'warning'
    | 'ok'
    | 'fresh';

export const ALL_FRESHNESS: FreshnessLevel[] = [
    'expired',
    'critical',
    'warning',
    'ok',
    'fresh',
];

// Get freshness level of
export const getFreshnessLevel = (
    expiryDate: Date,
    type: DateType
): FreshnessLevel => {
    if (!expiryDate) return 'fresh';

    const diff = getTimeDiff(expiryDate);

    // ---------- EXPIRY ----------
    if (type === 'expiry') {
        if (diff.isPast) return 'expired';
        if (diff.days <= 2) return 'critical';
        if (diff.days <= 7) return 'warning';
        if (diff.days <= 14) return 'ok';
        return 'fresh';
    }

    // ---------- BEST BEFORE ----------
    if (type === 'bestbefore') {
        if (diff.isPast && diff.days < -30) return 'expired';
        if (diff.isPast && diff.days <= -14) return 'critical';
        if (diff.isPast) return 'warning';
        if (diff.days <= 7) return 'ok';
        return 'fresh';
    }

    // ---------- ADDED ----------
    if (diff.days <= 2) return 'fresh';
    if (diff.days <= 7) return 'ok';
    if (diff.days <= 14) return 'warning';
    return 'critical'; // very old item
};

// Colour Palette for Freshness
export const freshnessColors: Record<FreshnessLevel, string> = {
    expired: '#c2c2c2', // dark grey / black
    critical: '#DC2626', // bright red
    warning: '#F59E0B', // yellow
    ok: '#bacc16', // yellow-green
    fresh: '#16A34A', // green
};
