import { parseDay } from "./day";

const dayFormat = new Intl.DateTimeFormat('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    weekday: 'short',
});

const timeFormat = new Intl.DateTimeFormat('en-GB', {
    hour: '2-digit',
    minute: '2-digit'
});

const dateTimeFormat = new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
});

export function formatDay(date: string): string {
    return dayFormat.format(parseDay(date));
}

export function formatTime(utcDateTime: string | null | undefined): string {
    if (!utcDateTime) return '';

    return timeFormat.format(new Date(utcDateTime));
}

export function formatDateTime(utcDateTime: string): string {
    if (!utcDateTime) return '';

    return dateTimeFormat.format(new Date(utcDateTime));
}