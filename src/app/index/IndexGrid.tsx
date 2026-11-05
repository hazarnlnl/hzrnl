"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";

export type IndexItem = {
  src: string;
  width: number;
  height: number;
  alt: string;
};

type IndexGridProps = { items: IndexItem[] };

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const VIDEO_REGEX = /\.(mp4|webm|mov)$/i;

// Fill columns left to right, always dropping the next item into the shortest
// column, so every column keeps the same width and heights follow each image.
function toColumns(items: IndexItem[], count: number) {
  const columns: { item: IndexItem; index: number }[][] = Array.from({ length: count }, () => []);
  const heights = new Array(count).fill(0);
  items.forEach((item, index) => {
    const shortest = heights.indexOf(Math.min(...heights));
    columns[shortest].push({ item, index });
    heights[shortest] += item.height / item.width;
  });
  return columns;
}

function Media({ item, sizes, priority }: { item: IndexItem; sizes: string; priority?: boolean }) {
  if (VIDEO_REGEX.test(item.src)) {
    return (
      <video
        src={item.src}
        aria-label={item.alt}
        autoPlay
        muted
        loop
        playsInline
        className="block h-full w-full object-cover"
      />
    );
  }
  return (
    <Image
      src={item.src}
      alt={item.alt}
      width={item.width}
      height={item.height}
      sizes={sizes}
      priority={priority}
      // Next's optimizer would flatten GIFs to their first frame
      unoptimized={item.src.toLowerCase().endsWith(".gif")}
      className="block h-full w-full object-cover"
    />
  );
}

type Open = { index: number; layout: number };

const ZOOM = { type: "spring", stiffness: 260, damping: 32 } as const;

export default function IndexGrid({ items }: IndexGridProps) {
  const [open, setOpen] = useState<Open | null>(null);
  // Tile that is flying back into the grid; kept above the fading backdrop until it lands
  const [returning, setReturning] = useState<string | null>(null);
  const openItem = open ? items[open.index] : null;

  const close = useCallback(() => {
    if (!open) return;
    setReturning(`${open.layout}-${items[open.index].src}`);
    setOpen(null);
  }, [open, items]);

  // Esc closes, and the page can't scroll while zoomed in
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  // Each grid gets its own layout ids, so the zoom starts from whichever grid is visible
  const renderColumns = (count: number, className: string, sizes: string, eager: boolean) => (
    <div className={`gap-3 ${className}`}>
      {toColumns(items, count).map((column, c) => (
        <div key={c} className="flex min-w-0 flex-1 flex-col gap-3">
          {column.map(({ item, index }) => {
            const id = `${count}-${item.src}`;
            return (
              <motion.button
                key={item.src}
                layoutId={id}
                type="button"
                onClick={() => setOpen({ index, layout: count })}
                onLayoutAnimationComplete={() => setReturning((r) => (r === id ? null : r))}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  layout: ZOOM,
                  default: { duration: 0.6, delay: Math.min(index, 8) * 0.05, ease: EASE_OUT },
                }}
                className="group relative block w-full cursor-zoom-in overflow-hidden bg-[#1c1c1c]"
                style={{ aspectRatio: `${item.width} / ${item.height}`, zIndex: returning === id ? 60 : 0 }}
                aria-label={`Open ${item.alt}`}
              >
                <div className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-[1.01]">
                  <Media item={item} sizes={sizes} priority={eager && index < 4} />
                </div>
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-svh bg-[#141414] p-3 sm:p-5">
        {renderColumns(2, "flex md:hidden", "50vw", false)}
        {/* Only the desktop grid preloads, so hidden duplicates don't fetch early */}
        {renderColumns(4, "hidden md:flex", "25vw", true)}

        <AnimatePresence>
          {open && openItem && (
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={close}
              className="fixed inset-0 z-50 cursor-zoom-out bg-black/40 backdrop-blur-xl"
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {open && openItem && (
            <div
              key="zoomed"
              role="dialog"
              aria-modal="true"
              aria-label={openItem.alt}
              onClick={close}
              className="fixed inset-0 z-[55] flex cursor-zoom-out items-center justify-center p-4"
            >
              <motion.div
                layoutId={`${open.layout}-${openItem.src}`}
                transition={{ layout: ZOOM }}
                className="overflow-hidden"
                style={{
                  aspectRatio: `${openItem.width} / ${openItem.height}`,
                  width: `min(92vw, calc(88svh * ${openItem.width / openItem.height}))`,
                }}
              >
                <Media item={openItem} sizes="92vw" priority />
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
