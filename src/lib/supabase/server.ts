// src/lib/supabase/server.ts
// ---------------------------------------------------------------
// Supabase Server Client
// Server Component, Route Handler, Server Action এ ব্যবহার করো।
// File storage operations এর জন্য।
// ---------------------------------------------------------------

import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Server Component এ cookies set করা যায় না — ignore করো।
          }
        },
      },
    },
  );
}
