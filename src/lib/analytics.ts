/**
 * GA4 event tracking. Use from client components only.
 * View in GA4: Reports → Engagement → Events (or Realtime).
 */

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (
      command: "event" | "config" | "js",
      targetId: string,
      config?: Record<string, unknown>
    ) => void;
  }
}

type ClickLocation =
  | "header"
  | "menu_popup"
  | "bottom_section"
  | "bottom_nav";

function trackEvent(
  eventName: string,
  params?: Record<string, string | undefined>
) {
  if (typeof window === "undefined") return;
  const payload = params ? { ...params } : {};
  if (window.gtag) {
    window.gtag("event", eventName, payload as Record<string, unknown>);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(["event", eventName, payload]);
  }
}

export function trackMenuPillClick() {
  trackEvent("menu_open", { button: "menu_pill" });
}

export function trackBookCallClick(location: ClickLocation) {
  trackEvent("cta_book_call", { location });
}

export function trackTelegramClick(location: ClickLocation) {
  trackEvent("cta_telegram", { location });
}

export function trackTwitterClick(location: ClickLocation) {
  trackEvent("cta_twitter", { location });
}
