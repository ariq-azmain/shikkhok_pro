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
                        "radial-gradient(ellipse 70% 45% at 50% -10%, rgba(99,102,241,0.13) 0%, transparent 65%)"
                }}
            />
            <div className="relative z-10">
                <SignIn
                    appearance={{
                        baseTheme: dark,
                        variables: {
                            colorPrimary: "#6366f1",
                            colorBackground: "#12121f",
                            colorInputBackground: "#1a1a2e",
                            colorInputText: "#f1f5f9",
                            colorText: "#f1f5f9",
                            colorTextSecondary: "#94a3b8",
                            colorTextOnPrimaryBackground: "#ffffff",
                            colorNeutral: "#f1f5f9",
                            colorShimmer: "#1e1e35",
                            borderRadius: "0.75rem",
                            fontFamily:
                                "var(--font-inter), system-ui, sans-serif",
                            fontSize: "15px"
                        },
                        elements: {
                            card: "bg-[#12121f] shadow-2xl border border-white/8",
                            headerTitle: "text-white font-extrabold text-2xl",
                            headerSubtitle: "text-slate-400",
                            socialButtonsBlockButton:
                                "bg-white/5 border border-white/10 hover:bg-white/10 text-slate-100 transition-all",
                            socialButtonsBlockButtonText:
                                "text-slate-100 font-medium",
                            socialButtonsProviderIcon__github: "invert",
                            dividerLine: "bg-white/10",
                            dividerText: "text-slate-500",
                            formFieldLabel: "text-slate-300 font-medium",
                            formFieldInput:
                                "bg-[#1a1a2e] border border-white/10 text-white placeholder:text-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/30",
                            formButtonPrimary:
                                "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold transition-all shadow-none",
                            footerActionText: "text-slate-400",
                            footerActionLink:
                                "text-indigo-400 hover:text-indigo-300 font-medium",
                            identityPreviewText: "text-slate-200",
                            identityPreviewEditButtonIcon: "text-indigo-400",
                            formResendCodeLink:
                                "text-indigo-400 hover:text-indigo-300",
                            otpCodeFieldInput:
                                "border border-white/10 bg-white/5 text-white",
                            alertText: "text-slate-300",
                            formFieldErrorText: "text-red-400",
                            badge: "hidden"
                        }
                    }}
                />
            </div>
        </main>
    );
}
