"use client";

import { useEffect } from "react";

export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;

    const swUrl = "/sw.js";

    // Check if the service worker file exists before registering to avoid console errors
    fetch(swUrl, { method: "HEAD" })
      .then((res) => {
        if (res.ok) {
          navigator.serviceWorker.register(swUrl).catch(() => {
            // swallow registration errors silently
          });
        }
      })
      .catch(() => {
        // network error or sw not present — ignore
      });
  }, []);

  return null;
}
