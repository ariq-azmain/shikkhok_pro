// src/app/(auth)/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignInPage() {
  return (
    <main
      className="min-h-screen w-full flex items-center justify-center px-4 py-12"
      style={{ background: "var(--bg-primary)" }}
    >
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(99,102,241,0.13) 0%, transparent 65%)",
        }}
      />
      <div className="relative z-10">
        <SignIn
          appearance={{
            baseTheme: dark,
            variables: {
              colorPrimary: "#6366f1",
              colorBackground: "#12121f",
              colorInputBackground: "#0e0e1a",
              colorInputText: "#f1f5f9",
              colorText: "#f1f5f9",
              colorTextSecondary: "#94a3b8",
              colorNeutral: "#94a3b8",
              borderRadius: "0.75rem",
              fontFamily: "var(--font-inter), system-ui, sans-serif",
            },
            elements: {
              card: "shadow-2xl border border-white/5",
              headerTitle: "text-white font-extrabold",
              headerSubtitle: "text-slate-400",
              socialButtonsBlockButton:
                "border border-white/10 bg-white/5 hover:bg-white/10 text-slate-200 transition-all",
              formFieldInput:
                "bg-white/5 border border-white/10 text-white focus:border-indigo-500/60",
              formButtonPrimary:
                "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all",
              footerActionLink: "text-indigo-400 hover:text-indigo-300",
            },
          }}
        />
      </div>
    </main>
  );
}
