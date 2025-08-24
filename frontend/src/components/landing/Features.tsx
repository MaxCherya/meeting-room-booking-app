export function Features() {
    const items = [
        {
            title: 'Room management',
            desc: 'Create, edit, and remove rooms with capacity details and descriptions.',
            icon: '🏢',
        },
        {
            title: 'Smart booking',
            desc: 'Automatic time‑conflict checks — no overlapping bookings.',
            icon: '⏰',
        },
        {
            title: 'Roles & members',
            desc: 'Invite teammates by email with Admin/User roles per room.',
            icon: '🛡️',
        },
        {
            title: 'Secure auth',
            desc: 'JWT access + refresh tokens with CORS and httpOnly cookies.',
            icon: '🔐',
        },
    ];

    return (
        <section id="features" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="text-center mb-10">
                <h2 className="text-3xl font-semibold">Everything you need to stay organized</h2>
                <p className="text-text-muted mt-2">
                    Powerful features with a lightweight, modern UI.
                </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((it) => (
                    <div key={it.title} className="rounded-2xl border border-border bg-surface p-5 shadow-sm">
                        <div className="text-2xl">{it.icon}</div>
                        <h3 className="mt-3 font-medium">{it.title}</h3>
                        <p className="text-sm text-text-muted mt-1">{it.desc}</p>
                    </div>
                ))}
            </div>
        </section>
    );
}