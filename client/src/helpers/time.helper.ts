// Imports
import { format } from 'date-fns';
import type { FoodUnitType } from '../types/food';

// Types
type TimeDiff = {
    days: number;
    weeks: number;
    months: number;
    isPast: boolean;
};

export type DateType = 'expiry' | 'bestbefore' | 'added';

// get time different between target date and now
export const getTimeDiff = (targetDate: Date, now = new Date()): TimeDiff => {
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
export const formatAbsoluteDate = (date: Date, type: DateType) => {
    const diff = getTimeDiff(date);

    // If we only have Added Date
    if (type === 'added') {
        return `Added on ${format(date, 'dd MMM yyyy')}`;
    }

    // If we do have expiry or best before date and it has EXPIRED
    if (diff.isPast) {
        const prefix =
            type === 'expiry' ? 'Expired on' : 'Best before passed on';

        return `${prefix} ${format(date, 'dd MMM yyyy')}`;
    }

    const prefix = type === 'expiry' ? 'Expires on' : 'Best before on';

    return `${prefix} ${format(date, 'dd MMM yyyy')}`;
};

// Helps format the date into relative date to the expiry/bestbefore/added date
export const formatRelativeDate = (targetDate: Date, type: DateType) => {
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

export const getFoodDateInfo = (
    foodItem: FoodUnitType
): { type: DateType; date: Date } => {
    if (foodItem.expiry_date) {
        return { type: 'expiry', date: new Date(foodItem.expiry_date) };
    }

    if (foodItem.bestbefore_date) {
        return {
            type: 'bestbefore',
            date: new Date(foodItem.bestbefore_date),
        };
    }

    return { type: 'added', date: new Date(foodItem.added_date) };
};

export const enrichFoodWithDateInfo = (foodItem: FoodUnitType) => {
    return {
        ...foodItem,
        dateInfo: getFoodDateInfo(foodItem),
    };
};
