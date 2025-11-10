import { FolderKanban, User, StickyNote } from 'lucide-react';

export default function TimerProjectInfo({ projectName, clientName, taskName }: { projectName: string, clientName?: string | null, taskName?: string | null }) {
    return (
        <div className="mb-3 grid gap-1">
            {taskName &&
                <div className="flex gap-1 items-center font-bold text-primary">
                    <StickyNote height={16} />
                    {taskName}
                </div>
            }
            {projectName &&
                <div className="flex gap-1 items-center">
                    <FolderKanban height={16} />
                    {projectName}
                </div>
            }
            {clientName &&
                <div className="flex gap-1 items-center">
                    <User height={16} />
                    {clientName}
                </div>
            }
        </div>

    )
}