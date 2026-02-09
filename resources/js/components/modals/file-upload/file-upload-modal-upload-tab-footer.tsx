export default function FileUploadModalUploadTabFooter() {
    return (
        <div className="p-6 border-t border-border dark:border-gray-800">
            {step === 1 ? (
                <div className="flex justify-between items-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={closeModal}
                    >
                        Cancel
                    </Button>
                    <Button
                        size="lg"
                        disabled={data.files.length === 0}
                        onClick={handleContinue}>
                        Continue
                        <ChevronRight className="h-4 w-4" />
                    </Button>
                </div>
            ) : (
                <div className="flex justify-between items-center">
                    <Button
                        type="button"
                        variant="ghost"
                        size="lg"
                        onClick={handleBack}
                    >
                        <ChevronLeft className="h-4 w-4" />
                        Back
                    </Button>
                    <div className="flex gap-3">
                        <Button
                            size="lg"
                            type="submit"
                            disabled={data.files.length === 0}
                            onClick={handleUpload}
                        >
                            Upload
                            <Upload className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>

    );
}