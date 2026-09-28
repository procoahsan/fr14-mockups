import { createFileRoute, Link } from "@tanstack/react-router";
import { AlertTriangle } from "lucide-react";
import { Fr14Page, NoteBox, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { PublicationBadge, StatusBadge } from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import { effectiveAccess, REPORTS } from "@/data/fr14";

export const Route = createFileRoute("/publication")({
  head: () => ({
    meta: [
      { title: "Publication Readiness — PVSIS FR14" },
      {
        name: "description",
        content:
          "De-identification and publication readiness for Key Concepts and Umbrella Concepts.",
      },
      { property: "og:title", content: "Publication Readiness — PVSIS FR14" },
      {
        property: "og:description",
        content: "De-identification status before public release of concepts.",
      },
    ],
  }),
  component: PublicationPage,
});

const CONCEPT_TYPES = ["Key Concepts", "Umbrella Concepts"] as const;

function PublicationPage() {
  const rows = REPORTS.flatMap((r) =>
    CONCEPT_TYPES.map((ct) => {
      const row = r.dataAccess.find((d) => d.dataType === ct)!;
      return {
        key: `${r.id}-${ct}`,
        reportId: r.id,
        country: r.country,
        report: r.reference,
        conceptType: ct,
        access: effectiveAccess(row),
        identifying: r.publication.identifyingRemaining,
        deid: r.publication.deidentification,
        status: r.publication.status,
        reviewer: r.publication.reviewer,
      };
    }),
  );

  const held = rows.filter((r) => r.status === "Publication Held" && r.access === "Public");

  return (
    <Fr14Page>
      <PageHeading
        title="Publication Readiness"
        subtitle="Concepts marked Public may only be released once identifying information has been removed."
        breadcrumb="Confidentiality Management / Publication Readiness"
      />

      {held.length > 0 && (
        <NoteBox tone="danger">
          <span className="flex items-center gap-2">
            <AlertTriangle className="size-4" />
            Publication held — identifying information remains on {held.length} concept record(s).
          </span>
        </NoteBox>
      )}

      <Panel title={`Concept records (${rows.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="px-3 py-2 font-semibold">Country</th>
                <th className="px-3 py-2 font-semibold">Report</th>
                <th className="px-3 py-2 font-semibold">Concept type</th>
                <th className="px-3 py-2 font-semibold">Effective access</th>
                <th className="px-3 py-2 font-semibold">Identifying information</th>
                <th className="px-3 py-2 font-semibold">De-identification</th>
                <th className="px-3 py-2 font-semibold">Publication status</th>
                <th className="px-3 py-2 font-semibold">Reviewer</th>
                <th className="px-3 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.key} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-3 py-3 font-semibold">{r.country}</td>
                  <td className="px-3 py-3 font-mono text-xs">{r.report}</td>
                  <td className="px-3 py-3">{r.conceptType}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={r.access} size="sm" />
                  </td>
                  <td className="px-3 py-3">
                    {r.identifying === 0 ? (
                      <span className="text-muted-foreground">None remaining</span>
                    ) : (
                      <span className="font-semibold text-destructive">
                        {r.identifying} item(s) remaining
                      </span>
                    )}
                  </td>
                  <td className="px-3 py-3">
                    <PublicationBadge status={r.deid} />
                  </td>
                  <td className="px-3 py-3">
                    <PublicationBadge status={r.status} />
                  </td>
                  <td className="px-3 py-3">{r.reviewer}</td>
                  <td className="px-3 py-3">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/reports/$reportId" params={{ reportId: r.reportId }}>
                        Open report
                      </Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Responsible role and evidence requirements for publication readiness are proposed and
          still to be confirmed by the business.
        </p>
      </Panel>
    </Fr14Page>
  );
}
