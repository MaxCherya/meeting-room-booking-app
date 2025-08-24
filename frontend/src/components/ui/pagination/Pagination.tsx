interface PaginationProps {
    page: number;
    pages: number;
    onPageChange: (p: number) => void;
    className?: string;
}

export default function Pagination({
    page,
    pages,
    onPageChange,
    className = "",
}: PaginationProps) {
    if (pages <= 1) return null;

    const go = (p: number) => {
        if (p < 1 || p > pages || p === page) return;
        onPageChange(p);
    };

    const windowSize = 5; // how many numbers around current
    const start = Math.max(1, page - Math.floor(windowSize / 2));
    const end = Math.min(pages, start + windowSize - 1);
    const numbers: (number | "...")[] = [];

    if (start > 1) numbers.push(1);
    if (start > 2) numbers.push("...");

    for (let p = start; p <= end; p++) numbers.push(p);

    if (end < pages - 1) numbers.push("...");
    if (end < pages) numbers.push(pages);

    return (
        <nav className={`flex items-center flex-row align-middle justify-center gap-2 ${className}`} aria-label="Pagination">
            {/* Prev */}
            <button
                className="px-3 py-1.5 rounded-lg border border-border text-text hover:bg-border disabled:opacity-50"
                onClick={() => go(page - 1)}
                disabled={page <= 1}
            >
                Prev
            </button>

            {/* Numbers */}
            <ul className="flex items-center gap-1">
                {numbers.map((item, idx) =>
                    item === "..." ? (
                        <li key={`dots-${idx}`} className="px-2 text-text-muted select-none">…</li>
                    ) : (
                        <li key={item}>
                            <button
                                onClick={() => go(item)}
                                className={`min-w-[2.25rem] px-3 py-1.5 rounded-lg border transition
                    ${item === page
                                        ? "bg-primary text-surface border-primary"
                                        : "border-border text-text hover:bg-border"
                                    }`}
                            >
                                {item}
                            </button>
                        </li>
                    )
                )}
            </ul>

            {/* Next */}
            <button
                className="px-3 py-1.5 rounded-lg bg-primary text-surface hover:bg-primary-dark disabled:opacity-50"
                onClick={() => go(page + 1)}
                disabled={page >= pages}
            >
                Next
            </button>
        </nav>
    );
}  