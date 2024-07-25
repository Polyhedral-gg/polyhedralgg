import Link from "next/link";
import { MainNav } from "./main-nav";
import { twMerge } from "tailwind-merge";
import { buttonVariants } from "./ui/button";
import { clsx } from "clsx";
import { ModeToggle } from "./mode-toggle";
import { DiscordLogoIcon, GitHubLogoIcon } from "@radix-ui/react-icons";
import { cn } from "~/lib/utils";

export function SiteHeader() {
    return (
        <header className="sticky top-0 z-50 w-full border-border/40 bg-background/95 backdrop-blur">
            <div className="container flex h-14 max-w-screen-2xl items-center">
                <MainNav />
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <nav className="flex items-center">
                        <div className="px-4 underline">
                            <Link href="https://discord.com/oauth2/authorize?client_id=1248697940122402868">
                                Add to Discord!
                            </Link>
                        </div>
                        <Link href="https://github.com/Polyhedral-gg">
                            <div className={cn(buttonVariants({ variant: "ghost" }), "h-8 w-8 px-0")}>
                                <GitHubLogoIcon className="h-5 w-5" />
                            </div>
                        </Link>
                        <Link href="https://discord.gg/3HNFghAfCU">
                            <div className={twMerge(clsx(buttonVariants({ variant: "ghost" }), "h-8 w-8 px-0"))}>
                                <DiscordLogoIcon className="h-5 w-5" />
                            </div>
                        </Link>
                        <ModeToggle />
                    </nav>
                </div>
            </div>
        </header>
    );
}
