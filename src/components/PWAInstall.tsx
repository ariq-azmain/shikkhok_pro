"use client";

import { useEffect, useState } from "react";

export default function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isReadyToInstall, setIsReadyToInstall] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // ব্রাউজারের ডিফল্ট ইনস্টল প্রম্পট আটকানো
      e.preventDefault();
      // ইভেন্টটি স্টেটে সেভ করে রাখা যাতে পরে ব্যবহার করা যায়
      setDeferredPrompt(e);
      // বাটন দেখানোর জন্য স্টেট ট্রু করা
      setIsReadyToInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // ব্রাউজারের ইনস্টল প্রম্পট দেখানো
    deferredPrompt.prompt();

    // ইউজার কি সিদ্ধান্ত নিল তা চেক করা (ঐচ্ছিক)
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);

    // প্রম্পট একবার ব্যবহার হয়ে গেলে ক্লিয়ার করে দেওয়া
    setDeferredPrompt(null);
    setIsReadyToInstall(false);
  };

  // যদি অ্যাপটি অলরেডি ইনস্টলড থাকে বা ব্রাউজার রেডি না হয়, তাহলে বাটন দেখাবে না
  if (!isReadyToInstall) return null;

  return (
    <button
      onClick={handleInstallClick}
      className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-all fixed top-5 left-5"
    >
      Install App 📲
    </button>
  );
}
