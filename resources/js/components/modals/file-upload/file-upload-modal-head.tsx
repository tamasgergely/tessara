import { Project } from "@/types";

type FileUploadModalHeadProps = {
    activeTab: 'files' | 'upload',
    project: Project
}

export default function FileUploadModalHead({ activeTab, project }: FileUploadModalHeadProps) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-gray-800">
            <div>
                <h2 className="text-3xl">
                    {activeTab === 'files' ? 'Project Files' : 'Upload Files'}
                </h2>
                <p className="text-sm text-foreground mt-1">
                    {project?.name}
                </p>
            </div>
        </div>
    );
}
