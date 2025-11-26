import { useEffect, useMemo, useRef } from 'react';
import type { Project, Task, Client } from '@/types';
import { useForm, router, usePage } from '@inertiajs/react'
import { DateRangePicker } from 'rsuite';
import SelectWrapper from '@/components/select-wrapper';
import InputError from '@/components/input-error';
import { formatToLocalISO } from '@/utils/date-formatter';

type ReportFilterFormProps = {
    initialClients: Client[] | [],
    initialProjects: Project[] | [],
    initialTasks: Task[] | []
}

export default function ReportFilterForm({ initialClients, initialProjects, initialTasks }: ReportFilterFormProps) {
    type FormData = {
        date: [Date, Date] | null,
        project_id: number | null,
        client_id: number | null,
        task_id: number | null
    }

    const { data, setData } = useForm<FormData>({
        date: null,
        client_id: null,
        project_id: null,
        task_id: null
    });

    const { errors } = usePage<{ errors: Record<string, string> }>().props;

    const isFirstRender = useRef(true);

    const selectedClient = useMemo(
        () => initialClients.find(client => client.id === data?.client_id) ?? null,
        [initialClients, data.client_id]
    )

    const selectedProject = useMemo(
        () => initialProjects.find(project => project.id === data.project_id) ?? null,
        [initialProjects, data.project_id]
    );

    const selectedTask = useMemo(
        () => initialTasks.find(task => task.id === data.task_id) ?? null,
        [initialTasks, data.task_id]
    );

    const filteredProjects = useMemo(() => {
        return data.client_id
            ? initialProjects.filter(project => project?.client?.id === data.client_id)
            : initialProjects;
    }, [initialProjects, data.client_id]);

    const filteredTasks = useMemo(() => {
        return data.project_id
            ? initialTasks.filter(task => task?.project?.id === data.project_id)
            : data.client_id
                ? initialTasks.filter(task => task?.client?.id === data.client_id)
                : initialTasks;
    }, [initialTasks, data.client_id, data.project_id])

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        submit();
    }, [data.date, data.client_id, data.project_id, data.task_id])

    const handleDateRangePickerChange = (date: [Date, Date] | null) => {
        setData('date', date);
    }

    const handleClientChange = (client: Client | null) => {
        setData(prev => ({
            ...prev,
            client_id: client?.id ?? null,
            project_id: null,
            task_id: null
        }))
    }

    const handleProjectChange = (project: Project | null) => {
        setData(prev => ({
            ...prev,
            client_id: project?.client?.id ?? prev.client_id,
            project_id: project?.id ?? null,
            task_id: null,
        }));
    }

    const handleTaskChange = (task: Task | null) => {
        setData(prev => ({
            ...prev,
            client_id: task?.client?.id ?? prev.client_id,
            project_id: task?.project?.id ?? prev.project_id,
            task_id: task?.id ?? null
        }));
    }

    const submit = (): void => {
        const dateRange = data.date ? {
            start: formatToLocalISO(data.date[0]),
            end: formatToLocalISO(data.date[1])
        } : null;

        router.get(route('reports.index'), {
            date_range: dateRange,
            client_id: data.client_id,
            project_id: data.project_id,
            task_id: data.task_id
        }, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    return (
        <form>
            <div className="grid gap-5
                            sm:grid-cols-2
                            xl:grid-cols-[minmax(200px,300px)_minmax(200px,300px)_minmax(200px,300px)_minmax(200px,300px)]">
                <div className="">
                    <DateRangePicker
                        placeholder="Select Date Range"
                        showOneCalendar={true}
                        character=" - "
                        onChange={(value) => handleDateRangePickerChange(value)}
                        value={data.date}
                        className="w-full"
                        name="date"
                    />
                </div>
                <div className="grid gap-2">
                    <SelectWrapper
                        options={initialClients}
                        value={selectedClient}
                        onChange={handleClientChange}
                        getOptionLabel={c => c.name}
                        getOptionValue={c => String(c.id)}
                        placeholder="Select client"
                    />
                    <InputError message={errors.client_id} />
                </div>
                <div className="grid gap-2 ">
                    <SelectWrapper
                        options={filteredProjects}
                        value={selectedProject}
                        onChange={handleProjectChange}
                        getOptionLabel={c => c.name}
                        getOptionValue={c => String(c.id)}
                        placeholder="Select project"
                    />
                    <InputError message={errors.project_id} />
                </div>
                <div className="grid gap-2 relative">
                    <SelectWrapper
                        options={filteredTasks}
                        value={selectedTask}
                        onChange={handleTaskChange}
                        getOptionLabel={c => c.name}
                        getOptionValue={c => String(c.id)}
                        placeholder="Select Task"
                    />
                    <InputError message={errors.task_id} />
                </div>
            </div>
        </form>
    )
}