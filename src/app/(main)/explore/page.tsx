// src/app/(main)/explore/page.tsx
"use client";

import { useMemo, useState } from "react";
import { Search, Loader2, AlertCircle, Inbox } from "lucide-react";
import QuestionCard from "@/components/question/QuestionCard";
import FeedFilters from "@/components/question/FeedFilters";
import { useQuestionFeed } from "@/hooks/useQuestionFeed";
import SearchBar from "@/components/explore/SearchBar";

interface Filters {
  subject: string;
  className: string;
  difficulty: string;
}

/**
 * Render a skeleton placeholder card that mimics the layout of a question item.
 *
 * The component uses layout blocks and pulse animation to indicate loading state.
 *
 * @returns A JSX element representing a skeleton card placeholder for question items
 */
function SkeletonCard() {
  return (
    <div className="rounded-2xl p-5 border border-white/5 animate-pulse" style={{ background: "var(--bg-card)" }}>
      <div className="flex items-center gap-3 mb-4">
        <div className="w-9 h-9 rounded-full bg-white/5" />
        <div className="flex-1 space-y-1.5">
          <div className="h-3 rounded bg-white/5 w-1/3" />
          <div className="h-2.5 rounded bg-white/5 w-1/5" />
        </div>
      </div>
      <div className="h-4 rounded bg-white/5 w-3/4 mb-2" />
      <div className="h-4 rounded bg-white/5 w-1/2 mb-4" />
      <div className="flex gap-2 mb-4">
        <div className="h-5 rounded-full bg-white/5 w-20" />
        <div className="h-5 rounded-full bg-white/5 w-16" />
        <div className="h-5 rounded-full bg-white/5 w-12" />
      </div>
      <div className="h-px bg-white/5 mb-3" />
      <div className="flex gap-4">
        <div className="h-3 rounded bg-white/5 w-10" />
        <div className="h-3 rounded bg-white/5 w-10" />
        <div className="h-3 rounded bg-white/5 w-10" />
      </div>
    </div>
  );
}

/**
 * Page component that displays a searchable and filterable feed of questions with infinite scroll.
 *
 * Renders a search bar, optional filter panel (subject, class, difficulty), client-side text filtering
 * over fetched questions, loading skeletons, error and empty states, question cards, and a sentinel
 * for loading additional pages.
 *
 * @returns The JSX element tree for the Explore page UI
 */
export default function ExplorePage() {
  const [filters, setFilters] = useState<Filters>({ subject: "", className: "", difficulty: "" });
  const [showFilters, setShowFilters] = useState(true);
  const [query, setQuery] = useState("");

  const { questions, loading, loadingMore, error, hasMore, setSentinel } = useQuestionFeed({
    subject: filters.subject,
    className: filters.className,
    difficulty: filters.difficulty,
  });

  function handleFilterChange(key: keyof Filters, value: string) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  // client-side search filter (title/content)
  const filtered = useMemo(() => {
    if (!query.trim()) return questions;
    const q = query.trim().toLowerCase();
    return questions.filter((item) => {
      const title = item.title?.toLowerCase() ?? "";
      const sectionsText = JSON.stringify(item.content || {}).toLowerCase();
      return title.includes(q) || sectionsText.includes(q);
    });
  }, [questions, query]);

  return (
    <main className="relative min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex-1">
            <SearchBar value={query} onChange={setQuery} placeholder="Search questions, topics or teachers" />
            <p className="text-sm mt-2" style={{ color: "var(--text-muted)" }}>
              Use filters to narrow results by subject, class and difficulty.
            </p>
          </div>
          <div>
            <button
              onClick={() => setShowFilters((v) => !v)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold border transition-all ${
                showFilters || activeFilterCount > 0
                  ? "border-indigo-500/50 text-indigo-400 bg-indigo-500/10"
                  : "border-white/10 hover:border-white/20"
              }`}
              style={{ color: showFilters || activeFilterCount > 0 ? undefined : "var(--text-secondary)" }}
            >
              Filters
              {activeFilterCount > 0 && (
                <span className="w-5 h-5 rounded-full bg-indigo-500 text-white text-xs flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="rounded-2xl p-4 mb-5 border border-white/5" style={{ background: "var(--bg-card)" }}>
            <FeedFilters filters={filters} onChange={handleFilterChange} />
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 rounded-xl mb-5 bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            <AlertCircle size={16} className="flex-shrink-0" />
            {error}
          </div>
        )}

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!loading && (
          <>
            {filtered.length === 0 ? (
              <div className="text-center py-20">
                <Inbox size={40} className="mx-auto mb-3 text-slate-600" />
                <p className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                  No results
                </p>
                <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
                  Try different keywords or filters
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filtered.map((q) => (
                  <QuestionCard key={q.id} question={q} />
                ))}
              </div>
            )}

            {/* Sentinel for infinite scroll */}
            {hasMore && (
              <div ref={setSentinel} className="h-10 flex items-center justify-center mt-4">
                {loadingMore && <Loader2 size={20} className="animate-spin text-indigo-400" />}
              </div>
            )}

            {!hasMore && filtered.length > 0 && (
              <p className="text-center text-xs mt-8 pb-4" style={{ color: "var(--text-muted)" }}>
                You've seen all results
              </p>
            )}
          </>
        )}
      </div>
    </main>
  );
}
