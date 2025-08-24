import { ReactNode } from "react";

interface GeneralModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: ReactNode;
}

export default function GeneralModal({
    isOpen,
    onClose,
    title,
    children,
}: GeneralModalProps) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            {/* Modal content */}
            <div className="w-full max-w-lg bg-surface rounded-2xl shadow-xl p-6 relative">
                {/* Close button (X) */}
                <button
                    onClick={onClose}
                    className="absolute top-3 right-3 text-text-muted hover:text-text transition"
                    aria-label="Close modal"
                >
                    ✕
                </button>

                {/* Title */}
                {title && (
                    <h2 className="text-xl font-semibold text-text mb-4">{title}</h2>
                )}

                {/* Body */}
                <div>{children}</div>
            </div>
        </div>
    );
}