"use client";

import { useEffect } from "react";

// Same colors and timing as public/favicon.gif. Most browsers (Chrome, Safari)
// only show a GIF favicon's first frame, so we swap the icon ourselves.
const COLORS = ["#000000", "#0047FF", "#FF2D2D", "#00C24A"];
const INTERVAL_MS = 6000;

const squareIcon = (color: string) =>
  `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="${color}"/></svg>`,
  )}`;

export default function FaviconCycler() {
  useEffect(() => {
    const icons = COLORS.map(squareIcon);
    let index = 0;

    const id = setInterval(() => {
      index = (index + 1) % icons.length;
      document.querySelectorAll<HTMLLinkElement>('link[rel~="icon"]').forEach((link) => {
        link.type = "image/svg+xml";
        link.href = icons[index];
      });
    }, INTERVAL_MS);

    return () => clearInterval(id);
  }, []);

  return null;
}
