// src/app/(main)/profile/[username]/page.tsx
// searchParams সরিয়ে দেওয়া হয়েছে — tab এখন শুধু client-side।

import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import type { Metadata } from "next";

import { getUserPublicProfile, getUserByClerkId } from "@/lib/db";
import { ProfileClient } from "./ProfileClient";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const user = await getUserPublicProfile(username);

  if (!user) return { title: "User Not Found — Shikkhok Pro" };

  return {
    title: `${user.displayName} (@${user.username}) — Shikkhok Pro`,
    description:
      user.bio ??
      `View ${user.displayName}'s public questions on Shikkhok Pro.`,
    openGraph: {
      title: `${user.displayName} (@${user.username})`,
      description: user.bio ?? `${user.displayName} on Shikkhok Pro`,
      images: user.avatar ? [{ url: user.avatar }] : [],
    },
  };
}

export default async function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;

  const profileUser = await getUserPublicProfile(username);
  if (!profileUser) notFound();

  // Ownership check — server-side
  const { userId: clerkId } = await auth();
  let isOwner = false;
  if (clerkId) {
    const currentUser = await getUserByClerkId(clerkId);
    isOwner = currentUser?.id === profileUser.id;
  }

  return (
    <main className="min-h-screen" style={{ background: "var(--bg-primary)" }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* 
          tab state এখন সম্পূর্ণ client-side।
          ProfileClient নিজেই useSearchParams() দিয়ে ?tab= পড়বে এবং
          router.push() দিয়ে update করবে — server re-render দরকার নেই।
        */}
        <ProfileClient user={profileUser} isOwner={isOwner} />
      </div>
    </main>
  );
}
