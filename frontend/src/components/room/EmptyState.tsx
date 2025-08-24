import { ReactNode } from 'react';

interface EmptyStateProps {
    title: string;
    subtitle?: string;
    action?: ReactNode;
    className?: string;
}

export default function EmptyState({ title, subtitle, action, className = '' }: EmptyStateProps) {
    return (
        <div className={`bg-surface border border-border rounded-2xl p-8 text-center ${className}`}>
            <h3 className="text-lg font-semibold text-text">{title}</h3>
            {subtitle && <p className="mt-1 text-text-muted">{subtitle}</p>}
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}