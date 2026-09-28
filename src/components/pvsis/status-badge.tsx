import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Confidentiality } from "@/data/fr14";

export const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
  {
    variants: {
      tone: {
        neutral: "border-border bg-muted text-muted-foreground",
        success: "border-success/30 bg-success-soft text-success",
        info: "border-info/30 bg-info-soft text-info",
        danger: "border-destructive/30 bg-danger-soft text-destructive",
        warning: "border-warning/40 bg-warning-soft text-warning-foreground",
        brand: "border-primary/30 bg-primary-soft text-primary",
      },
      size: {
        sm: "px-2 py-0 text-[11px]",
        md: "",
      },
    },
    defaultVariants: { tone: "neutral", size: "md" },
  },
);

export type Tone = NonNullable<VariantProps<typeof badgeVariants>["tone"]>;

export function Pill({
  children,
  tone,
  size,
  className,
}: {
  children: React.ReactNode;
  tone?: Tone | undefined;
  size?: "sm" | "md" | undefined;
  className?: string | undefined;
}) {
  return <span className={cn(badgeVariants({ tone, size }), className)}>{children}</span>;
}

const confidentialityTone: Record<Confidentiality, Tone> = {
  Public: "success",
  "Partners & Donors": "info",
  Confidential: "danger",
  Other: "warning",
};

export function StatusBadge({
  status,
  size,
  className,
}: {
  status: Confidentiality;
  size?: "sm" | "md" | undefined;
  className?: string | undefined;
}) {
  return (
    <Pill tone={confidentialityTone[status]} size={size} className={className}>
      <span className="size-1.5 rounded-full bg-current" />
      {status}
    </Pill>
  );
}

export function PublicationBadge({ status }: { status: string }) {
  const tone: Tone =
    status === "Ready" || status === "Complete"
      ? "success"
      : status === "Publication Held" || status === "Not Started"
        ? "danger"
        : "warning";
  return <Pill tone={tone}>{status}</Pill>;
}

export function ConsentBadge({ status }: { status: string }) {
  const tone: Tone =
    status === "Approved" || status === "Authorized" || status === "Successful"
      ? "success"
      : status === "Declined" || status === "Failed" || status === "Withdrawn"
        ? "danger"
        : status === "Sent" || status === "Closed" || status === "Reviewed"
          ? "info"
          : "warning";
  return <Pill tone={tone}>{status}</Pill>;
}

export function AccessLegend({ className }: { className?: string | undefined }) {
  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-x-6 gap-y-2 rounded-md bg-surface px-4 py-3 text-xs text-muted-foreground",
        className,
      )}
    >
      <span className="font-semibold text-foreground">Legend</span>
      <span>
        <strong className="text-foreground">Default</strong> — inherited system/admin value
      </span>
      <span>
        <strong className="text-foreground">Override</strong> — explicit country decision
      </span>
      <span>
        <strong className="text-foreground">Effective</strong> — actual resulting access
      </span>
    </div>
  );
}
