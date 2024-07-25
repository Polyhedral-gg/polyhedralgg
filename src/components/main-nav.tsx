"use client";

import Link from "next/link";
// import { usePathname } from "next/navigation";
import { Icons } from "./icons";

export function MainNav() {
    // const pathname = usePathname();

    return (
        <div className="mr-4 hidden md:flex">
            <Link href="/" className="mr-4 flex items-center space-x-2 font-bold lg:mr-6">
                <Icons.logo className="h-6 w-6" />
                <span className="hidden text-mainorange lg:inline-block">Polyhedral</span>.gg
            </Link>
        </div>
    );
}
