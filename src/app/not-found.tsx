import Link from "next/link";
import { FrownIcon } from "lucide-react";

export default function NotFound() {
    return (
        <main className="flex grow flex-col items-center justify-center bg-gradient-to-b from-[#0066cc] to-[#15162c] text-white">
            <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16">
                <h2 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
                    <span className="text-mainorange">404</span>
                    &nbsp;Not Found
                </h2>
                <p className="text-4xl font-extrabold">Could not find the requested resource</p>
            </div>
        </main>
    );
}
