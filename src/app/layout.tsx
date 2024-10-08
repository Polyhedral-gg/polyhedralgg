import "~/styles/globals.css";

import { GeistSans } from "geist/font/sans";

import { TRPCReactProvider } from "~/trpc/react";
import { SiteHeader } from "~/components/site-header";
import { type Viewport, type Metadata } from "next";
import { ThemeProvider } from "~/components/theme-provider";
import { SiteFooter } from "~/components/site-footer";

export const metadata: Metadata = {
    title: "Polyhedral.gg",
    description: "Polyhedral.gg is a site and Discord integration to make playing TTRPGs online easier.",
    icons: [{ rel: "icon", url: "/favicon.ico" }],
    openGraph: {
        title: "Polyhedral.gg",
        description: "Polyhedral.gg is a site and Discord integration to make playing TTRPGs online easier.",
        url: "https://polyhedral.gg",
        siteName: "Polyhedral.gg",
        images: [
            {
                url: "https://polyhedral.gg/favicon.ico",
            },
        ],
        locale: "en_US",
        type: "website",
    },
};

export const viewport: Viewport = {
    themeColor: "#0066cc",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${GeistSans.variable}`}>
            <body>
                <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
                    <div className="flex min-h-screen flex-col">
                        <SiteHeader />
                        <TRPCReactProvider>
                            <main className="flex grow flex-col items-center justify-center bg-gradient-to-b from-[#0066cc] to-[#15162c]">
                                {children}
                            </main>
                        </TRPCReactProvider>
                        <SiteFooter />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
