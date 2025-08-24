interface CancelButtonProps {
    children?: React.ReactNode;
    onClick?: () => void;
    className?: string;
}

export default function CancelButton({
    children = 'Cancel',
    onClick,
    className = '',
}: CancelButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`px-4 py-2 rounded-lg bg-border text-text hover:bg-text-muted hover:text-surface transition ${className}`}
        >
            {children}
        </button>
    );
}  