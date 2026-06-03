import React from "react";
import QuestionCard from "@/components/question/QuestionCard";

export default function MyQuestionsList({ questions }: any) {
  if (!questions || questions.length === 0) {
    return <p className="text-sm text-muted">You haven't created any questions yet.</p>;
  }

  return (
    <div className="space-y-3">
      {questions.map((q: any) => (
        <QuestionCard key={q.id} question={{
          id: q.id,
          title: q.title,
          subject: q.subject,
          difficulty: q.difficulty,
          creator: { displayName: "You", avatar: null },
          content: { sections: [] },
        }} />
      ))}
    </div>
  );
}
