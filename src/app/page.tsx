"use client";

import { MotionConfig, motion, type Variants } from "framer-motion";

type Project = {
  name: string;
  meta: string;
  href?: string;
  comingSoon?: boolean;
};

const PROJECTS: Project[] = [
  { name: "Prompt Journey", meta: "2026", href: "https://thepromptjourney.com" },
  { name: "Ivy", meta: "Soon", comingSoon: true },
];

const EASE_OUT = [0.22, 1, 0.36, 1] as const;

// Rows fade up one after another; coming-soon rows settle at a lower opacity
const listVariants: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

const rowVariants: Variants = {
  hidden: { opacity: 0, y: 6, filter: "blur(4px)" },
  visible: (comingSoon: boolean) => ({
    opacity: comingSoon ? 0.3 : 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: EASE_OUT },
  }),
};

// Labels shared with the icon so its hover state propagates and reverts with the pill
const pillVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  rest: { opacity: 1, y: 0, transition: { duration: 0.5, delay: 0.3, ease: EASE_OUT } },
  hover: {},
};

const iconVariants: Variants = {
  hidden: { rotate: 0, scale: 1 },
  rest: { rotate: 0, scale: 1 },
  hover: { rotate: -8, scale: 1.08 },
};

export default function Home() {
  return (
    <MotionConfig reducedMotion="user">
      <div className="flex min-h-svh flex-col items-center bg-white px-4 pt-[100px] pb-[60px]">
        {/* Project list, vertically centered */}
        <main className="flex w-full flex-1 items-center justify-center">
          <motion.ul
            variants={listVariants}
            initial="hidden"
            animate="visible"
            className="flex w-full max-w-[320px] flex-col gap-[24px] p-[32px] font-sans text-[11px] leading-[normal] text-[#141518]"
          >
            {PROJECTS.map((project) => {
              const row = (
                <>
                  <span>{project.name}</span>
                  <span>{project.meta}</span>
                </>
              );
              return (
                <motion.li
                  key={project.name}
                  variants={rowVariants}
                  custom={!!project.comingSoon}
                  className="w-full whitespace-nowrap"
                >
                  {project.href ? (
                    // Negative margin keeps text aligned while the hover box extends past it
                    <motion.a
                      href={project.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileTap={{ scale: 0.98 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      className="-mx-3 -my-2 flex items-center justify-between rounded-[8px] px-3 py-2 transition-colors duration-150 hover:bg-[#f7f7f7]"
                    >
                      {row}
                    </motion.a>
                  ) : (
                    <div className="flex items-center justify-between">{row}</div>
                  )}
                </motion.li>
              );
            })}
          </motion.ul>
        </main>

        <motion.a
          href="https://cal.com/hazarnlnl/intro-with-hazar"
          target="_blank"
          rel="noopener noreferrer"
          variants={pillVariants}
          initial="hidden"
          animate="rest"
          whileHover="hover"
          whileTap={{ scale: 0.96 }}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="flex h-10 shrink-0 items-center gap-2 rounded-full bg-[#f7f7f7] pl-4 pr-5 text-[14px] leading-[normal] tracking-[-0.28px] text-[#3a3a3a] transition-colors duration-150 hover:bg-[#efefef]"
        >
          <motion.svg
            aria-hidden="true"
            width="16"
            height="16"
            viewBox="0 0 14 14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            variants={iconVariants}
            transition={{ type: "spring", stiffness: 400, damping: 15 }}
            className="text-[#8a8a8a]"
          >
            <rect x="1.6" y="2.6" width="10.8" height="9.8" rx="2.2" />
            <path d="M1.6 5.6h10.8M4.6 1.2v2.6M9.4 1.2v2.6" />
          </motion.svg>
          Book Meeting
        </motion.a>
      </div>
    </MotionConfig>
  );
}
