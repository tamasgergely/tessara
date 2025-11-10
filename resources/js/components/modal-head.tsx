export default function ModalHead({ title }: { title: string }) {
    return (
        <div className="border-b dark:border-gray-500 p-5">
            <h2 className="text-3xl">
                {title}
            </h2>
        </div>

    );
}