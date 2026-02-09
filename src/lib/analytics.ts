/**
 * GA4 event tracking. Use from client components only.
 * View in GA4: Reports → Engagement → Events (or Realtime).
 */

declare global {
  interface Window {
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
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", eventName, params as Record<string, unknown>);
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
