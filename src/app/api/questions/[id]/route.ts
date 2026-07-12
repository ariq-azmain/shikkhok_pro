// src/app/api/questions/[id]/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET(
  _req: Request,
  { params }: { params: { id: string } },
) {
  try {
    const { id } = await params;

    const { data, error } = await supabase
      .from("questions")
      .select(
        `
        id, title, content, subject, "className", chapter, topic,
        difficulty, "totalMarks", "timeMinutes", visibility,
        "aiGenerated", "likesCount", "commentsCount", "viewsCount",
        "createdAt",
        creator:users!questions_createdById_fkey (
          id, username, "displayName", avatar, "accountType"
        )
      `,
      )
      .eq("id", id)
      .eq("visibility", "PUBLIC")
      .is("deletedAt", null)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: "Question not found" },
        { status: 404 },
      );
    }

    // Increment view count
    await supabase
      .from("questions")
      .update({ viewsCount: (data.viewsCount ?? 0) + 1 })
      .eq("id", id);

    return NextResponse.json({ data });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
