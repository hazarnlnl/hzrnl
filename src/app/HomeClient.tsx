"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

export type ProjectForDisplay = {
  id: string;
  imageUrl: string;
  alt: string | null;
};

type HomeClientProps = { projects: ProjectForDisplay[] };

const SIDE_PANEL_WIDTH = 536;

const CLIENT_LOGOS = [
  "/Frame-174.svg",
  "/Frame-18.svg",
  "/Frame-175.svg",
  "/Frame-177.svg",
  "/Frame-178.svg",
  "/Frame-176.svg",
];

export default function HomeClient({ projects }: HomeClientProps) {
  const [showCopied, setShowCopied] = useState(false);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText("hi@hzrnl.com");
    setShowCopied(true);
    setTimeout(() => setShowCopied(false), 1500);
  };

  return (
    <div className="relative min-h-screen bg-[#FCFCFC]">
      {/* Side panel: fixed on desktop, static on mobile/tablet */}
      <aside
        className="flex flex-col justify-between p-4 lg:fixed lg:left-0 lg:top-0 lg:h-screen"
        style={{ width: "100%" }}
      >
        <style jsx>{`
          @media (min-width: 1024px) {
            aside {
              width: ${SIDE_PANEL_WIDTH}px !important;
            }
          }
        `}</style>
        {/* Top section */}
        <div className="flex w-full flex-col gap-11">
          {/* Top bar: logo left, icons right */}
          <div className="flex w-full items-center justify-between">
            <Image
              src="/justlogo.svg"
              alt="Logo"
              width={53}
              height={28}
              className="h-7 w-auto"
            />
            <div className="flex flex-row items-center gap-4">
              <div className="relative">
                <button
                  type="button"
                  onClick={handleCopyEmail}
                  className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 hover:bg-[#F0F0F0]"
                  title="Copy email"
                >
                  <Image
                    src="/maillogo.svg"
                    alt="Email"
                    width={12}
                    height={12}
                    className="h-3.5 w-3.5"
                  />
                </button>
                <AnimatePresence>
                  {showCopied && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-[#212121] px-2 py-1 text-[12px] font-medium text-white"
                    >
                      Mail Copied!
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <a
                href="https://x.com/hazarnlnl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-7 w-7 cursor-pointer items-center justify-center rounded-full transition-colors duration-150 hover:bg-[#F0F0F0]"
              >
                <Image
                  src="/twitterlogo.svg"
                  alt="X / Twitter"
                  width={15}
                  height={12}
                  className="h-3.5 w-auto"
                />
              </a>
            </div>
          </div>

          {/* Heading + subtext + buttons */}
          <div className="flex flex-col gap-7">
            <h1 className="max-w-[304px] text-[20px] font-medium leading-[24px] tracking-[-0.02em] text-black">
              Design that turns your idea into something you&apos;re proud to ship.
            </h1>
            <p className="max-w-[381px] text-[14px] font-semibold leading-[132.28%] tracking-[-0.02em] text-[#767676]">
              Partnership for founders across product, brand, and web. Crafted with the kind of attention that makes people stop and notice.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-row items-end gap-[7.89px]" style={{ filter: "drop-shadow(0px 0px 24px rgba(0, 0, 0, 0.05))" }}>
              <a
                href="https://cal.com/hazarnlnl/intro-with-hazar"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[33px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#2D2D2D] bg-[#12141B] px-3 py-2 transition-colors duration-150 hover:bg-[#242938]"
              >
                <Image
                  src="/bookcallicon.svg"
                  alt="Book call"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="whitespace-nowrap text-[14px] font-semibold leading-[17px] tracking-[-0.04em] text-white">
                  Book Call
                </span>
              </a>
              <a
                href="https://t.me/hazarnlnl"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-[33px] flex-row items-center justify-center gap-[6.9px] rounded-full border border-[#DADADA] bg-white px-3 py-2 transition-colors duration-150 hover:bg-[#F5F5F5]"
              >
                <Image
                  src="/chaticon.svg"
                  alt="Chat"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="whitespace-nowrap text-[14px] font-semibold leading-[17px] tracking-[-0.04em] text-[#2F2F2F]">
                  Chat
                </span>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom section – trusted by + logos */}
        <div className="mt-[168px] flex w-full max-w-[488px] flex-col gap-2 lg:mt-0">
          <span className="text-[12px] font-medium leading-[132.28%] tracking-[-0.02em] text-[#B5B5B5]">
            Trusted by founders:
          </span>
          <div className="grid grid-cols-3 gap-x-3 gap-y-3 rounded-md px-2.5 py-1.5">
            {CLIENT_LOGOS.map((src, i) => (
              <Image
                key={i}
                src={src}
                alt={`Client logo ${i + 1}`}
                width={55}
                height={12}
                className="h-4 w-[65px] object-contain"
              />
            ))}
          </div>
        </div>
      </aside>

      {/* Right side – vertically scrollable images */}
      <main className="min-h-screen lg:ml-[536px]">
        <div className="flex w-full flex-col gap-3 px-3 pt-3 pb-3">
          {projects.map((project) => (
            <Image
              key={project.id}
              src={project.imageUrl}
              alt={project.alt ?? "Project"}
              width={1000}
              height={600}
              className="h-auto w-full shrink-0 rounded-[20px] border border-[#EBEBEB] object-cover will-change-transform"
              loading="eager"
            />
          ))}
        </div>
      </main>
    </div>
  );
}
