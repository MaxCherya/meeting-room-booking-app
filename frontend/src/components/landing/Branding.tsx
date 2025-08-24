export function Brands() {
    return (
        <section className="border-y border-border bg-surface">
            <div className="mx-auto max-w-6xl px-4 py-10">
                <p className="text-center text-xs uppercase tracking-wider text-text-muted mb-6">
                    Works great for teams of any size
                </p>
                <div className="flex flex-wrap items-center justify-center gap-8 opacity-70">
                    <BrandDot />
                    <BrandDot />
                    <BrandDot />
                    <BrandDot />
                    <BrandDot />
                </div>
            </div>
        </section>
    );
}
export function BrandDot() {
    return <div className="h-8 w-8 rounded-full bg-border" />;
}
