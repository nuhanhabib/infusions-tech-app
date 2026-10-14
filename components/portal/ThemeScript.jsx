
"use client";

import { useEffect } from "react";

export default function ThemeScript() {
  useEffect(() => {
    try {
      let theme = localStorage.getItem("it-portal-theme");

      if (theme !== "dark" && theme !== "light") {
        theme = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches
          ? "dark"
          : "light";
      }

      document.documentElement.dataset.ptheme = theme;
    } catch (error) {
      document.documentElement.dataset.ptheme = "light";
    }
  }, []);

  return null;
}
