// src/app/(auth)/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

export default function SignUpPage() {
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
                <SignUp
                    appearance={{
                        baseTheme: dark,
                        cssLayerName: "clerk",
                        variables: {
                            colorPrimary: "#6366f1",
                            colorBackground: "#12121f",
                            colorInputBackground: "#1a1a2e",
                            colorInputText: "#f1f5f9",
                            colorText: "#f1f5f9",
                            colorTextSecondary: "#94a3b8",
                            colorTextOnPrimaryBackground: "#ffffff",
                            colorNeutral: "#f1f5f9",
                            borderRadius: "0.75rem",
                            fontFamily:
                                "var(--font-inter), system-ui, sans-serif"
                        },
                        elements: {
                            socialButtonsBlockButton:
                                "border border-white/10 hover:bg-white/10 transition-all",
                            socialButtonsProviderIcon__github: "invert",
                            formButtonPrimary:
                                "bg-indigo-500 hover:bg-indigo-600 text-white font-semibold",
                            footerActionLink:
                                "text-indigo-400 hover:text-indigo-300",
                            badge: "hidden"
                        }
                    }}
                />
            </div>
        </main>
    );
}
