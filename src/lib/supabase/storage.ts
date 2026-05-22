// src/lib/supabase/storage.ts
// ---------------------------------------------------------------
// Supabase Storage Utility
// Syllabus, Book, Avatar এবং Question Image আপলোডের জন্য।
// ---------------------------------------------------------------

import { createClient } from "./client";

// Supabase Dashboard এ এই bucket গুলো আগে তৈরি করতে হবে।
export const BUCKETS = {
  AVATARS: "avatars",         // ইউজার প্রোফাইল ছবি
  ORG_LOGOS: "org-logos",     // অর্গানাইজেশন লোগো
  SYLLABI: "syllabi",         // সিলেবাস ফাইল (PDF/IMG)
  BOOKS: "books",             // কাস্টম বই আপলোড
  QUESTION_IMGS: "question-images", // প্রশ্নে ব্যবহৃত ছবি
} as const;

export type BucketName = (typeof BUCKETS)[keyof typeof BUCKETS];

/**
 * যেকোনো ফাইল Supabase Storage এ আপলোড করো।
 * @returns আপলোড হওয়া ফাইলের public URL
 */
export async function uploadFile({
  bucket,
  path,
  file,
  contentType,
}: {
  bucket: BucketName;
  path: string; // e.g. "userId/filename.pdf"
  file: File | Blob;
  contentType?: string;
}): Promise<string> {
  const supabase = createClient();

  const { error } = await supabase.storage.from(bucket).upload(path, file, {
    contentType,
    upsert: true, // একই path এ re-upload হলে replace করো
  });

  if (error) throw new Error(`Upload failed: ${error.message}`);

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);
  return data.publicUrl;
}

/**
 * Storage থেকে ফাইল মুছে দাও।
 */
export async function deleteFile({
  bucket,
  path,
}: {
  bucket: BucketName;
  path: string;
}): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.storage.from(bucket).remove([path]);
  if (error) throw new Error(`Delete failed: ${error.message}`);
}

/**
 * পুরানো ফাইল replace করে নতুন ফাইল আপলোড করো।
 * Avatar/Logo update এর জন্য useful।
 */
export async function replaceFile({
  bucket,
  oldPath,
  newPath,
  file,
  contentType,
}: {
  bucket: BucketName;
  oldPath: string | null;
  newPath: string;
  file: File | Blob;
  contentType?: string;
}): Promise<string> {
  // পুরানো ফাইল থাকলে আগে মুছো
  if (oldPath) {
    try {
      await deleteFile({ bucket, path: oldPath });
    } catch {
      // না থাকলে ignore করো
    }
  }

  return uploadFile({ bucket, path: newPath, file, contentType });
}

/**
 * ফাইলের নাম থেকে storage path তৈরি করো।
 * Collision এড়াতে timestamp যোগ করা হয়।
 */
export function buildStoragePath(
  userId: string,
  fileName: string,
  prefix?: string
): string {
  const timestamp = Date.now();
  const ext = fileName.split(".").pop() ?? "";
  const base = prefix ? `${prefix}/` : "";
  return `${userId}/${base}${timestamp}.${ext}`;
}
