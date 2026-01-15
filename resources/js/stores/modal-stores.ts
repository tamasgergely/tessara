import { createModalStore } from './create-modal-store';
import type { Client, Project, Task, Timer, TimerInterval } from '@/types';

export const useClientModalStore = createModalStore<Client>();
export const useProjectModalStore = createModalStore<Project>();
export const useTaskModalStore = createModalStore<Task>();
export const useTimerModalStore = createModalStore<Timer|TimerInterval>();