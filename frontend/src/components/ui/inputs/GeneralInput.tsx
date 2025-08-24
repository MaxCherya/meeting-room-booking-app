import { useEffect, useState } from "react";

interface GeneralInputProps {
    id: string;
    label: string;
    type?: string;
    placeholder?: string;
    value?: string | number | undefined;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
    debounceDelay?: number; // ms
}

export default function GeneralInput({
    id,
    label,
    type = "text",
    placeholder = "",
    value,
    onChange,
    className = "",
    debounceDelay = 0,
}: GeneralInputProps) {
    const [internalValue, setInternalValue] = useState(value ?? "");

    useEffect(() => {
        setInternalValue(value ?? "");
    }, [value]);

    // debounce logic
    useEffect(() => {
        if (!onChange || debounceDelay <= 0) return;
        const handler = setTimeout(() => {
            // fake event to satisfy original onChange signature
            onChange({ target: { value: internalValue } } as React.ChangeEvent<HTMLInputElement>);
        }, debounceDelay);

        return () => clearTimeout(handler);
    }, [internalValue, debounceDelay, onChange]);

    return (
        <div className={`space-y-1 ${className}`}>
            <label htmlFor={id} className="block text-sm font-medium text-text">
                {label}
            </label>
            <input
                id={id}
                type={type}
                value={internalValue}
                placeholder={placeholder}
                onChange={(e) => {
                    if (debounceDelay > 0) {
                        setInternalValue(e.target.value);
                    } else {
                        onChange?.(e);
                    }
                }}
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-text 
                   focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
    );
}