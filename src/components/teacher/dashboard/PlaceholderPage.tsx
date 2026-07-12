import React from "react";

export default function PlaceholderPage({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="text-sm text-[var(--text-muted)] mt-2">{description}</p>
      </div>
    </main>
  );
}
