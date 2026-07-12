"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

import { NAV_ITEMS } from "@/constants";
import { HiMenuAlt3, HiX } from "react-icons/hi";
import { RiBookOpenLine } from "react-icons/ri";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(8, 8, 17, 0.92)" : "rgba(8, 8, 17, 0.0)",
        backdropFilter: scrolled ? "blur(16px)" : "none",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
      }}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <Image src="/icons/icon-2.png" height={36} width={36} />
          <span className="text-xl font-bold tracking-tight">
            <span className="text-white">Shikkhok</span>
            <span
              style={{
                background: "linear-gradient(135deg, #818cf8 0%, #a855f7 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              {" "}
              Pro
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-8">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm transition-colors duration-200"
              style={{ color: "rgba(148,163,184,1)" }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.color = "rgba(241,245,249,1)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.color = "rgba(148,163,184,1)")
              }
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* CTA Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/sign-in"
            className="text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-200"
            style={{ color: "rgba(148,163,184,1)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.color = "rgba(241,245,249,1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "rgba(148,163,184,1)")
            }
          >
            Sign In
          </Link>
          <Link
            href="/sign-up"
            className="text-sm px-5 py-2 rounded-lg font-semibold text-white transition-all duration-200 hover:opacity-90"
            style={{
              background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            }}
          >
            Get Started Free
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <HiX className="text-xl" />
          ) : (
            <HiMenuAlt3 className="text-xl" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden border-t px-6 py-4 flex flex-col gap-4"
          style={{
            borderColor: "rgba(255,255,255,0.06)",
            background: "rgba(8,8,17,0.96)",
          }}
        >
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-slate-400 hover:text-white transition-colors py-2"
              onClick={() => setMobileOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <div
            className="flex flex-col gap-2 pt-2 border-t"
            style={{ borderColor: "rgba(255,255,255,0.06)" }}
          >
            <Link
              href="/sign-in"
              className="text-sm text-center py-2 px-4 rounded-lg text-slate-300 hover:text-white border transition-colors"
              style={{ borderColor: "rgba(255,255,255,0.1)" }}
            >
              Sign In
            </Link>
            <Link
              href="/sign-up"
              className="text-sm text-center py-2 px-4 rounded-lg font-semibold text-white"
              style={{
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
              }}
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
