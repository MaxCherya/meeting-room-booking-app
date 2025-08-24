interface GeneralButtonProps {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
    className?: string;
}

export default function GeneralButton({
    children,
    onClick,
    type = 'button',
    className = '',
}: GeneralButtonProps) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`px-4 py-2 rounded-lg bg-primary text-surface hover:bg-primary-dark transition ${className}`}
        >
            {children}
        </button>
    );
}  