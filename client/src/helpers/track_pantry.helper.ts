export const normaliseFoodName = (input: string): string => {
    if (!input) return '';

    // 1. Trim whitespace at start and end
    let name = input.trim();
    // 2. Remove consecutive spaces
    name = name.replace(/\s+/g, ' ');

    // 3. Convert to lowercase first (for consistent casing)
    name = name.toLowerCase();

    // 4. Capitalize each word
    name = name.replace(/\b\w/g, (char) => char.toUpperCase());

    return name;
};

export function diffObject<T>(original: T, edited: T): Partial<T> {
    const diff: Partial<T> = {};

    for (const key in edited) {
        if (!Object.is(original[key], edited[key])) {
            diff[key] = edited[key];
        }
    }

    return diff;
}
