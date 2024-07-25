import Link from "next/link";

export function SiteFooter() {
    return (
        <footer className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center">
                        <div className="px-2 underline">
                            <Link href="/tos">Terms of Service</Link>
                        </div>
                        <div className="px-2 underline">
                            <Link href="/privacy">Privacy Policy</Link>
                        </div>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
