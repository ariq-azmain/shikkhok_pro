import React from "react";
import QuestionCard from "@/components/question/QuestionCard";

export default function MyQuestionsListLegacy({ questions }: any) {
  if (!questions || questions.length === 0) {
    return <p className="text-sm text-[var(--text-muted)]">You haven't created any questions yet.</p>;
  }

  return (
    <div className="space-y-3">
      {questions.map((q: any) => {
        const safeQuestion = {
          id: q.id,
          title: q.title,
          subject: q.subject || "",
          difficulty: q.difficulty || "NORMAL",
          creator: { displayName: "You", avatar: null },
          content: q.content ?? { sections: [] },
          createdAt: q.createdAt ?? q.updatedAt ?? new Date().toISOString(),
          className: q.className ?? "",
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
