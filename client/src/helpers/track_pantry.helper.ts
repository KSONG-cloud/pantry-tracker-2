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