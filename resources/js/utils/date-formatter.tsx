export const formatToLocalTimeWithDate = (utcDateTime: string): string => {
    if (!utcDateTime) return '';

    const date = new Date(utcDateTime);

    return new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
};

export const formatToLocalDate = (utcDateTime: string): string => {
    if (!utcDateTime) return '';

    const date = new Date(utcDateTime);

    return new Intl.DateTimeFormat('hu-HU', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    }).format(date);
};

export const formatToLocalTime = (utcDateTime: string | null | undefined): string => {
    if (!utcDateTime) return '';   

    const date = new Date(utcDateTime);

    return new Intl.DateTimeFormat('hu-HU', {
        hour: '2-digit',
        minute: '2-digit',
    }).format(date);
};