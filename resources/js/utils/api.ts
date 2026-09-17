import { getCookie } from '@/utils/cookie';

export class ApiError extends Error {
    readonly status: number;
    readonly data: unknown;

    constructor(message: string, status: number, data: unknown = null) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
        this.data = data;
    }

    get sessionExpired(): boolean {
        return this.status === 419;
    }
}

type ApiFetchOptions = {
    method?: string;
    body?: unknown;
};

async function readBody(response: Response): Promise<unknown> {
    const text = await response.text();

    if (!text) return null;

    try {
        return JSON.parse(text);
    } catch {
        return null;
    }
}

function messageOf(data: unknown, fallback: string): string {
    const message = (data as { message?: unknown })?.message;

    return typeof message === 'string' && message ? message : fallback;
}

export async function apiFetch<T>(
    url: string,
    { method = 'GET', body }: ApiFetchOptions = {},
): Promise<T> {
    let response: Response;

    try {
        response = await fetch(url, {
            method,
            headers: {
                'X-XSRF-TOKEN': getCookie('XSRF-TOKEN'),
                'Content-Type': 'application/json',
                Accept: 'application/json',
            },
            body: body === undefined ? undefined : JSON.stringify(body),
        });
    } catch {
        // fetch only rejects on a network failure; HTTP errors are handled below.
        throw new ApiError('Could not reach the server.', 0);
    }

    // Read as text first: an error body may be empty, or an HTML page rather
    // than JSON, and response.json() would throw before the status is checked.
    const data = await readBody(response);

    if (response.status === 419) {
        throw new ApiError('Your session has expired.', 419, data);
    }

    if (!response.ok) {
        throw new ApiError(messageOf(data, 'The request failed.'), response.status, data);
    }

    return data as T;
}
