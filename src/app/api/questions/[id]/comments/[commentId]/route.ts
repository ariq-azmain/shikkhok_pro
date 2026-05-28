// src/app/api/questions/[id]/comments/[commentId]/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// DELETE /api/questions/[id]/comments/[commentId]
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string; commentId: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: questionId, commentId } = await params;

    const { data: dbUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerkId", clerkUser.id)
      .single();

    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Comment আছে এবং এই user এর কিনা চেক করো
    const { data: comment } = await supabase
      .from("comments")
      .select("id, userId, parentId")
      .eq("id", commentId)
      .eq("questionId", questionId)
      .is("deletedAt", null)
      .single();

    if (!comment) {
      return NextResponse.json({ error: "Comment not found" }, { status: 404 });
    }

    if (comment.userId !== dbUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Soft delete
    await supabase
      .from("comments")
      .update({ deletedAt: new Date().toISOString() })
      .eq("id", commentId);

    // Top-level comment হলে counter কমাও
    if (!comment.parentId) {
      const { data: question } = await supabase
        .from("questions")
        .select("commentsCount")
        .eq("id", questionId)
        .single();

      if (question) {
        await supabase
          .from("questions")
          .update({ commentsCount: Math.max(0, question.commentsCount - 1) })
          .eq("id", questionId);
      }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
