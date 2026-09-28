import { Link } from "@tanstack/react-router";
import { AlertTriangle, Bell, ChevronDown, Mail, MessageCircle } from "lucide-react";

const TOP_NAV = ["HOME", "ABOUT", "DOCUMENTS", "INSIGHTS", "TOOLS", "PVS ASSISTANT"];

function WoahMark() {
  return (
    <div className="flex items-center gap-3">
      <svg viewBox="0 0 48 48" className="size-10 shrink-0" aria-hidden="true">
        <circle cx="24" cy="24" r="22" fill="none" stroke="var(--primary)" strokeWidth="3" />
        <path
          d="M12 30c4-10 10-14 20-16"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M15 36c5-12 12-17 22-19"
          fill="none"
          stroke="var(--primary)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <circle cx="19" cy="19" r="4" fill="var(--primary)" />
      </svg>
      <div className="hidden leading-4 sm:block">
        <div className="text-sm font-semibold">World Organisation</div>
        <div className="text-sm font-semibold">for Animal Health</div>
      </div>
      <div className="h-8 w-px bg-border" />
      <span className="font-display text-2xl font-bold tracking-wide">PVSIS</span>
    </div>
  );
}

export function PvsisHeader() {
  return (
    <header className="sticky top-0 z-40 bg-card">
      <div className="flex items-center justify-center gap-3 bg-primary px-4 py-2.5 text-center text-sm font-semibold text-primary-foreground">
        <AlertTriangle className="size-4" />
        This site is used for UAT only. Thanks for your understanding.
      </div>

      <div className="border-b border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center justify-between gap-4 px-6 py-3">
          <Link to="/">
            <WoahMark />
          </Link>

          <div className="flex items-center gap-5">
            <span className="hidden items-center gap-2 rounded-full border border-primary px-4 py-1.5 text-sm font-medium text-primary lg:inline-flex">
              <MessageCircle className="size-4" /> PPP Forum
            </span>
            <div className="text-right text-sm">
              <div className="flex items-center justify-end gap-1 font-semibold">
                Business Admin <ChevronDown className="size-4" />
              </div>
              <div className="text-xs font-semibold">( Business Admin )</div>
              <div className="flex items-center justify-end gap-2 pt-1 text-muted-foreground">
                <Mail className="size-3.5" />
                <span className="relative">
                  <Bell className="size-3.5" />
                  <span className="absolute -top-0.5 -right-0.5 size-1.5 rounded-full bg-primary" />
                </span>
                <span className="text-[11px]">
                  <span className="font-semibold text-foreground underline">EN</span> | FR | ES
                </span>
              </div>
            </div>
            <div className="size-10 rounded-full bg-info-soft" />
          </div>
        </div>
      </div>

      <nav className="border-b border-border">
        <div className="mx-auto flex max-w-[1400px] flex-wrap items-center gap-x-10 gap-y-2 px-6 py-3 text-sm font-medium tracking-wide">
          {TOP_NAV.map((item) => (
            <span
              key={item}
              className={
                item === "TOOLS"
                  ? "flex cursor-default items-center gap-1 text-primary"
                  : "cursor-default text-foreground/80 hover:text-primary"
              }
            >
              {item}
              {(item === "ABOUT" || item === "TOOLS") && <ChevronDown className="size-3.5" />}
            </span>
          ))}
          <span className="ml-auto cursor-default border-l border-border pl-8 text-foreground/80">
            NOTIFICATIONS
          </span>
        </div>
      </nav>
    </header>
  );
}

export function PvsisFooter() {
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="mx-auto max-w-[1400px] px-6 py-6 text-xs text-muted-foreground">
        PVSIS — World Organisation for Animal Health. FR14 Confidentiality Management prototype.
        Data shown is illustrative and does not represent actual country permissions.
      </div>
    </footer>
  );
}
