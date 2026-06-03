// src/app/api/questions/[id]/like/route.ts
// Manual likesCount update সরানো হয়েছে।
// DB trigger (trg_likes_insert / trg_likes_delete) এখন automatically
// questions.likesCount sync করে।

import { currentUser } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// POST — toggle like
export async function POST(
    _req: Request,
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

        // আগে like করেছে কিনা
        const { data: existingLike } = await supabase
            .from("likes")
            .select("id")
            .eq("userId", dbUser.id)
            .eq("questionId", questionId)
            .maybeSingle();

        let liked: boolean;

        if (existingLike) {
            // Unlike — trigger fn_decrement_likes() fire হবে
            await supabase
                .from("likes")
                .delete()
                .eq("userId", dbUser.id)
                .eq("questionId", questionId);
            liked = false;
        } else {
            // Like — trigger fn_increment_likes() fire হবে
            await supabase
                .from("likes")
                .insert({ userId: dbUser.id, questionId });
            liked = true;
        }

        // Trigger update করার পরে fresh count নিয়ে আসো
        const { data: updated } = await supabase
            .from("questions")
            .select("likesCount")
            .eq("id", questionId)
            .single();

        return NextResponse.json({
            liked,
            likesCount: updated?.likesCount ?? 0
        });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

// GET — current user like করেছে কিনা
export async function GET(
    _req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const clerkUser = await currentUser();
        if (!clerkUser) return NextResponse.json({ liked: false });

        const { id: questionId } = await params;

        const { data: dbUser } = await supabase
            .from("users")
            .select("id")
            .eq("clerkId", clerkUser.id)
            .maybeSingle();

        if (!dbUser) return NextResponse.json({ liked: false });

        const { data: like } = await supabase
            .from("likes")
            .select("id")
            .eq("userId", dbUser.id)
            .eq("questionId", questionId)
            .maybeSingle();

        return NextResponse.json({ liked: !!like });
    } catch {
        return NextResponse.json({ liked: false });
    }
}
