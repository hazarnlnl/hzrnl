const ROW_CLASS =
  "-mx-3 -my-2 flex items-center justify-between rounded-lg px-3 py-2 text-[13px] leading-[17px] font-normal uppercase text-[#141518]";

export default function Home() {
  return (
    <div className="flex min-h-dvh flex-col items-center bg-white px-4 pb-8">
      <main className="flex w-full flex-1 items-center justify-center">
        <div className="flex w-full max-w-[502px] flex-col gap-[72px] p-8 font-mono">
          <a
            href="https://thepromptjourney.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`${ROW_CLASS} transition-colors duration-150 hover:bg-[#F7F7F7] focus-visible:bg-[#F7F7F7] focus-visible:outline-none`}
          >
            <span>prompt journey</span>
            <span>2026</span>
          </a>
          <div className={`${ROW_CLASS} cursor-default opacity-30`} aria-disabled="true">
            <span>ıvy</span>
            <span>Coming soon</span>
          </div>
        </div>
      </main>

      <a
        href="https://cal.com/hazarnlnl/intro-with-hazar"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-[173px] items-center justify-between rounded-lg bg-[#F7F7F7] p-3 text-center text-[13px] leading-4 font-normal tracking-[-0.02em] text-[#3A3A3A] transition-colors duration-150 hover:bg-[#F0F0F0]"
      >
        <span>Book Meeting</span>
        <svg width="8" height="13" viewBox="0 0 8 13" fill="none" aria-hidden="true">
          <path d="M1 .5l6 6-6 6" stroke="#DADADA" strokeWidth="1.3" />
        </svg>
      </a>
    </div>
  );
}
