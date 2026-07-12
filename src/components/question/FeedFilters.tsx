// src/components/question/FeedFilters.tsx
"use client";

interface Filters {
  subject: string;
  className: string;
  difficulty: string;
}

interface Props {
  filters: Filters;
  onChange: (key: keyof Filters, value: string) => void;
}

const SUBJECTS = [
  "All",
  "Mathematics",
  "Physics",
  "Chemistry",
  "Biology",
  "Science",
  "English",
  "Bangla",
  "ICT",
];
const CLASSES = [
  "All",
  "Class 6",
  "Class 7",
  "Class 8",
  "Class 9",
  "Class 10",
  "Class 11",
  "Class 12",
];
const DIFFICULTIES = ["All", "Easy", "Normal", "Hard"];

function FilterPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-150 ${
        active
          ? "bg-indigo-500 text-white"
          : "text-slate-400 hover:text-white border border-white/10 hover:border-white/20"
      }`}
      style={{ background: active ? undefined : "var(--bg-card)" }}
    >
      {label}
    </button>
  );
}

export default function FeedFilters({ filters, onChange }: Props) {
  return (
    <div className="space-y-3">
      {/* Subject */}
      <div>
        <p
          className="text-xs font-semibold mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          SUBJECT
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {SUBJECTS.map((s) => (
            <FilterPill
              key={s}
              label={s}
              active={filters.subject === (s === "All" ? "" : s)}
              onClick={() => onChange("subject", s === "All" ? "" : s)}
            />
          ))}
        </div>
      </div>

      {/* Class */}
      <div>
        <p
          className="text-xs font-semibold mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          CLASS
        </p>
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {CLASSES.map((c) => (
            <FilterPill
              key={c}
              label={c}
              active={filters.className === (c === "All" ? "" : c)}
              onClick={() => onChange("className", c === "All" ? "" : c)}
            />
          ))}
        </div>
      </div>

      {/* Difficulty */}
      <div>
        <p
          className="text-xs font-semibold mb-2"
          style={{ color: "var(--text-muted)" }}
        >
          DIFFICULTY
        </p>
        <div className="flex gap-2">
          {DIFFICULTIES.map((d) => (
            <FilterPill
              key={d}
              label={d}
              active={
                filters.difficulty === (d === "All" ? "" : d.toUpperCase())
              }
              onClick={() =>
                onChange("difficulty", d === "All" ? "" : d.toUpperCase())
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
