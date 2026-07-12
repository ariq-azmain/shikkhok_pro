// src/app/api/questions/[id]/share/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

// POST /api/questions/[id]/share — share count বাড়াও
// Auth লাগে না — anonymous share ও count করো
export async function POST(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id: questionId } = await params;

    const { data: question } = await supabase
      .from("questions")
      .select("id, sharesCount")
      .eq("id", questionId)
      .single();

    if (!question) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    await supabase
      .from("questions")
      .update({ sharesCount: question.sharesCount + 1 })
      .eq("id", questionId);

    return NextResponse.json({ sharesCount: question.sharesCount + 1 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
