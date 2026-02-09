// Imports
import { format } from "date-fns";

// Types
type TimeDiff = {
    days: number;
    weeks: number;
    months: number;
    isPast: boolean;
};

export type FreshnessLevel =
    | 'expired'
    | 'critical'
    | 'warning'
    | 'ok'
    | 'fresh';

// get time different between target date and now
const getTimeDiff = (targetDate: Date, now = new Date()): TimeDiff => {
    const ms = targetDate.getTime() - now.getTime();
    const days = Math.round(ms / (1000 * 60 * 60 * 24));

    return {
        days: Math.abs(days),
        weeks: Math.ceil(Math.abs(days) / 7),
        months: Math.ceil(Math.abs(days) / 30),
        isPast: ms < 0,
    };
};

// Format absolute date
export const formatAbsoluteDate = (
    date: Date,
    type: 'expiry' | 'bestbefore' | 'added'
) => {
    // const label =
    //     type === 'expiry'
    //         ? 'Expiring on'
    //         : type === 'bestbefore'
    //           ? 'Best before'
    //           : 'Added on';

    // return `${label} ${format(date, 'dd MMM yyyy')}`;
	    
	const diff = getTimeDiff(date);
	let label = '';

    // If we only have Added Date
    if (type === 'added') {
        return `Added on ${format(date, 'dd MMM yyyy')}`;
    }

    // If we do have expiry or best before date and it has EXPIRED
    if (diff.isPast) {
        const prefix =
            type === 'expiry'
                ? 'Expired on'
                : 'Best before passed on';

        return `${prefix} ${format(date, 'dd MMM yyyy')}` ;
    }

    const prefix = type === 'expiry' ? 'Expires on' : 'Best before on';

    return `${prefix} ${format(date, 'dd MMM yyyy')}`;
};

// Helps format the date into relative date to the expiry/bestbefore/added date
export const formatRelativeDate = (
    targetDate: Date,
    type: 'expiry' | 'bestbefore' | 'added'
) => {
    const diff = getTimeDiff(targetDate);

    // If we only have Added Date
    if (type === 'added') {
        if (diff.days < 7) return `Added · ${diff.days}d ago`;
        if (diff.weeks < 5) return `Added · ${diff.weeks}w ago`;
        return `Added · ${diff.months}m ago`;
    }

    // If we do have expiry or best before date and it has EXPIRED
    if (diff.isPast) {
        const prefix =
            type === 'expiry'
                ? 'Expired'
                : type === 'bestbefore'
                  ? 'Best before'
                  : '';

        let message = '';

        if (diff.days < 7) {
            message = `${diff.days}d ago`;
        } else if (diff.weeks < 5) {
            message = `${diff.weeks}w ago`;
        } else {
            message = `${diff.months}m ago`;
        }

        return prefix ? `${prefix} · ${message}` : message;
    }

    const prefix = type === 'expiry' ? 'Expires in' : 'Best before in';

    if (diff.days <= 7) return `${prefix} · ${diff.days}d`;
    if (diff.weeks <= 4) return `${prefix} · ${diff.weeks}w`;
    return `${prefix} · ${diff.months}m`;
};

// Get freshness level of
export const getFreshnessLevel = (
    expiryDate: Date,
    type: 'expiry' | 'bestbefore' | 'added'
): FreshnessLevel => {
    if (!expiryDate) return 'fresh';

    const diff = getTimeDiff(expiryDate);

    // ---------- EXPIRY / BEST BEFORE ----------
    if (type === 'expiry') {
        if (diff.isPast) return 'expired';
        if (diff.days <= 2) return 'critical';
        if (diff.days <= 7) return 'warning';
        if (diff.days <= 14) return 'ok';
        return 'fresh';
    }
	if (type === 'bestbefore') {

		if (diff.isPast && diff.days < -30) return "expired";
		if (diff.isPast && diff.days <= -14) return "critical";
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

// TODO: Add a hover and display actual date
