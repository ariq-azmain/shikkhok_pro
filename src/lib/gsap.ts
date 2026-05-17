"use client";

import gsap from "gsap";

export const fadeUp = (element: string) => {
  gsap.fromTo(
    element,
    {
      opacity: 0,
      y: 40,
    },
    {
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power4.out",
    }
  );
};