"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const TOP_PILL_SCROLL_THRESHOLD = 80;
const BOTTOM_NAV_HIDE_THRESHOLD = 150; // hide bottom nav sooner when scrolling to top

const BOTTOM_NAV_APPEAR_DELAY_MS = 400;

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopPill, setShowTopPill] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [scrollPastBottomNavThreshold, setScrollPastBottomNavThreshold] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const bottomNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (showTopPill || !scrollPastBottomNavThreshold) {
      setShowBottomNav(false);
      if (bottomNavTimerRef.current) {
        clearTimeout(bottomNavTimerRef.current);
        bottomNavTimerRef.current = null;
      }
    } else {
      bottomNavTimerRef.current = setTimeout(() => {
        setShowBottomNav(true);
        bottomNavTimerRef.current = null;
      }, BOTTOM_NAV_APPEAR_DELAY_MS);
    }
    return () => {
      if (bottomNavTimerRef.current) clearTimeout(bottomNavTimerRef.current);
    };
  }, [showTopPill, scrollPastBottomNavThreshold]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("click", handleClickOutside);
      return () => document.removeEventListener("click", handleClickOutside);
    }
  }, [menuOpen]);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      if (y > TOP_PILL_SCROLL_THRESHOLD) {
        setShowTopPill(false);
        setMenuOpen(false);
      } else {
        setShowTopPill(true);
      }
      // Hide bottom nav sooner when scrolling back to top
      if (y < BOTTOM_NAV_HIDE_THRESHOLD) {
        setScrollPastBottomNavThreshold(false);
        setShowBottomNav(false);
        if (bottomNavTimerRef.current) {
          clearTimeout(bottomNavTimerRef.current);
          bottomNavTimerRef.current = null;
        }
      } else {
        setScrollPastBottomNavThreshold(true);
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white">
      {/* Top pill that morphs into menu box - fixed at top, hides on scroll down, returns at top */}
      <motion.div
        ref={menuRef}
        className={`fixed left-1/2 top-6 z-50 -translate-x-1/2 will-change-[transform] ${showTopPill ? "" : "pointer-events-none"}`}
        style={{ contain: "layout" }}
        initial={{ opacity: 0, y: -20 }}
        animate={{
          opacity: showTopPill ? 1 : 0,
          y: showTopPill ? 0 : -24,
        }}
        transition={{ type: "tween", duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      >
          <div className="relative">
            {/* Pill: always icon + menu */}
            <div
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                setMenuOpen((open) => !open);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setMenuOpen((open) => !open);
                }
              }}
              className="flex h-12 w-[72px] cursor-pointer flex-row items-center justify-center gap-3 rounded-2xl border border-[#EBEBEB] bg-white"
              aria-expanded={menuOpen}
            >
              <Image
                src="/favicon.png"
                alt=""
                width={24}
                height={24}
                className="h-6 w-6 flex-shrink-0 rounded-[8px] object-cover"
              />
              <Image
                src="/menuicon.svg"
                alt="Menu"
                width={16}
                height={10}
                className="h-auto w-4 flex-shrink-0"
              />
            </div>

            {/* Popup: appears below the pill */}
            <AnimatePresence>
              {menuOpen && (
                <motion.div
                  key="menu-popup"
                  initial={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: -8, filter: "blur(6px)" }}
                  transition={{
                    type: "tween",
                    duration: 0.28,
                    ease: [0.25, 0.1, 0.25, 1],
                  }}
                  className="absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 rounded-[22px] border border-[#EBEBEB] bg-white px-5 py-4"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex flex-col gap-1.5">
                    <a
                      href="#book"
                      className="text-[12px] font-medium leading-[14px] tracking-[-0.02em] text-[#A8A8A8] transition-colors duration-200 ease-out hover:text-[#282829]"
                    >
                      Book a Call
                    </a>
                    <a
                      href="#telegram"
                      className="text-[12px] font-medium leading-[14px] tracking-[-0.02em] text-[#A8A8A8] transition-colors duration-200 ease-out hover:text-[#282829]"
                    >
                      Telegram
                    </a>
                    <a
                      href="https://x.com/hazarnlnl"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[12px] font-medium leading-[14px] tracking-[-0.02em] text-[#A8A8A8] transition-colors duration-200 ease-out hover:text-[#282829]"
                    >
                      X/Twitter
                    </a>
                    <a
                      href="mailto:hi@hzrnl.com"
                      className="text-[12px] font-medium leading-[14px] tracking-[-0.02em] text-[#A8A8A8] transition-colors duration-200 ease-out hover:text-[#282829]"
                    >
                      hi@hzrnl.com
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
      </motion.div>

      <main className="mx-auto flex w-full max-w-[1264.66px] flex-col items-center gap-14 px-4 pt-56 pb-60">
        {/* Header + subheader */}
        <motion.div
          className="max-w-[420px] text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-[22px] font-medium leading-[28px] tracking-[-0.06em] text-[#282829]">
            Design partner for founders who move fast. Sharp brand, product, and web design that helps you launch and scale.
          </p>
        </motion.div>

        {/* Book Call + Chat under header */}
        <motion.div
          className="flex flex-row items-center justify-center gap-[7.89px]"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <a
            href="#book"
            className="group flex h-[43px] w-[113.9px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#2D2D2D] bg-[#12141B] px-3 py-3 transition-colors duration-150 hover:bg-[#242938]"
          >
            <Image
              src="/bookcallicon.svg"
              alt="Book call"
              width={16}
              height={16}
              className="transition-transform duration-150 group-hover:-translate-y-[2px]"
            />
            <span className="whitespace-nowrap text-[15.77px] font-semibold leading-[19px] tracking-[-0.04em] text-white">
              Book Call
            </span>
          </a>
          <a
            href="#chat"
            className="group flex h-[43px] w-[81.9px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#DADADA] bg-white px-3 py-3 transition-colors duration-150 hover:bg-[#F5F5F5]"
          >
            <Image
              src="/chaticon.svg"
              alt="Chat"
              width={16}
              height={16}
              className="transition-transform duration-150 group-hover:-translate-y-[2px]"
            />
            <span className="whitespace-nowrap text-[15.77px] font-semibold leading-[19px] tracking-[-0.04em] text-[#2F2F2F]">
              Chat
            </span>
          </a>
        </motion.div>

        {/* Logo strip */}
        <motion.div
          className="grid grid-cols-3 gap-x-10 gap-y-6 rounded-md px-2 py-2"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <Image
            src="/Frame-18.svg"
            alt="Client logo 1"
            width={56}
            height={16}
            className="h-auto w-14 justify-self-center"
          />
          <Image
            src="/Frame-174.svg"
            alt="Client logo 2"
            width={56}
            height={16}
            className="h-auto w-14 justify-self-center"
          />
          <Image
            src="/Frame-175.svg"
            alt="Client logo 3"
            width={56}
            height={16}
            className="h-auto w-14 justify-self-center"
          />
          <Image
            src="/Frame-176.svg"
            alt="Client logo 4"
            width={56}
            height={16}
            className="h-auto w-14 justify-self-center"
          />
          <Image
            src="/Frame-177.svg"
            alt="Client logo 5"
            width={56}
            height={16}
            className="h-auto w-14 justify-self-center"
          />
          <Image
            src="/Frame-178.svg"
            alt="Client logo 6"
            width={56}
            height={16}
            className="h-auto w-14 justify-self-center"
          />
        </motion.div>

        {/* Project images */}
        <motion.div
          className="mt-48 flex w-full flex-col items-center gap-6"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        >
          <Image
            src="/1.png"
            alt="Project 1"
            width={1200}
            height={700}
            className="h-[700px] w-[1200px] rounded-[20px] object-cover"
          />
          <Image
            src="/2.png"
            alt="Project 2"
            width={1200}
            height={700}
            className="h-[700px] w-[1200px] rounded-[20px] object-cover"
          />
          <Image
            src="/3.png"
            alt="Project 3"
            width={1200}
            height={700}
            className="h-[700px] w-[1200px] rounded-[20px] object-cover"
          />
          <Image
            src="/4.png"
            alt="Project 4"
            width={1200}
            height={700}
            className="h-[700px] w-[1200px] rounded-[20px] object-cover"
          />
        </motion.div>
      </main>

      {/* Bottom navbar: appears a little after header pill is hidden (scrolled down) */}
      <motion.nav
        className={`fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-[7.89px] px-0 py-0 ${showBottomNav ? "" : "pointer-events-none"}`}
        initial={false}
        animate={{
          opacity: showBottomNav ? 1 : 0,
          y: showBottomNav ? 0 : 16,
        }}
        transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        {/* Book Call */}
        <button
          type="button"
          className="group flex h-[43px] w-[113.9px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#2D2D2D] bg-[#12141B] px-3 py-3 transition-colors duration-150 hover:bg-[#242938]"
        >
          <Image
            src="/bookcallicon.svg"
            alt="Book call"
            width={16}
            height={16}
            className="transition-transform duration-150 group-hover:-translate-y-[2px]"
          />
          <span className="whitespace-nowrap text-[15.77px] font-semibold leading-[19px] tracking-[-0.04em] text-white">
            Book Call
          </span>
        </button>

        {/* Chat */}
        <button
          type="button"
          className="group flex h-[43px] w-[81.9px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#DADADA] bg-white px-3 py-3 transition-colors duration-150 hover:bg-[#F5F5F5]"
        >
          <Image
            src="/chaticon.svg"
            alt="Chat"
            width={16}
            height={16}
            className="transition-transform duration-150 group-hover:-translate-y-[2px]"
          />
          <span className="whitespace-nowrap text-[15.77px] font-semibold leading-[19px] tracking-[-0.04em] text-[#2F2F2F]">
            Chat
          </span>
        </button>
      </motion.nav>
    </div>
  );
}
