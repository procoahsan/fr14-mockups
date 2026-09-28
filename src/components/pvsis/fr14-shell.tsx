import { Link, useRouterState } from "@tanstack/react-router";
import {
  FileText,
  History,
  Inbox,
  LayoutGrid,
  Send,
  Settings2,
  ShieldCheck,
  Stamp,
} from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Overview", icon: LayoutGrid },
  { to: "/reports", label: "Country Reports", icon: FileText },
  { to: "/defaults", label: "Confidentiality Defaults", icon: Settings2 },
  { to: "/requests", label: "Data Requests", icon: Inbox },
  { to: "/donor-permissions", label: "Donor Permissions", icon: ShieldCheck },
  { to: "/publication", label: "Publication Readiness", icon: Stamp },
  { to: "/sharing", label: "Authorization & Sharing", icon: Send },
  { to: "/notifications", label: "History & Notifications", icon: History },
] as const;

export function Fr14Nav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="pvsis-panel h-max p-2 lg:sticky lg:top-44">
      <div className="px-3 py-2 text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
        FR14
      </div>
      <ul className="space-y-0.5">
        {NAV.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to as string);
          return (
            <li key={item.to}>
              <Link
                to={item.to}
                className={cn(
                  "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors",
                  active
                    ? "bg-primary-soft font-semibold text-primary"
                    : "text-foreground/80 hover:bg-surface",
                )}
              >
                <item.icon className="size-4 shrink-0" />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function PageHeading({
  title,
  subtitle,
  actions,
  breadcrumb,
}: {
  title: string;
  subtitle?: string | undefined;
  actions?: ReactNode | undefined;
  breadcrumb?: ReactNode | undefined;
}) {
  return (
    <div className="pvsis-panel px-6 py-5">
      {breadcrumb && <div className="mb-2 text-xs text-muted-foreground">{breadcrumb}</div>}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">{title}</h1>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
      </div>
    </div>
  );
}

export function Fr14Page({
  children,
  contentClassName,
}: {
  children: ReactNode;
  contentClassName?: string | undefined;
}) {
  return (
    <div className="mx-auto grid max-w-[1400px] gap-6 px-6 py-6 lg:grid-cols-[250px_minmax(0,1fr)]">
      <Fr14Nav />
      <div className={cn("min-w-0 space-y-6", contentClassName)}>{children}</div>
    </div>
  );
}

export function Panel({
  id,
  title,
  description,
  actions,
  children,
  className,
}: {
  id?: string | undefined;
  title?: string | undefined;
  description?: string | undefined;
  actions?: ReactNode | undefined;
  children: ReactNode;
  className?: string | undefined;
}) {
  return (
    <section id={id} className={cn("pvsis-panel", className)}>
      {(title || actions) && (
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-6 py-4">
          <div>
            {title && <h2 className="text-xl font-bold">{title}</h2>}
            {description && <p className="text-sm text-muted-foreground">{description}</p>}
          </div>
          {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className="p-6">{children}</div>
    </section>
  );
}

export function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div>
      <div className="text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium">{value}</div>
    </div>
  );
}

export function NoteBox({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning" | "danger" | "success" | undefined;
}) {
  const map = {
    info: "border-info/30 bg-info-soft text-info",
    warning: "border-warning/40 bg-warning-soft text-warning-foreground",
    danger: "border-destructive/30 bg-danger-soft text-destructive",
    success: "border-success/30 bg-success-soft text-success",
  } as const;
  return (
    <div className={cn("rounded-md border px-4 py-3 text-sm font-medium", map[tone])}>
      {children}
    </div>
  );
}
