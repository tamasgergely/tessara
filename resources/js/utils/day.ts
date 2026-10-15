export function parseDay(day: string): Date {
    const [year, month, dayOfMonth] = day.split('-').map(Number);

    return new Date(year, month - 1, dayOfMonth);
}

export function toDayString(date: Date): string {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

export function addDays(date: string, days: number): string {
    const day = parseDay(date);

    day.setDate(day.getDate() + days);

    return toDayString(day);
}
