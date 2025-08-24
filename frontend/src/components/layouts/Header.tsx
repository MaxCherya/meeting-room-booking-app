import Link from "next/link";
import GeneralButton from "../ui/bnts/GeneralButton";
import { Logo } from "../landing/Logo";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur border-b border-border">
            <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Logo />
                    <span className="font-semibold">MRBA</span>
                </Link>

                <nav className="hidden md:flex items-center gap-6 text-sm">
                    <a href="#features" className="hover:text-primary">Features</a>
                    <a href="#how" className="hover:text-primary">How it works</a>
                    <a href="#cta" className="hover:text-primary">Get started</a>
                </nav>

                <div className="flex items-center gap-3">
                    <Link href="/login" className="px-4 py-2 rounded-xl border border-border hover:bg-border">
                        Sign in
                    </Link>
                    <Link href="/register">
                        <GeneralButton className="!px-4">Create account</GeneralButton>
                    </Link>
                </div>
            </div>
        </header>
    );
}
