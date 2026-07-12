import React from "react";
import QuestionCard from "@/components/question/QuestionCard";

export default function MyQuestionsList({ questions }: any) {
  if (!questions || questions.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)]">
        You haven't created any questions yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {questions.map((q: any) => {
        // Ensure QuestionCard receives all required fields to avoid runtime errors
        const safeQuestion = {
          id: q.id,
          title: q.title,
          subject: q.subject || "",
          difficulty: q.difficulty || "NORMAL",
          // creator expected by QuestionCard — use "You" for the teacher viewing their own questions
          creator: { displayName: "You", avatar: null },
          // Provide content with sections array so QuestionCard.totalQs calculation works
          content: q.content ?? { sections: [] },
          // Provide createdAt and fallback values
          createdAt: q.createdAt ?? q.updatedAt ?? new Date().toISOString(),
          className: q.className ?? "",
          // Numeric counters (coerce to numbers)
          likesCount: Number(q.likesCount ?? 0),
          commentsCount: Number(q.commentsCount ?? 0),
          viewsCount: Number(q.viewsCount ?? 0),
          sharesCount: Number(q.sharesCount ?? 0),
        };

        return <QuestionCard key={q.id} question={safeQuestion} />;
      })}
    </div>
  );
}
