import localFont from "next/font/local";

// Keep the storefront self-hosted so builds do not depend on fetching fonts
// from an external provider. Figtree is included under the OFL in src/assets.
export const fontSans = localFont({
  src: "../assets/fonts/Figtree-VariableFont_wght.ttf",
  weight: "300 900",
  style: "normal",
  variable: "--font-sans",
  display: "swap",
  preload: true,
  fallback: [
    "ui-sans-serif",
    "system-ui",
    "-apple-system",
    "Segoe UI",
    "Roboto",
    "Arial",
    "sans-serif",
  ],
});

// Use the same locally hosted family for display headings so the brand remains
// visually consistent without introducing a remote font dependency.
export const fontDisplay = fontSans;

export const fontMono = localFont({
  src: "../assets/fonts/Figtree-VariableFont_wght.ttf",
  weight: "300 900",
  style: "normal",
  variable: "--font-mono",
  display: "swap",
  preload: false,
  fallback: ["ui-monospace", "SFMono-Regular", "Menlo", "monospace"],
});
