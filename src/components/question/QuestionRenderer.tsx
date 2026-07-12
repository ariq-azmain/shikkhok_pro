// src/components/question/QuestionRenderer.tsx
import type { QuestionContent, QuestionItem } from "@/types/question";

function MCQQuestion({ item }: { item: QuestionItem }) {
  return (
    <div className="space-y-2">
      <p
        className="text-sm leading-relaxed"
        style={{ color: "var(--text-primary)" }}
      >
        <span className="font-bold text-indigo-400 mr-2">{item.no}.</span>
        {item.text}
      </p>
      {item.options && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-5">
          {item.options.map((opt, i) => (
            <div
              key={i}
              className={`text-sm px-3 py-1.5 rounded-lg border transition-colors ${
                item.answer && opt.startsWith(item.answer)
                  ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-400"
                  : "border-white/5 text-slate-400"
              }`}
            >
              {opt}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function ShortQuestion({ item }: { item: QuestionItem }) {
  return (
    <div className="flex gap-3">
      <span className="font-bold text-indigo-400 flex-shrink-0 text-sm">
        {item.no}.
      </span>
      <div className="flex-1">
        <p
          className="text-sm leading-relaxed whitespace-pre-wrap"
          style={{ color: "var(--text-primary)" }}
        >
          {item.text}
        </p>
        {item.marks && (
          <span className="inline-block mt-1.5 text-xs px-2 py-0.5 rounded-full text-amber-400 bg-amber-400/10">
            [{item.marks} marks]
          </span>
        )}
      </div>
    </div>
  );
}

interface Props {
  content: QuestionContent;
}

export default function QuestionRenderer({ content }: Props) {
  if (!content?.sections) return null;

  return (
    <div className="space-y-6">
      {content.sections.map((section, si) => (
        <div key={si}>
          {/* Section header */}
          <div
            className="flex items-center justify-between px-4 py-2.5 rounded-xl mb-4"
            style={{ background: "var(--bg-secondary)" }}
          >
            <h4
              className="font-bold text-sm"
              style={{ color: "var(--text-primary)" }}
            >
              {section.title}
            </h4>
            <span className="text-xs font-semibold text-indigo-400">
              {section.marks} marks
            </span>
          </div>

          {/* Questions */}
          <div className="space-y-4 pl-2">
            {section.questions.map((item) => {
              const isMCQ = !!item.options;
              return isMCQ ? (
                <MCQQuestion key={item.no} item={item} />
              ) : (
                <ShortQuestion key={item.no} item={item} />
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
