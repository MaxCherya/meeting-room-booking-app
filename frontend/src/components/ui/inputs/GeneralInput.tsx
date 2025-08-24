interface GeneralInputProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value?: string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export default function GeneralInput({
    id,
    label,
    type = 'text',
    placeholder = '',
    value,
    onChange,
    className = '',
}: GeneralInputProps) {
    return (
        <div className={`space-y-1 ${className}`}>
            <label
                htmlFor={id}
                className="block text-sm font-medium text-text"
            >
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
    );
}  