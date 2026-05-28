// src/app/api/questions/[id]/like/route.ts
import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST /api/questions/[id]/like — toggle like
export async function POST(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: questionId } = await params;

    // DB তে user খোঁজো
    const { data: dbUser, error: userErr } = await supabase
      .from("users")
      .select("id")
      .eq("clerkId", clerkUser.id)
      .single();

    if (userErr || !dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Question exist করে কিনা চেক করো
    const { data: question, error: qErr } = await supabase
      .from("questions")
      .select("id, likesCount")
      .eq("id", questionId)
      .single();

    if (qErr || !question) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }

    // আগে like করেছে কিনা চেক করো
    const { data: existingLike } = await supabase
      .from("likes")
      .select("id")
      .eq("userId", dbUser.id)
      .eq("questionId", questionId)
      .single();

    if (existingLike) {
      // Unlike — like টা মুছো এবং counter কমাও
      await supabase
        .from("likes")
        .delete()
        .eq("userId", dbUser.id)
        .eq("questionId", questionId);

      await supabase
        .from("questions")
        .update({ likesCount: Math.max(0, question.likesCount - 1) })
        .eq("id", questionId);

      return NextResponse.json({ liked: false, likesCount: Math.max(0, question.likesCount - 1) });
    } else {
      // Like — insert করো এবং counter বাড়াও
      await supabase
        .from("likes")
        .insert({ userId: dbUser.id, questionId });

      await supabase
        .from("questions")
        .update({ likesCount: question.likesCount + 1 })
        .eq("id", questionId);

      return NextResponse.json({ liked: true, likesCount: question.likesCount + 1 });
    }
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// GET /api/questions/[id]/like — current user like করেছে কিনা চেক করো
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) {
      return NextResponse.json({ liked: false });
    }

    const { id: questionId } = await params;

    const { data: dbUser } = await supabase
      .from("users")
      .select("id")
      .eq("clerkId", clerkUser.id)
      .single();

    if (!dbUser) return NextResponse.json({ liked: false });

    const { data: like } = await supabase
      .from("likes")
      .select("id")
      .eq("userId", dbUser.id)
      .eq("questionId", questionId)
      .single();

    return NextResponse.json({ liked: !!like });
  } catch {
    return NextResponse.json({ liked: false });
  }
}
