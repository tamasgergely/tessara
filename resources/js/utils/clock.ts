// The skew between this browser's clock and the server's belongs to the page,
// not to any one timer: one browser, one server, one offset. Keeping it here
// rather than in each row also gives the heartbeat a single place to write to.
let offsetMs = 0;

/** The server's clock, in milliseconds, as this browser can best tell. */
export function serverNow(): number {
    return Date.now() + offsetMs;
}

export function setClockOffset(ms: number): void {
    offsetMs = ms;
}
