import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
    subsets: ["latin"],
    variable: "--font-inter",
    display: "swap"
});

export const metadata: Metadata = {
    title: "Shikkhok Pro — AI-Powered Question Paper Generator for Bangladesh",
    description:
        "Create perfect exam question papers with AI. Built for Bangladesh NCTB curriculum — Classes 1-10, SSC & HSC. Secure question banks, social sharing, and organization management.",
    keywords: [
        "question paper generator",
        "AI exam questions",
        "Bangladesh education",
        "NCTB curriculum",
        "teacher platform",
        "SSC HSC questions"
    ],
    openGraph: {
        title: "Shikkhok Pro — AI-Powered Question Paper Generator",
        description:
            "Generate perfect NCTB-aligned exam papers in minutes. Secure question banks for every Bangladesh school.",
        type: "website"
    }
};

export default function RootLayout({
    children
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en" className="dark">
            <body className={`${inter.variable} antialiased`}>
                <ClerkProvider
                    appearance={{
                        baseTheme: dark
                    }}
                >
                    {children}
                </ClerkProvider>
            </body>
        </html>
    );
}
