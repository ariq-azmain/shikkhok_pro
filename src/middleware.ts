import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/manifest.json", // ✅ PWA ফাইলটি পাবলিক হিসেবে ঘোষণা করা হলো
  "/sw.js", // ✅ Service Worker ফাইলটি পাবলিক হিসেবে ঘোষণা করা হলো
  "/favicon.png", // ✅ Favicon আইকনটি পাবলিক হিসেবে ঘোষণা করা হলো
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/sso-callback(.*)",
  "/q(.*)",
  "/api/webhooks(.*)",
  "/api/questions(.*)",
  "/api/profile/:username",
  "/api/profile/:username/questions",
]);

export default clerkMiddleware(async (auth, req) => {
  if (!isPublicRoute(req)) {
    await auth.protect();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    // ✅ নিচে js(?!on) পরিবর্তন করে js|json করা হয়েছে যাতে manifest.json ফাইলটি Clerk ইগনোর করে
    "/((?!_next|[^?]*\\.(?:html?|css|js|json|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
    // Always run for Clerk-specific frontend API routes
    "/__clerk/(.*)",
  ],
};
