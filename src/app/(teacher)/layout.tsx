/* src/app/(teacher)/layout.tsx
   Shared layout for all teacher routes. Server component fetches user summary and passes to client shell.
*/
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import type { Metadata } from "next";
import TeacherShell from "@/components/teacher/TeacherShell";

export const metadata: Metadata = {
  title: "Teacher — Shikkhok Pro",
};

export default async function TeacherLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId: clerkId } = await auth();
  const supabase = await createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    },
  );

  // fetch minimal user summary
  const { data: dbUser } = await supabase
    .from("users")
    .select("id, username, displayName, avatar, accountType")
    .eq("clerkId", clerkId)
    .maybeSingle();

  if (!dbUser) {
    // render a simple shell if user missing
    return (
      <div className="min-h-screen flex items-center justify-center">
        Please sign in
      </div>
    );
  }

  const user = {
    id: dbUser.id,
    username: dbUser.username,
    displayName: dbUser.displayName,
    avatar: dbUser.avatar,
    accountType: dbUser.accountType,
  };

  return <TeacherShell user={user as any}>{children}</TeacherShell>;
}
