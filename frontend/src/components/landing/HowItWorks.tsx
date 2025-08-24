export function HowItWorks() {
    const steps = [
        { n: 1, title: 'Register', desc: 'Create your account and sign in.' },
        { n: 2, title: 'Add rooms', desc: 'Create rooms and invite teammates by email.' },
        { n: 3, title: 'Book it', desc: 'Schedule meetings without conflicts.' },
        { n: 4, title: 'Collaborate', desc: 'Manage attendees and roles per room.' },
    ];
    return (
        <section id="how" className="bg-surface border-y border-border">
            <div className="mx-auto max-w-6xl px-4 py-16 md:py-20">
                <h2 className="text-3xl font-semibold text-center">How it works</h2>

                <div className="mt-10 grid md:grid-cols-4 gap-4">
                    {steps.map((s) => (
                        <div key={s.n} className="rounded-2xl border border-border p-5">
                            <div className="h-8 w-8 rounded-full bg-primary text-surface grid place-items-center font-semibold">
                                {s.n}
                            </div>
                            <h3 className="mt-3 font-medium">{s.title}</h3>
                            <p className="text-sm text-text-muted mt-1">{s.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}