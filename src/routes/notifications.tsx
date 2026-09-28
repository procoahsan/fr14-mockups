import { createFileRoute, Link } from "@tanstack/react-router";
import { Fr14Page, NoteBox, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { AuditDrawer } from "@/components/pvsis/audit-drawer";
import { ConsentBadge, StatusBadge } from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import { auditFor, NOTIFICATIONS, REPORTS } from "@/data/fr14";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "History & Notifications — PVSIS FR14" },
      {
        name: "description",
        content: "Delegate confidentiality submissions and the full change history for PVSIS reports.",
      },
      { property: "og:title", content: "History & Notifications — PVSIS FR14" },
      {
        property: "og:description",
        content: "Who changed what, when and why across FR14 confidentiality records.",
      },
    ],
  }),
  component: NotificationsPage,
});

function NotificationsPage() {
  return (
    <Fr14Page>
      <PageHeading
        title="History & Notifications"
        subtitle="Delegate submissions recorded by PVSIS, with the previous and new values."
        breadcrumb="Confidentiality Management / History & Notifications"
      />

      <NoteBox tone="info">
        A Delegate submission notifies Business Admin. It is not an approval step.
      </NoteBox>

      <Panel title="Delegate changes">
        <div className="space-y-3">
          {NOTIFICATIONS.map((n) => (
            <div
              key={n.id}
              className="flex flex-wrap items-start justify-between gap-4 rounded-md border border-border p-4"
            >
              <div className="min-w-[260px] flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold">
                    {n.country} Delegate updated {n.report}
                  </span>
                  <ConsentBadge status={n.status} />
                </div>
                <p className="mt-1 text-sm">{n.change}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {n.previous} → <span className="font-semibold text-foreground">{n.next}</span>
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {n.actor} — {n.datetime} — Reason: {n.reason}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <AuditDrawer entries={auditFor(n.reportId)} label="Details" title={`History — ${n.report}`} />
                <Button asChild size="sm" variant="outline">
                  <Link to="/reports/$reportId" params={{ reportId: n.reportId }}>
                    Open report
                  </Link>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="Current status by report">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[780px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="px-3 py-2 font-semibold">Country</th>
                <th className="px-3 py-2 font-semibold">Report</th>
                <th className="px-3 py-2 font-semibold">Overall status</th>
                <th className="px-3 py-2 font-semibold">Last updated</th>
                <th className="px-3 py-2 font-semibold">Updated by</th>
                <th className="px-3 py-2 font-semibold">History</th>
              </tr>
            </thead>
            <tbody>
              {REPORTS.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-3 py-3 font-semibold">{r.country}</td>
                  <td className="px-3 py-3 font-mono text-xs">{r.reference}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={r.overall} size="sm" />
                  </td>
                  <td className="px-3 py-3">{r.lastUpdated}</td>
                  <td className="px-3 py-3">{r.updatedBy}</td>
                  <td className="px-3 py-3">
                    <AuditDrawer entries={auditFor(r.id)} title={`History — ${r.reference}`} />
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
