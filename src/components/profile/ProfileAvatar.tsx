// src/components/profile/ProfileAvatar.tsx
// ---------------------------------------------------------------
// Avatar display + upload button (edit mode only)
// ---------------------------------------------------------------
"use client";

import Image from "next/image";
import { useRef } from "react";
import { HiCamera } from "react-icons/hi2";
import { cn } from "@/lib/utils";

interface ProfileAvatarProps {
  src: string | null;
  displayName: string;
  size?: number;
  editable?: boolean;
  uploading?: boolean;
  onFileSelect?: (file: File) => void;
}

export function ProfileAvatar({
  src,
  displayName,
  size = 96,
  editable = false,
  uploading = false,
  onFileSelect,
}: ProfileAvatarProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const initials = displayName
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileSelect) onFileSelect(file);
    // reset input so same file can be re-selected
    e.target.value = "";
  };

  return (
    <div
      className="relative flex-shrink-0"
      style={{ width: size, height: size }}
    >
      {src ? (
        <Image
          src={src}
          alt={displayName}
          width={size}
          height={size}
          className="rounded-full object-cover ring-2 ring-white/10"
          style={{ width: size, height: size }}
        />
      ) : (
        <div
          className="rounded-full bg-indigo-600/30 ring-2 ring-white/10 flex items-center justify-center text-indigo-300 font-bold select-none"
          style={{ width: size, height: size, fontSize: size * 0.35 }}
        >
          {initials || "?"}
        </div>
      )}

      {editable && (
        <>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className={cn(
              "absolute inset-0 rounded-full flex items-center justify-center",
              "bg-black/50 opacity-0 hover:opacity-100 transition-opacity duration-200",
              uploading && "opacity-100 cursor-wait"
            )}
            aria-label="Change avatar"
          >
            {uploading ? (
              <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
            ) : (
              <HiCamera size={size * 0.25} className="text-white" />
            )}
          </button>
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            className="hidden"
            onChange={handleChange}
          />
        </>
      )}
    </div>
  );
}
