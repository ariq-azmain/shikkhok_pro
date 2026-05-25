// src/lib/supabase/admin.ts
// ---------------------------------------------------------------
// Supabase SERVICE ROLE client — server-only.
// RLS bypass করে, সরাসরি DB তে যায়।
// শুধু API Route Handler / Server Action এ ব্যবহার করো।
// কখনো client component এ import করবে না।
// ---------------------------------------------------------------

import { createClient } from "@supabase/supabase-js";

// Singleton — hot reload এ duplicate connection এড়াতে
const globalForSupabase = globalThis as unknown as {
  supabaseAdmin: ReturnType<typeof createClient> | undefined;
};

export const supabaseAdmin =
  globalForSupabase.supabaseAdmin ??
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );

if (process.env.NODE_ENV !== "production") {
  globalForSupabase.supabaseAdmin = supabaseAdmin;
}
