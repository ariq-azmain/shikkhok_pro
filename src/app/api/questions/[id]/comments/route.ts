// src/app/api/questions/[id]/comments/route.ts
// Manual commentsCount update সরানো হয়েছে।
// DB trigger (trg_comments_insert / trg_comments_delete) এখন automatically
// questions.commentsCount sync করে।
// POST response এ fresh commentsCount যোগ করা হয়েছে যাতে
// client realtime count দেখাতে পারে।

import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

const PAGE_SIZE = 20;

// GET /api/questions/[id]/comments?cursor=xxx&parentId=xxx
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: questionId } = await params;
        const { searchParams } = new URL(req.url);
        const cursor = searchParams.get("cursor");
        const parentId = searchParams.get("parentId");

        let query = supabase
            .from("comments")
            .select(
                `
        id, content, "createdAt", "parentId",
        user:users!comments_userId_fkey (
          id, username, "displayName", avatar
        )
      `
            )
            .eq("questionId", questionId)
            .is("deletedAt", null)
            .order("createdAt", { ascending: true })
            .limit(PAGE_SIZE + 1);

        if (parentId) {
            query = query.eq("parentId", parentId);
        } else {
            query = query.is("parentId", null);
        }

        if (cursor) query = query.gt("createdAt", cursor);

        const { data, error } = await query;

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        const hasMore = data.length > PAGE_SIZE;
        const comments = hasMore ? data.slice(0, PAGE_SIZE) : data;
        const nextCursor = hasMore
            ? comments[comments.length - 1].createdAt
            : null;

        return NextResponse.json({ data: comments, nextCursor });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// POST /api/questions/[id]/comments
export async function POST(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id: questionId } = await params;

        const text = await req.text();
        if (!text)
            return NextResponse.json({ error: "Empty body" }, { status: 400 });

        let body: { content: string; parentId?: string };
        try {
            body = JSON.parse(text);
        } catch {
            return NextResponse.json(
                { error: "Invalid JSON" },
                { status: 400 }
            );
        }

        const { content, parentId } = body;

        if (!content?.trim()) {
            return NextResponse.json(
                { error: "Content is required" },
                { status: 400 }
            );
        }

        if (content.trim().length > 1000) {
            return NextResponse.json(
                { error: "Comment too long (max 1000 chars)" },
                { status: 400 }
            );
        }

        const { data: dbUser, error: userErr } = await supabase
            .from("users")
            .select("id")
            .eq("clerkId", clerkUser.id)
            .single();

        if (userErr || !dbUser) {
            return NextResponse.json(
                { error: "User not found" },
                { status: 404 }
            );
        }

        // Question exist চেক
        const { data: question } = await supabase
            .from("questions")
            .select("id")
            .eq("id", questionId)
            .single();

        if (!question) {
            return NextResponse.json(
                { error: "Question not found" },
                { status: 404 }
            );
        }

        // parentId থাকলে validate করো
        if (parentId) {
            const { data: parentComment } = await supabase
                .from("comments")
                .select("id")
                .eq("id", parentId)
                .eq("questionId", questionId)
                .maybeSingle();

            if (!parentComment) {
                return NextResponse.json(
                    { error: "Parent comment not found" },
                    { status: 404 }
                );
            }
        }

        // Insert — trigger fn_increment_comments() fire হবে (top-level হলে)
        const { data: newComment, error: insertErr } = await supabase
            .from("comments")
            .insert({
                userId: dbUser.id,
                questionId,
                content: content.trim(),
                parentId: parentId ?? null
            })
            .select(
                `
        id, content, "createdAt", "parentId",
        user:users!comments_userId_fkey (
          id, username, "displayName", avatar
        )
      `
            )
            .single();

        if (insertErr) {
            return NextResponse.json(
                { error: insertErr.message },
                { status: 500 }
            );
        }

        // Trigger update এর পরে fresh commentsCount নিয়ে আসো
        const { data: updated } = await supabase
            .from("questions")
            .select("commentsCount")
            .eq("id", questionId)
            .single();

        return NextResponse.json(
            { data: newComment, commentsCount: updated?.commentsCount ?? 0 },
            { status: 201 }
        );
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}
