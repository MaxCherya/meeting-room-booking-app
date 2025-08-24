interface SubmitButtonProps {
    children?: React.ReactNode;
    className?: string;
}

export default function SubmitButton({
    children = 'Submit',
    className = '',
}: SubmitButtonProps) {
    return (
        <button
            type="submit"
            className={`w-full px-4 py-2 rounded-lg bg-accent text-surface hover:bg-accent-dark transition ${className}`}
        >
            {children}
        </button>
    );
}  