import { useState } from 'react';
import type { Project, Client, Task } from '@/types';

interface UseTaskFormOptions {
    projects: Project[];
    setData: (key: string, value: any) => void;
}

export function useTaskForm({ projects, setData }: UseTaskFormOptions) {

    const [selectedProject, setSelectedProject] = useState<Project | null>(null);
    const [selectedClient, setSelectedClient] = useState<Client | null>(null);
    const [filteredProjects, setFilteredProjects] = useState<Project[]>(projects);

    const handleProjectChange = (project: Project | null) => {
        setSelectedProject(project);
        setData('project_id', project?.id ?? null);

        const client = project?.client || null;
        setSelectedClient(client);
        setData('client_id', client?.id || null);

        if (!client && !project) {
            setFilteredProjects(projects);
        }
    };

    const handleClientChange = (client: Client | null) => {
        setSelectedClient(client);
        setData('client_id', client?.id ?? null);

        const projectFitsClient = selectedProject?.client?.id === client?.id;

        if (!projectFitsClient) {
            setSelectedProject(null);
            setData('project_id', null);
        }

        setFilteredProjects(client ? projects.filter(p => p.client?.id === client.id) : projects);
    };

    const resetSelects = () => {
        setSelectedProject(null);
        setSelectedClient(null);
        setFilteredProjects(projects);
    }

    const applyTaskContext = (selectedTask?: Task) => {
        const project = projects.find(p => p.id === selectedTask?.project?.id) ?? null;
        const client = selectedTask?.client ?? null;

        setSelectedProject(project);
        setSelectedClient(client);

        setData('project_id', project?.id ?? null);
        setData('client_id', client?.id ?? null);

        setFilteredProjects(projects.filter(project => project.client?.id === client?.id));
    }

    return {
        // State
        selectedProject,
        selectedClient,
        filteredProjects,

        // Handlers
        handleProjectChange,
        handleClientChange,

        // Helpers
        resetSelects,
        applyTaskContext,

        // Setters (ha kell külső hozzáférés)
        setSelectedProject,
        setSelectedClient,
        setFilteredProjects,
    };

}