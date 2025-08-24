import { Logo } from "../landing/Logo";

export function SiteFooter() {
    return (
        <footer className="border-t border-border">
            <div className="mx-auto max-w-6xl px-4 py-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-center gap-2">
                    <Logo />
                    <span className="font-semibold">MRBA</span>
                    <span className="text-text-muted text-sm">© {new Date().getFullYear()}</span>
                </div>

                <ul className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
                    <li><a className="hover:text-primary" href="#features">Features</a></li>
                    <li><a className="hover:text-primary" href="#how">How it works</a></li>
                    <li><a className="hover:text-primary" href="#cta">Get started</a></li>
                    <li><a className="hover:text-primary" href="mailto:hello@example.com">Contact</a></li>
                </ul>
            </div>
        </footer>
    );
}