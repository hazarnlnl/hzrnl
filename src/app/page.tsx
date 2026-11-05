"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { AnimatePresence, MotionConfig, motion, type Variants } from "framer-motion";

type Project = {
  name: string;
  href?: string;
};

const PROJECTS: Project[] = [
  { name: "Prompt Journey", href: "https://thepromptjourney.com" },
  { name: "Cargo" },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;
const SPRING = { type: "spring", stiffness: 500, damping: 30 } as const;

// Pills fade up one after another
const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const pillVariants: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(4px)" },
  visible: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.5, ease: EASE_OUT } },
};

const PILL_CLASS =
  "flex items-center justify-center whitespace-nowrap rounded-full bg-[#f4f4f4] px-3 py-2 text-[16px] font-medium leading-[1.1] tracking-[-0.04em] text-[#434343]";

// Unreleased project: looks like the other pills but only reveals a "Soon" tooltip
function SoonPill({ name }: { name: string }) {
  const [hovered, setHovered] = useState(false);
  const tooltipId = useId();

  return (
    <div
      tabIndex={0}
      aria-describedby={tooltipId}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className={`${PILL_CLASS} relative cursor-default outline-none`}
    >
      {name}
      <AnimatePresence>
        {hovered && (
          <motion.span
            id={tooltipId}
            role="tooltip"
            initial={{ opacity: 0, x: -4, filter: "blur(2px)" }}
            animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: -4, filter: "blur(2px)" }}
            transition={{ duration: 0.2, ease: EASE_OUT }}
            className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded-full bg-[#2a2a2a] px-3 py-2 text-[16px] font-medium leading-[1.1] tracking-[-0.04em] text-[#f2f2f2]"
          >
            Soon
          </motion.span>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-col items-center bg-white px-4 pt-[70px] pb-[44px]">
        {/* Project pills, vertically centered */}
        <main className="flex w-full flex-1 items-center justify-center">
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center gap-[14px]"
          >
            {PROJECTS.map((project) => (
              <motion.li key={project.name} variants={pillVariants}>
                {project.href ? (
                  <motion.a
                    href={project.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    transition={SPRING}
                    className={`${PILL_CLASS} transition-colors duration-150 hover:bg-[#ebebeb]`}
                  >
                    {project.name}
                  </motion.a>
                ) : (
                  <SoonPill name={project.name} />
                )}
              </motion.li>
            ))}
          </motion.ul>
        </main>

        <motion.nav
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: EASE_OUT } }}
          className="flex items-center gap-[17px] text-[16px] font-medium leading-[1.1] tracking-[-0.04em] text-[#393939]"
        >
          <Link href="/index" className="transition-opacity duration-150 hover:opacity-50">
            Index
          </Link>
          <a
            href="https://x.com/hazarnlnl"
            target="_blank"
            rel="noopener noreferrer"
            className="transition-opacity duration-150 hover:opacity-50"
          >
            Contact
          </a>
        </motion.nav>
      </div>
    </MotionConfig>
  );
}
