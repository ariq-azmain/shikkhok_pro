// src/lib/db/user.ts
// ---------------------------------------------------------------
// User DB Utilities
// Clerk webhook বা sign-up পরে ব্যবহার করো।
// ---------------------------------------------------------------

import { prisma } from "@/lib/prisma";
import { AccountType } from "@prisma/client";

/**
 * Clerk Auth থেকে আসা user DB তে আছে কিনা check করো।
 * না থাকলে নতুন user তৈরি করো (upsert)।
 */
export async function syncUserFromClerk({
  clerkId,
  email,
  displayName,
  avatar,
  username,
}: {
  clerkId: string;
  email: string;
  displayName: string;
  avatar?: string;
  username: string;
}) {
  return prisma.user.upsert({
    where: { clerkId },
    update: {
      displayName,
      avatar,
      email,
    },
    create: {
      clerkId,
      email,
      displayName,
      avatar,
      username,
      accountType: AccountType.STUDENT, // default — onboarding এ পরিবর্তন হবে
    },
  });
}

/**
 * clerkId দিয়ে DB থেকে user নিয়ে আসো।
 */
export async function getUserByClerkId(clerkId: string) {
  return prisma.user.findUnique({
    where: { clerkId },
    select: {
      id: true,
      clerkId: true,
      username: true,
      displayName: true,
      email: true,
      avatar: true,
      bio: true,
      accountType: true,
      createdAt: true,
      orgMemberships: {
        select: {
          orgId: true,
          role: true,
          subjects: true,
          classes: true,
          org: {
            select: { id: true, name: true, slug: true, logo: true, type: true },
          },
        },
      },
    },
  });
}

/**
 * username দিয়ে user খোঁজো।
 */
export async function getUserByUsername(username: string) {
  return prisma.user.findUnique({
    where: { username },
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
      accountType: true,
      createdAt: true,
    },
  });
}

/**
 * Onboarding এ AccountType আপডেট করো।
 */
export async function updateUserAccountType(
  clerkId: string,
  accountType: AccountType
) {
  return prisma.user.update({
    where: { clerkId },
    data: { accountType },
    select: { id: true, accountType: true },
  });
}

/**
 * Profile আপডেট করো।
 */
export async function updateUserProfile(
  clerkId: string,
  data: { displayName?: string; bio?: string; avatar?: string }
) {
  return prisma.user.update({
    where: { clerkId },
    data,
    select: {
      id: true,
      username: true,
      displayName: true,
      avatar: true,
      bio: true,
    },
  });
}

/**
 * username এর uniqueness check করো (sign-up এর সময়)।
 */
export async function isUsernameAvailable(username: string): Promise<boolean> {
  const existing = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });
  return !existing;
}
