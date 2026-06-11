import { StickyNote, NotepadText, Users } from 'lucide-react';

type TimerProjectInfoProps = {
    projectName: string,
    clientName?: string | null,
    taskName?: string | null
}

export default function TimerProjectInfo({ projectName, clientName, taskName }: TimerProjectInfoProps) {
    return (
        <div className="grid gap-1">
            {taskName &&
                <div className="flex items-center font-bold text-primary">
                    <StickyNote height={16} className="shrink-0" />
                    {taskName}
                </div>
            }

            <div className="flex text-muted-foreground text-xs flex-wrap gap-2">
                {projectName &&
                    <div className="flex items-center">
                        <NotepadText height={16} className="shrink-0" />
                        {projectName}
                    </div>
                }
                {clientName &&
                    <div className="flex items-center">
                        <Users height={16} className="shrink-0" />
                        {clientName}
                    </div>
                }
            </div>
        </div>

    )
}