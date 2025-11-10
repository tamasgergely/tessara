import { useState } from 'react';
import type { Project, Client, Task } from '@/types';

interface UseTaskFormOptions {
    projects: Project[];
    setData: (key: string, value: any) => void;
    initialProjectSelectDisabled?: boolean;
    initialClientSelectDisabled?: boolean;
}

export function useTaskForm({ projects, setData, initialProjectSelectDisabled = false, initialClientSelectDisabled = false }: UseTaskFormOptions) {

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [isProjectSelectDisabled, setIsProjectSelectDisabled] = useState<boolean>(initialProjectSelectDisabled);
    const [isClientSelectDisabled, setIsClientSelectDisabled] = useState<boolean>(initialClientSelectDisabled);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

    const handleProjectChange = (project: Project | null) => {
        setSelectedProject(project);
        setData('project_id', project?.id ?? null);

        const client = project?.client || null;
        setSelectedClient(client);
        setData('client_id', client?.id || null);

        setIsClientSelectDisabled(!!project);

        if (!client && !project) {
            setFilteredProjects(projects);
        }
    };

    const handleClientChange = (client: Client | null) => {
        setSelectedClient(client);
        setData('client_id', client?.id ?? null);
        setFilteredProjects(client ? projects.filter(project => project.client?.id === client.id) : projects)
    };

    const resetForm = () => {
        resetSelects();
        disableSelects();
    };

    const resetSelects = () => {
        setSelectedProject(null);
        setSelectedClient(null);
        setFilteredProjects(projects);
    }

    const enableSelects = () => {
        setIsProjectSelectDisabled(false);
        setIsClientSelectDisabled(false);
    };

    const disableSelects = () => {
        setIsProjectSelectDisabled(true);
        setIsClientSelectDisabled(true);
    };

    const applyTaskContext = (selectedTask?: Task) => {
        const project = selectedTask?.project ?? null;
        const client = selectedTask?.client ?? null;

        setSelectedProject(project);
        setSelectedClient(client);

        setData('project_id', project?.id ?? null);
        setData('client_id', client?.id ?? null);

        setFilteredProjects(projects.filter(project => project.client?.id === client?.id));

        disableSelects();
    }

    return {
        // State
        selectedProject,
        selectedClient,
        isProjectSelectDisabled,
        isClientSelectDisabled,
        filteredProjects,

        // Handlers
        handleProjectChange,
        handleClientChange,

        // Helpers
        resetForm,
        resetSelects,
        enableSelects,
        disableSelects,
        applyTaskContext,

        // Setters (ha kell külső hozzáférés)
        setSelectedProject,
        setSelectedClient,
        setIsProjectSelectDisabled,
        setIsClientSelectDisabled,
        setFilteredProjects,
    };

}