"use client";

import Link from "next/link";
import Image from "next/image";

import {
    RiBookOpenLine,
    RiGithubLine,
    RiFacebookLine,
    RiTwitterXLine
} from "react-icons/ri";
import { FOOTER_LINKS } from "@/constants";

export default function Footer() {
    return (
        <footer
            className="relative pt-16 pb-8 px-6"
            style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}
        >
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
                    {/* Brand */}
                    <div className="col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Image
                                src="/icons/icon-2.png"
                                height={36}
                                width={36}
                            />

                            <span className="text-xl font-bold">
                                <span className="text-white">Shikkhok</span>
                                <span
                                    style={{
                                        background:
                                            "linear-gradient(135deg, #818cf8 0%, #a855f7 100%)",
                                        WebkitBackgroundClip: "text",
                                        WebkitTextFillColor: "transparent",
                                        backgroundClip: "text"
                                    }}
                                >
                                    {" "}
                                    Pro
                                </span>
                            </span>
                        </Link>
                        <p
                            className="text-sm mb-5 leading-relaxed"
                            style={{ color: "#475569" }}
                        >
                            AI-powered question paper generation for Bangladesh
                            teachers. Built for NCTB curriculum.
                        </p>
                        <div className="flex items-center gap-3">
                            {[
                                {
                                    icon: RiFacebookLine,
                                    href: "#",
                                    label: "Facebook"
                                },
                                {
                                    icon: RiTwitterXLine,
                                    href: "#",
                                    label: "Twitter"
                                },
                                {
                                    icon: RiGithubLine,
                                    href: "#",
                                    label: "GitHub"
                                }
                            ].map(({ icon: Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    aria-label={label}
                                    className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                                    style={{
                                        background: "rgba(255,255,255,0.04)",
                                        border: "1px solid rgba(255,255,255,0.08)",
                                        color: "#475569"
                                    }}
                                    onMouseEnter={e => {
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.color = "#94a3b8";
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.borderColor =
                                            "rgba(255,255,255,0.12)";
                                    }}
                                    onMouseLeave={e => {
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.color = "#475569";
                                        (
                                            e.currentTarget as HTMLAnchorElement
                                        ).style.borderColor =
                                            "rgba(255,255,255,0.08)";
                                    }}
                                >
                                    <Icon className="text-base" />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Links */}
                    {Object.entries(FOOTER_LINKS).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="text-sm font-semibold text-white mb-4">
                                {category}
                            </h4>
                            <ul className="space-y-2.5">
                                {links.map(link => (
                                    <li key={link.label}>
                                        <Link
                                            href={link.href}
                                            className="text-sm transition-colors duration-150"
                                            style={{ color: "#475569" }}
                                            onMouseEnter={e =>
                                                (e.currentTarget.style.color =
                                                    "#94a3b8")
                                            }
                                            onMouseLeave={e =>
                                                (e.currentTarget.style.color =
                                                    "#475569")
                                            }
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom bar */}
                <div
                    className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
                    style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
                >
                    <p className="text-sm" style={{ color: "#334155" }}>
                        © {new Date().getFullYear()} Shikkhok Pro. Made with ❤️
                        for Bangladesh educators.
                    </p>
                    <p className="text-sm" style={{ color: "#334155" }}>
                        Powered by{" "}
                        <span style={{ color: "#6366f1" }}>Claude AI</span> ·{" "}
                        <span style={{ color: "#6366f1" }}>Stream Chat</span>
                    </p>
                </div>
            </div>
        </footer>
    );
}
