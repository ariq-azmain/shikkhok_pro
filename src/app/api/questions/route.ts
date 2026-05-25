// src/app/api/questions/route.ts
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAGE_SIZE = 10;

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const cursor = searchParams.get("cursor"); // last question's createdAt
    const subject = searchParams.get("subject");
    const className = searchParams.get("class");
    const difficulty = searchParams.get("difficulty");

    let query = supabase
      .from("questions")
      .select(`
        id, title, content, subject, "className", chapter, topic,
        difficulty, "totalMarks", "timeMinutes", visibility,
        "aiGenerated", "likesCount", "commentsCount", "viewsCount",
        "createdAt",
        creator:users!questions_createdById_fkey (
          id, username, "displayName", avatar, "accountType"
        )
      `)
      .eq("visibility", "PUBLIC")
      .is("deletedAt", null)
      .order("createdAt", { ascending: false })
      .limit(PAGE_SIZE + 1); // +1 to know if there's a next page

    if (cursor) query = query.lt("createdAt", cursor);
    if (subject) query = query.eq("subject", subject);
    if (className) query = query.eq("className", className);
    if (difficulty) query = query.eq("difficulty", difficulty);

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const hasMore = data.length > PAGE_SIZE;
    const questions = hasMore ? data.slice(0, PAGE_SIZE) : data;
    const nextCursor = hasMore ? questions[questions.length - 1].createdAt : null;

    return NextResponse.json({ data: questions, nextCursor });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
