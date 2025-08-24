import { ReactNode } from "react";

interface ListCardProps {
    title?: string;
    children: ReactNode;
    footer?: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function ListCard({
    title,
    children,
    footer,
    className = "",
    onClick,
}: ListCardProps) {
    return (
        <div
            onClick={onClick}
            className={`bg-surface border border-border rounded-xl shadow-sm hover:shadow-md transition cursor-pointer ${className}`}
        >
            {/* Header */}
            {title && (
                <div className="px-4 py-3 border-b border-border text-text font-semibold text-lg">
                    {title}
                </div>
            )}

            {/* Body */}
            <div className="p-4 text-text">{children}</div>

            {/* Footer */}
            {footer && (
                <div className="px-4 py-3 border-t border-border text-sm text-text-muted">
                    {footer}
                </div>
            )}
        </div>
    );
}