import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}

export interface Option {
    value: string,
    label: string,
    __isNew__?: boolean;
    subLabel? :string
}

export interface Client {
    id: number,
    name: string,
    archived: boolean
}

export interface Project {
    id: number,
    name: string,
    description: string,
    archived: boolean
    client: Client | null
    tasks: Task[] | null
}

export interface Task {
    id: number,
    name: string,
    description: string,
    archived: boolean
    project: Project | null,
    client: Client | null
}

export interface ClientOption extends Option {
    projects: Project[]
}

export interface ElapsedTimeHMS {
    hours: number,
    minutes: number,
    seconds: number
}

export interface TimerInterval {
    id: number,
    timer_id: number,
    start: string,
    stop?: string | null
}

export interface Timer{
    id: number,
    client_id: number,
    client_name: string,
    project_id: number,
    task_id: number,
    task_name: string,
    project_name: string,
    description: string,
    elapsedTimeAsHMS: ElapsedTimeHMS,
    start: boolean,
    stop: boolean | null,
    intervals: TimerInterval[]
}

export interface DeletableEntity {
    id: number,
    name?: string
}

export interface ArchiveableEntity {
    id: number,
    name?: string,
    archived: boolean
}