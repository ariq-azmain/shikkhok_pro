// src/components/explore/SearchBar.tsx
"use client";

import { Search } from "lucide-react";

/**
 * Renders a controlled search input with an inline search icon.
 *
 * @param value - Current input text shown in the field.
 * @param onChange - Callback invoked with the updated input string when the user types.
 * @param placeholder - Optional placeholder text shown when `value` is empty; defaults to `"Search..."`.
 * @returns The rendered search input element (JSX).
 */
export default function SearchBar({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div className="w-full">
      <div className="flex items-center gap-2 rounded-xl border border-white/5 px-3 py-2" style={{ background: "var(--bg-card)" }}>
        <Search size={16} className="text-slate-400" />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent outline-none text-sm"
        />
      </div>
    </div>
  );
}
