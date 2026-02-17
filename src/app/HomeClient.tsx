"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import {
  trackBookCallClick,
  trackMenuPillClick,
  trackTelegramClick,
  trackTwitterClick,
} from "@/lib/analytics";

const TOP_PILL_SCROLL_THRESHOLD = 80;
const BOTTOM_NAV_HIDE_THRESHOLD = 150;
const BOTTOM_NAV_APPEAR_DELAY_MS = 400;

const CLIENT_LOGOS = [
  "/Frame-18.svg",
  "/Frame-174.svg",
  "/Frame-175.svg",
  "/Frame-176.svg",
  "/Frame-177.svg",
  "/Frame-178.svg",
];

export type ProjectForDisplay = {
  id: string;
  imageUrl: string;
  alt: string | null;
};

type HomeClientProps = { projects: ProjectForDisplay[] };

export default function HomeClient({ projects }: HomeClientProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showTopPill, setShowTopPill] = useState(true);
  const [showBottomNav, setShowBottomNav] = useState(false);
  const [scrollPastBottomNavThreshold, setScrollPastBottomNavThreshold] = useState(false);
  const [isTouchLike, setIsTouchLike] = useState(false);
  const [activeTopTooltip, setActiveTopTooltip] = useState<null | "product" | "branding" | "web">(null);
  const [activeBottomTooltip, setActiveBottomTooltip] = useState<null | "product" | "branding" | "web">(null);
  const [hoveredTopTooltip, setHoveredTopTooltip] = useState<null | "product" | "branding" | "web">(null);
  const [hoveredBottomTooltip, setHoveredBottomTooltip] = useState<null | "product" | "branding" | "web">(null);
  const [iconFollow, setIconFollow] = useState<{
    id: "book-hero" | "chat-hero" | "book-nav" | "chat-nav" | null;
    x: number;
    y: number;
  }>({ id: null, x: 0, y: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const bottomNavTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const CTA_ICON_FOLLOW_MAX_PX = 3;
  const handleCtaButtonMouseMove = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: "book-hero" | "chat-hero" | "book-nav" | "chat-nav"
  ) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setIconFollow({
      id,
      x: (x - 0.5) * 2 * CTA_ICON_FOLLOW_MAX_PX,
      y: (y - 0.5) * 2 * CTA_ICON_FOLLOW_MAX_PX,
    });
  };
  const handleCtaButtonMouseLeave = () =>
    setIconFollow((prev) => ({ ...prev, id: null, x: 0, y: 0 }));

  useEffect(() => {
    const mq = window.matchMedia("(hover: none), (pointer: coarse)");
    const update = () => setIsTouchLike(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

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
    if (!menuOpen) setActiveTopTooltip(null);
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
    // Check initial scroll position on mount (client-side only)
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="bg-white">
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
          <div
            role="button"
            tabIndex={0}
            onClick={(e) => {
              e.stopPropagation();
              trackMenuPillClick();
              setMenuOpen((open) => !open);
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setMenuOpen((open) => !open);
              }
            }}
            className="flex h-12 w-[72px] cursor-pointer flex-row items-center justify-center gap-3 rounded-2xl border border-[#EBEBEB] bg-white transition-colors duration-150 hover:border-[#E0E0E0] hover:bg-[#F8F8F8]"
            aria-expanded={menuOpen}
          >
            <Image
              src="/menuicon.svg"
              alt="Menu"
              width={16}
              height={10}
              className="h-auto w-4 flex-shrink-0"
            />
          </div>
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                key="menu-popup"
                initial={{ opacity: 0, y: -16, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -12, filter: "blur(8px)" }}
                transition={{
                  duration: 0.26,
                  ease: [0.25, 0.1, 0.25, 1],
                }}
                className="absolute left-1/2 top-full z-10 mt-2 w-auto max-w-[90vw] md:w-[653px] -translate-x-1/2 rounded-[36px] border border-[#EBEBEB] bg-white p-8"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex w-full flex-col items-start gap-[10px] md:flex-row md:items-end md:justify-between">
                  {/* Left: heading + services (same as bottom) */}
                  <div className="flex w-full max-w-[440px] flex-col items-start gap-24 md:gap-20">
                    <div className="flex flex-col items-start gap-4">
                      <h2 className="text-[24px] font-medium leading-[1.2] tracking-[-0.04em] text-black">
                        Got a sec to talk about your idea?
                      </h2>
                      <p className="text-[16px] font-medium leading-[1.2] tracking-[-0.04em] text-[#C4C4C4]">
                        Let&apos;s make it real.
                      </p>
                    </div>

                    <div className="flex flex-row items-center gap-8">
                      {/* Product icon with tooltip */}
                      <motion.div
                        className="relative flex w-[74px] flex-col items-center"
                        initial="rest"
                        variants={{
                          rest: {},
                          hover: {},
                        }}
                        onMouseEnter={() => setHoveredTopTooltip("product")}
                        onMouseLeave={() => setHoveredTopTooltip(null)}
                        onClick={() => {
                          if (!isTouchLike) return;
                          setActiveTopTooltip((curr) => (curr === "product" ? null : "product"));
                        }}
                      >
                        <div className="flex h-[74px] w-[74px] items-center justify-center rounded-2xl bg-[#F5F5F5]">
                          <Image
                            src="/product.svg"
                            alt="Product"
                            width={52}
                            height={52}
                            className="h-[52px] w-[52px]"
                          />
                        </div>
                        <motion.div
                          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 rounded-[8px] bg-[#212121] px-2 py-1 text-[16px] font-semibold leading-[19px] tracking-[-0.04em] text-[#EDEDED] shadow-sm"
                          initial="rest"
                          variants={{
                            rest: { opacity: 0, y: 4 },
                            hover: { opacity: 1, y: 0 },
                          }}
                          animate={
                            isTouchLike
                              ? activeTopTooltip === "product"
                                ? "hover"
                                : "rest"
                              : hoveredTopTooltip === "product"
                                ? "hover"
                                : "rest"
                          }
                          transition={{
                            type: "tween",
                            duration: 0.2,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        >
                          Product
                        </motion.div>
                      </motion.div>

                      {/* Branding icon with tooltip */}
                      <motion.div
                        className="relative flex w-[74px] flex-col items-center"
                        initial="rest"
                        variants={{
                          rest: {},
                          hover: {},
                        }}
                        onMouseEnter={() => setHoveredTopTooltip("branding")}
                        onMouseLeave={() => setHoveredTopTooltip(null)}
                        onClick={() => {
                          if (!isTouchLike) return;
                          setActiveTopTooltip((curr) => (curr === "branding" ? null : "branding"));
                        }}
                      >
                        <div className="flex h-[74px] w-[74px] items-center justify-center rounded-2xl bg-[#F5F5F5]">
                          <Image
                            src="/brand.svg"
                            alt="Branding"
                            width={52}
                            height={52}
                            className="h-[52px] w-[52px]"
                          />
                        </div>
                        <motion.div
                          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 rounded-[8px] bg-[#212121] px-2 py-1 text-[16px] font-semibold leading-[19px] tracking-[-0.04em] text-[#EDEDED] shadow-sm"
                          initial="rest"
                          variants={{
                            rest: { opacity: 0, y: 4 },
                            hover: { opacity: 1, y: 0 },
                          }}
                          animate={
                            isTouchLike
                              ? activeTopTooltip === "branding"
                                ? "hover"
                                : "rest"
                              : hoveredTopTooltip === "branding"
                                ? "hover"
                                : "rest"
                          }
                          transition={{
                            type: "tween",
                            duration: 0.2,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        >
                          Branding
                        </motion.div>
                      </motion.div>

                      {/* Web icon with tooltip */}
                      <motion.div
                        className="relative flex w-[74px] flex-col items-center"
                        initial="rest"
                        variants={{
                          rest: {},
                          hover: {},
                        }}
                        onMouseEnter={() => setHoveredTopTooltip("web")}
                        onMouseLeave={() => setHoveredTopTooltip(null)}
                        onClick={() => {
                          if (!isTouchLike) return;
                          setActiveTopTooltip((curr) => (curr === "web" ? null : "web"));
                        }}
                      >
                        <div className="flex h-[74px] w-[74px] items-center justify-center rounded-2xl bg-[#F5F5F5]">
                          <Image
                            src="/web.svg"
                            alt="Web"
                            width={52}
                            height={52}
                            className="h-[52px] w-[52px]"
                          />
                        </div>
                        <motion.div
                          className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 rounded-[8px] bg-[#212121] px-2 py-1 text-[16px] font-semibold leading-[19px] tracking-[-0.04em] text-[#EDEDED] shadow-sm"
                          initial="rest"
                          variants={{
                            rest: { opacity: 0, y: 4 },
                            hover: { opacity: 1, y: 0 },
                          }}
                          animate={
                            isTouchLike
                              ? activeTopTooltip === "web"
                                ? "hover"
                                : "rest"
                              : hoveredTopTooltip === "web"
                                ? "hover"
                                : "rest"
                          }
                          transition={{
                            type: "tween",
                            duration: 0.2,
                            ease: [0.25, 0.1, 0.25, 1],
                          }}
                        >
                          <span className="whitespace-nowrap">Web + Development</span>
                        </motion.div>
                      </motion.div>
                    </div>
                  </div>

                  {/* Right: contact list (same as bottom) */}
                  <div className="mt-8 flex w-[93px] flex-col items-start gap-3 md:mt-0">
                    <span className="text-[11px] font-semibold leading-[18px] tracking-[0.04em] text-[#BBBBBB]">
                      CONTACT
                    </span>
                    <div className="flex flex-col items-start gap-3">
                      <a
                        href="https://cal.com/hazarnlnl/intro-with-hazar"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackBookCallClick("menu_popup")}
                        className="text-[12px] font-medium leading-[14px] tracking-[-0.02em] text-[#A8A8A8] transition-colors duration-200 ease-out hover:text-[#282829]"
                      >
                        Book Call
                      </a>
                      <a
                        href="https://x.com/hazarnlnl"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackTwitterClick("menu_popup")}
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
                      <a
                        href="https://t.me/hazarnlnl"
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackTelegramClick("menu_popup")}
                        className="text-[12px] font-medium leading-[14px] tracking-[-0.02em] text-[#A8A8A8] transition-colors duration-200 ease-out hover:text-[#282829]"
                      >
                        Telegram
                      </a>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>

      <main className="mx-auto flex w-full max-w-[1264.66px] flex-col items-center gap-14 px-4 pt-56 pb-60">
        <motion.div
          className="max-w-[420px] text-center"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        >
          <p className="text-[22px] font-medium leading-[28px] tracking-[-0.06em] text-[#282829]">
            Bringing your vision to life through design and development, with craft people can feel
          </p>
        </motion.div>

        <motion.div
          className="flex flex-row items-center justify-center gap-[7.89px]"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.2 }}
        >
          <a
            href="https://cal.com/hazarnlnl/intro-with-hazar"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackBookCallClick("header")}
            onMouseMove={(e) => handleCtaButtonMouseMove(e, "book-hero")}
            onMouseLeave={handleCtaButtonMouseLeave}
            className="group flex h-[43px] w-[113.9px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#2D2D2D] bg-[#12141B] px-3 py-3 transition-colors duration-150 hover:bg-[#242938]"
          >
            <Image
              src="/bookcallicon.svg"
              alt="Book call"
              width={16}
              height={16}
              className="transition-transform duration-200 ease-out"
              style={{
                transform:
                  iconFollow.id === "book-hero"
                    ? `translate(${iconFollow.x}px, ${iconFollow.y}px)`
                    : "translate(0px, 0px)",
              }}
            />
            <span className="whitespace-nowrap text-[15.77px] font-semibold leading-[19px] tracking-[-0.04em] text-white">
              Book Call
            </span>
          </a>
          <a
            href="https://t.me/hazarnlnl"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackTelegramClick("header")}
            onMouseMove={(e) => handleCtaButtonMouseMove(e, "chat-hero")}
            onMouseLeave={handleCtaButtonMouseLeave}
            className="group flex h-[43px] w-[81.9px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#DADADA] bg-white px-3 py-3 transition-colors duration-150 hover:bg-[#F5F5F5]"
          >
            <Image
              src="/chaticon.svg"
              alt="Chat"
              width={16}
              height={16}
              className="transition-transform duration-200 ease-out"
              style={{
                transform:
                  iconFollow.id === "chat-hero"
                    ? `translate(${iconFollow.x}px, ${iconFollow.y}px)`
                    : "translate(0px, 0px)",
              }}
            />
            <span className="whitespace-nowrap text-[15.77px] font-semibold leading-[19px] tracking-[-0.04em] text-[#2F2F2F]">
              Chat
            </span>
          </a>
        </motion.div>

        <motion.div
          className="relative mx-auto w-full max-w-[360px] overflow-hidden rounded-md py-2 md:max-w-[420px]"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut", delay: 0.3 }}
        >
          <motion.div
            className="flex w-max gap-x-8 md:gap-x-10"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              repeat: Infinity,
              repeatType: "loop",
              duration: 22,
              ease: "linear",
            }}
          >
            {CLIENT_LOGOS.map((src, i) => (
              <Image
                key={`logo-a-${i}`}
                src={src}
                alt={`Client logo ${i + 1}`}
                width={64}
                height={18}
                className="h-4 w-16 shrink-0 object-contain opacity-70 md:h-5"
              />
            ))}
            {CLIENT_LOGOS.map((src, i) => (
              <Image
                key={`logo-b-${i}`}
                src={src}
                alt={`Client logo ${i + 1}`}
                width={64}
                height={18}
                className="h-4 w-16 shrink-0 object-contain opacity-70 md:h-5"
              />
            ))}
          </motion.div>
          {/* Side gradient overlays: opaque at edges, transparent in center */}
          <div
            className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-white to-transparent md:w-24"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-white to-transparent md:w-24"
            aria-hidden
          />
        </motion.div>

        {/* Project images */}
        <motion.div
          className="mt-48 flex w-full flex-col items-center gap-6"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.4 }}
        >
          {projects.map((project) => (
            <Image
              key={project.id}
              src={project.imageUrl}
              alt={project.alt ?? "Project"}
              width={1200}
              height={700}
              className="h-auto w-full max-w-[1200px] rounded-[20px] object-cover md:h-[700px]"
            />
          ))}
        </motion.div>

        {/* Services + Contact block (Frame 221 style) */}
        <motion.section
          className="mt-28 mb-16 flex w-full justify-center px-4"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut", delay: 0.3 }}
        >
          <div className="flex w-auto max-w-[90vw] md:w-full md:max-w-[653px] flex-col items-start gap-[10px] rounded-[36px] border border-[#EBEBEB] bg-white p-8 md:flex-row md:items-end md:justify-between">
            {/* Left: heading + services */}
            <div className="flex w-full max-w-[440px] flex-col items-start gap-24 md:gap-20">
              <div className="flex flex-col items-start gap-4">
                <h2 className="text-[24px] font-medium leading-[1.2] tracking-[-0.04em] text-black">
                  Got a sec to talk about your idea?
                </h2>
                <p className="text-[16px] font-medium leading-[1.2] tracking-[-0.04em] text-[#C4C4C4]">
                  Let&apos;s make it real.
                </p>
              </div>

                  <div className="flex flex-row items-center gap-8">
                {/* Product icon with tooltip */}
                <motion.div
                  className="relative flex w-[74px] flex-col items-center"
                  initial="rest"
                  variants={{
                    rest: {},
                    hover: {},
                  }}
                  onMouseEnter={() => setHoveredBottomTooltip("product")}
                  onMouseLeave={() => setHoveredBottomTooltip(null)}
                  onClick={() => {
                    if (!isTouchLike) return;
                    setActiveBottomTooltip((curr) => (curr === "product" ? null : "product"));
                  }}
                >
                  <div className="flex h-[74px] w-[74px] items-center justify-center rounded-2xl bg-[#F5F5F5]">
                    <Image
                      src="/product.svg"
                      alt="Product"
                      width={52}
                      height={52}
                      className="h-[52px] w-[52px]"
                    />
                  </div>
                  <motion.div
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 rounded-[8px] bg-[#212121] px-2 py-1 text-[16px] font-semibold leading-[19px] tracking-[-0.04em] text-[#EDEDED] shadow-sm"
                    initial="rest"
                    variants={{
                      rest: { opacity: 0, y: 4 },
                      hover: { opacity: 1, y: 0 },
                    }}
                    animate={
                      isTouchLike
                        ? activeBottomTooltip === "product"
                          ? "hover"
                          : "rest"
                        : hoveredBottomTooltip === "product"
                          ? "hover"
                          : "rest"
                    }
                    transition={{
                      type: "tween",
                      duration: 0.2,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    Product
                  </motion.div>
                </motion.div>

                {/* Branding icon with tooltip */}
                <motion.div
                  className="relative flex w-[74px] flex-col items-center"
                  initial="rest"
                  variants={{
                    rest: {},
                    hover: {},
                  }}
                  onMouseEnter={() => setHoveredBottomTooltip("branding")}
                  onMouseLeave={() => setHoveredBottomTooltip(null)}
                  onClick={() => {
                    if (!isTouchLike) return;
                    setActiveBottomTooltip((curr) => (curr === "branding" ? null : "branding"));
                  }}
                >
                  <div className="flex h-[74px] w-[74px] items-center justify-center rounded-2xl bg-[#F5F5F5]">
                    <Image
                      src="/brand.svg"
                      alt="Branding"
                      width={52}
                      height={52}
                      className="h-[52px] w-[52px]"
                    />
                  </div>
                  <motion.div
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 rounded-[8px] bg-[#212121] px-2 py-1 text-[16px] font-semibold leading-[19px] tracking-[-0.04em] text-[#EDEDED] shadow-sm"
                    initial="rest"
                    variants={{
                      rest: { opacity: 0, y: 4 },
                      hover: { opacity: 1, y: 0 },
                    }}
                    animate={
                      isTouchLike
                        ? activeBottomTooltip === "branding"
                          ? "hover"
                          : "rest"
                        : hoveredBottomTooltip === "branding"
                          ? "hover"
                          : "rest"
                    }
                    transition={{
                      type: "tween",
                      duration: 0.2,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    Branding
                  </motion.div>
                </motion.div>

                {/* Web icon with tooltip */}
                <motion.div
                  className="relative flex w-[74px] flex-col items-center"
                  initial="rest"
                  variants={{
                    rest: {},
                    hover: {},
                  }}
                  onMouseEnter={() => setHoveredBottomTooltip("web")}
                  onMouseLeave={() => setHoveredBottomTooltip(null)}
                  onClick={() => {
                    if (!isTouchLike) return;
                    setActiveBottomTooltip((curr) => (curr === "web" ? null : "web"));
                  }}
                >
                  <div className="flex h-[74px] w-[74px] items-center justify-center rounded-2xl bg-[#F5F5F5]">
                    <Image
                      src="/web.svg"
                      alt="Web"
                      width={52}
                      height={52}
                      className="h-[52px] w-[52px]"
                    />
                  </div>
                  <motion.div
                    className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-3 -translate-x-1/2 rounded-[8px] bg-[#212121] px-2 py-1 text-[16px] font-semibold leading-[19px] tracking-[-0.04em] text-[#EDEDED] shadow-sm"
                    initial="rest"
                    variants={{
                      rest: { opacity: 0, y: 4 },
                      hover: { opacity: 1, y: 0 },
                    }}
                    animate={
                      isTouchLike
                        ? activeBottomTooltip === "web"
                          ? "hover"
                          : "rest"
                        : hoveredBottomTooltip === "web"
                          ? "hover"
                          : "rest"
                    }
                    transition={{
                      type: "tween",
                      duration: 0.2,
                      ease: [0.25, 0.1, 0.25, 1],
                    }}
                  >
                    <span className="whitespace-nowrap">Web + Development</span>
                  </motion.div>
                </motion.div>
              </div>
            </div>

            {/* Right: contact list */}
            <div className="mt-8 flex w-[93px] flex-col items-start gap-3 md:mt-0">
              <span className="text-[11px] font-semibold leading-[18px] tracking-[0.04em] text-[#BBBBBB]">
                CONTACT
              </span>
              <div className="flex flex-col items-start gap-3">
                <a
                  href="https://cal.com/hazarnlnl/intro-with-hazar"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackBookCallClick("bottom_section")}
                  className="text-[12px] font-medium leading-[14px] tracking-[-0.02em] text-[#A8A8A8] transition-colors duration-200 ease-out hover:text-[#282829]"
                >
                  Book Call
                </a>
                <a
                  href="https://x.com/hazarnlnl"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackTwitterClick("bottom_section")}
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
                <a
                  href="https://t.me/hazarnlnl"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackTelegramClick("bottom_section")}
                  className="text-[12px] font-medium leading-[14px] tracking-[-0.02em] text-[#A8A8A8] transition-colors duration-200 ease-out hover:text-[#282829]"
                >
                  Telegram
                </a>
              </div>
            </div>
          </div>
        </motion.section>
      </main>

      <motion.nav
        className={`fixed bottom-6 left-1/2 flex -translate-x-1/2 items-center gap-[7.89px] px-0 py-0 ${showBottomNav ? "" : "pointer-events-none"}`}
        initial={false}
        animate={{
          opacity: showBottomNav ? 1 : 0,
          y: showBottomNav ? 0 : 16,
        }}
        transition={{ type: "tween", duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
      >
        <a
          href="https://cal.com/hazarnlnl/intro-with-hazar"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackBookCallClick("bottom_nav")}
          onMouseMove={(e) => handleCtaButtonMouseMove(e, "book-nav")}
          onMouseLeave={handleCtaButtonMouseLeave}
          className="group flex h-[43px] w-[113.9px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#2D2D2D] bg-[#12141B] px-3 py-3 transition-colors duration-150 hover:bg-[#242938]"
        >
          <Image
            src="/bookcallicon.svg"
            alt="Book call"
            width={16}
            height={16}
            className="transition-transform duration-200 ease-out"
            style={{
              transform:
                iconFollow.id === "book-nav"
                  ? `translate(${iconFollow.x}px, ${iconFollow.y}px)`
                  : "translate(0px, 0px)",
            }}
          />
          <span className="whitespace-nowrap text-[15.77px] font-semibold leading-[19px] tracking-[-0.04em] text-white">
            Book Call
          </span>
        </a>
        <a
          href="https://t.me/hazarnlnl"
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackTelegramClick("bottom_nav")}
          onMouseMove={(e) => handleCtaButtonMouseMove(e, "chat-nav")}
          onMouseLeave={handleCtaButtonMouseLeave}
          className="group flex h-[43px] w-[81.9px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#DADADA] bg-white px-3 py-3 transition-colors duration-150 hover:bg-[#F5F5F5]"
        >
          <Image
            src="/chaticon.svg"
            alt="Chat"
            width={16}
            height={16}
            className="transition-transform duration-200 ease-out"
            style={{
              transform:
                iconFollow.id === "chat-nav"
                  ? `translate(${iconFollow.x}px, ${iconFollow.y}px)`
                  : "translate(0px, 0px)",
            }}
          />
          <span className="whitespace-nowrap text-[15.77px] font-semibold leading-[19px] tracking-[-0.04em] text-[#2F2F2F]">
            Chat
          </span>
        </a>
      </motion.nav>
    </div>
  );
}
