import type { Project, Task, Timer, Client, BreadcrumbItem } from '@/types';
import AppLayout from '@/layouts/app-layout';
import { Head } from '@inertiajs/react';
import ReportList from '@/components/reports/report-list';
import ReportFilterForm from '@/components/reports/report-filter-form';
import "rsuite/DateRangePicker/styles/index.css";
import "../../css/rsuite-overrides.css";

const breadcrumbs: BreadcrumbItem[] = [
    // {
    //     title: 'Dashboard',
    //     href: '/dashboard',
    // },
    {
        title: 'Reports',
        href: ''
    },
];

type GroupedTimers = {
    date: string;
    timers: Timer[];
}

type ReportsProps = {
    groupedTimers: GroupedTimers[],
    clients: Client[],
    projects: Project[],
    tasks: Task[]
}

export default function Reports({ groupedTimers, clients, projects, tasks }: ReportsProps) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Reports" />

            <div className="px-5">
                <div className="flex justify-between items-center mb-5">
                    <h1 className="text-2xl">Reports</h1>
                </div>

                <ReportFilterForm initialClients={clients} initialProjects={projects} initialTasks={tasks} />

                <ReportList groupedTimers={groupedTimers} />
            </div>
        </AppLayout >
    );
}