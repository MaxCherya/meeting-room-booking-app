import Link from "next/link";
import GeneralButton from "../ui/bnts/GeneralButton";
import Image from "next/image";

export function Hero() {
    return (
        <section className="relative overflow-hidden">
            <div className="mx-auto max-w-6xl px-4 py-16 md:py-24 grid md:grid-cols-2 gap-10 items-center">
                <div>
                    <span className="inline-block text-xs uppercase tracking-wider text-text-muted mb-2">
                        Meeting Room Booking App
                    </span>
                    <h1 className="text-4xl md:text-5xl font-semibold leading-tight">
                        Book rooms in seconds. <br />
                        <span className="text-primary">No double bookings.</span>
                    </h1>
                    <p className="text-text-muted mt-4">
                        Create rooms, manage members with roles, and schedule conflict‑free bookings —
                        all in a clean, simple interface.
                    </p>

                    <div className="mt-6 flex flex-col sm:flex-row gap-3">
                        <Link href="/register">
                            <GeneralButton className="w-full sm:w-auto !px-6 !py-3 text-base">
                                Get Started — it’s free
                            </GeneralButton>
                        </Link>
                        <a
                            href="#features"
                            className="w-full sm:w-auto px-6 py-3 rounded-xl border border-border hover:bg-border text-center"
                        >
                            See features
                        </a>
                    </div>

                    <ul className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-text-muted">
                        <li>✓ Role-based access</li>
                        <li>✓ PostgreSQL + Sequelize</li>
                        <li>✓ JWT auth + refresh</li>
                        <li>✓ Next.js + React Query</li>
                    </ul>
                </div>

                <div className="relative">
                    <div className="rounded-2xl border border-border bg-surface shadow-xl overflow-hidden">
                        {/* Placeholder app preview — replace with a real screenshot when ready */}
                        <div className="aspect-[16/10] relative">
                            <Image
                                src="https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=1600&auto=format&fit=crop"
                                alt="Meeting room"
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>
                        <div className="p-4 border-t border-border">
                            <p className="text-sm text-text-muted">Simple, fast, and conflict‑aware booking UI.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* subtle background accent */}
            <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        </section>
    );
}