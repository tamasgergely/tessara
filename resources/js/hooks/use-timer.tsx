import { useState, useRef, useEffect } from 'react';
import type { Timer } from '@/types';

export function useTimer(initialTimer: Timer) {
    const [timer, setTimer] = useState(initialTimer);
    const workerRef = useRef<Worker | null>(null);

    useEffect(() => {
        setTimer(initialTimer);
    }, [
        initialTimer.project_id,
        initialTimer.task_id,
        initialTimer.description,
        initialTimer.project_name,
        initialTimer.task_name,
        initialTimer.client_name,
        initialTimer.intervals
    ]);

    useEffect(() => {
        try {
            workerRef.current = new Worker('/js/timerWorker.js');

            workerRef.current.onmessage = (e) => {
                if (e.data.tick) {
                    setTimer(prev => {
                        const elapsed = { ...prev.elapsedTimeAsHMS };

                        elapsed.seconds++;

                        if (elapsed.seconds > 59) {
                            elapsed.seconds = 0;
                            elapsed.minutes++;
                        }

                        if (elapsed.minutes > 59) {
                            elapsed.seconds = 0;
                            elapsed.minutes = 0;
                            elapsed.hours++;
                        }

                        return {
                            ...prev,
                            elapsedTimeAsHMS: elapsed,
                        };
                    });
                }
            };

            workerRef.current.onerror = (event) => {
                console.error('Worker error:', event.message);
                workerRef.current?.terminate();
                workerRef.current = null;
            };

            workerRef.current.onmessageerror = (event) => {
                console.error('Worker message error:', event);
            };

            if (!timer.stop) {
                workerRef.current.postMessage('start');
            }

        } catch (error) {
            console.error('Worker creation failed:', error);
        }

        return () => {
            if (workerRef.current) {
                try {
                    workerRef.current.postMessage('stop');
                    workerRef.current.terminate();
                    workerRef.current = null;
                } catch (e) {
                    console.warn('Failed to clean up worker:', e);
                }
            }
        };

    }, []);

    useEffect(() => {
        if (!timer.stop && workerRef.current) {
            workerRef.current.postMessage('start');
        } else if (timer.stop && workerRef.current) {
            workerRef.current.postMessage('stop');
        }
    }, [timer.stop]);

    return {
        timer,
        setTimer,
        workerRef
    };
}