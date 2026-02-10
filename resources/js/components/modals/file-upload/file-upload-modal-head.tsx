type FileUploadModalHeadProps<T extends {name: string}> = {
    activeTab: 'files' | 'upload',
    item: T
}

export default function FileUploadModalHead<T extends {name: string}>({ activeTab, item }: FileUploadModalHeadProps<T>) {
    return (
        <div className="flex items-center justify-between p-6 border-b border-border dark:border-gray-800">
            <div>
                <h2 className="text-3xl">
                    {activeTab === 'files' ? 'Uploaded Files' : 'Upload Files'}
                </h2>
                {item?.name &&
                    <p className="text-sm text-foreground mt-1">
                        {item?.name}
                    </p>
                }
            </div>
        </div>
    );
}
