interface SubmitButtonProps {
    children?: React.ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function SubmitButton({
    children = 'Submit',
    className = '',
    onClick
}: SubmitButtonProps) {
    return (
        <button
            type="submit"
            onClick={onClick}
            className={`w-full px-4 py-2 rounded-lg bg-accent text-surface hover:bg-accent-dark transition ${className}`}
        >
            {children}
        </button>
    );
}  