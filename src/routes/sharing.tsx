import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Fr14Page, NoteBox, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { ConsentBadge, Pill } from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import { RECIPIENTS, SHARING } from "@/data/fr14";

export const Route = createFileRoute("/sharing")({
  head: () => ({
    meta: [
      { title: "Authorization & Sharing — PVSIS FR14" },
      {
        name: "description",
        content:
          "Authorized recipients, actual sharing actions and delivery outcomes, kept clearly separate.",
      },
      { property: "og:title", content: "Authorization & Sharing — PVSIS FR14" },
      {
        property: "og:description",
        content: "Authorization, sharing and delivery outcome traceability in PVSIS.",
      },
    ],
  }),
  component: SharingPage,
});

function SharingPage() {
  return (
    <Fr14Page>
      <PageHeading
        title="Authorization & Sharing"
        subtitle="Authorization allows a recipient to receive material. Sharing is the separate act of sending it."
        breadcrumb="Confidentiality Management / Authorization & Sharing"
      />

      <Panel title="How it works">
        <div className="flex flex-wrap items-center gap-3 text-sm font-semibold">
          <span className="rounded-md border border-border bg-surface px-4 py-2">Authorization</span>
          <ArrowRight className="size-4 text-primary" />
          <span className="rounded-md border border-border bg-surface px-4 py-2">Sharing</span>
          <ArrowRight className="size-4 text-primary" />
          <span className="rounded-md border border-border bg-surface px-4 py-2">
            Delivery outcome
          </span>
        </div>
        <div className="mt-4">
          <NoteBox tone="info">
            A draft or failed delivery is not a successful sharing record.
          </NoteBox>
        </div>
      </Panel>

      <Panel title="Authorizations" description="What each recipient is permitted to receive.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {RECIPIENTS.map((r) => (
            <div key={r.id} className="rounded-md border border-border p-4">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="font-bold">{r.name}</div>
                  <div className="text-sm text-muted-foreground">{r.organization}</div>
                </div>
                <ConsentBadge status={r.status} />
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <div>
                  <span className="text-muted-foreground">Type: </span>
                  <Pill size="sm">{r.type}</Pill>
                </div>
                <div>
                  <span className="text-muted-foreground">Scope: </span>
                  {r.scope}
                </div>
                <div className="text-xs text-muted-foreground">
                  {r.authorizedBy} — {r.date} — {r.id}
                </div>
              </div>
              <Button
                size="sm"
                variant="outline"
                className="mt-4 w-full"
                disabled={r.status !== "Authorized"}
                onClick={() =>
                  toast("Sharing action prepared", {
                    description: `${r.name} — ${r.scope}. Review before sending via Mass Communication.`,
                  })
                }
              >
                Prepare sharing action
              </Button>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Sharing records" description="Sender, recipient, scope, date and delivery outcome.">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="px-3 py-2 font-semibold">Record</th>
                <th className="px-3 py-2 font-semibold">Authorization</th>
                <th className="px-3 py-2 font-semibold">Sender</th>
                <th className="px-3 py-2 font-semibold">Recipient</th>
                <th className="px-3 py-2 font-semibold">Report / scope</th>
                <th className="px-3 py-2 font-semibold">Date</th>
                <th className="px-3 py-2 font-semibold">Delivery</th>
              </tr>
            </thead>
            <tbody>
              {SHARING.map((s) => (
                <tr key={s.id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-3 py-3 font-mono text-xs font-semibold">{s.id}</td>
                  <td className="px-3 py-3 font-mono text-xs">{s.authorizationId}</td>
                  <td className="px-3 py-3">{s.sender}</td>
                  <td className="px-3 py-3">
                    {s.recipient}
                    <span className="block text-xs text-muted-foreground">{s.organization}</span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="font-mono text-xs">{s.report}</span>
                    <span className="block text-xs text-muted-foreground">{s.scope}</span>
                  </td>
                  <td className="px-3 py-3">{s.date}</td>
                  <td className="px-3 py-3">
                    <ConsentBadge status={s.delivery} />
                    {s.note && (
                      <span className="mt-1 block text-xs text-destructive">{s.note}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Panel>
    </Fr14Page>
  );
}
