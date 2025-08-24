import Link from "next/link";
import GeneralButton from "../ui/bnts/GeneralButton";

export function CTA() {
    return (
        <section id="cta" className="mx-auto max-w-6xl px-4 py-16 md:py-20">
            <div className="rounded-3xl border border-border bg-gradient-to-br from-primary/10 via-accent/10 to-primary/10 p-8 md:p-12">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                    <div>
                        <h3 className="text-2xl md:text-3xl font-semibold">
                            Start booking rooms the easy way
                        </h3>
                        <p className="text-text-muted mt-2">
                            Set up your workspace, invite teammates, and create your first booking in minutes.
                        </p>
                    </div>
                    <div className="flex md:justify-end gap-3">
                        <Link href="/register">
                            <GeneralButton className="!px-6 !py-3 text-base">
                                Create free account
                            </GeneralButton>
                        </Link>
                        <Link
                            href="/login"
                            className="px-6 py-3 rounded-xl border border-border bg-surface hover:bg-border"
                        >
                            Sign in
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
}