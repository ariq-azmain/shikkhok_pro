// src/lib/supabase/client.ts
// ---------------------------------------------------------------
// Supabase Browser Client
// "use client" component এ ব্যবহার করো।
// File upload, Realtime subscription এর জন্য।
// ---------------------------------------------------------------

import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
