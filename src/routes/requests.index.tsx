import { createFileRoute, Link } from "@tanstack/react-router";
import { Fr14Page, NoteBox, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { ConsentBadge } from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import { DATA_REQUESTS } from "@/data/fr14";

export const Route = createFileRoute("/requests/")({
  head: () => ({
    meta: [
      { title: "Data Requests — PVSIS FR14" },
      {
        name: "description",
        content: "PVS data requests received by Business Admin, with assessment status.",
      },
      { property: "og:title", content: "Data Requests — PVSIS FR14" },
      { property: "og:description", content: "PVS data requests and their assessment status." },
    ],
  }),
  component: RequestsPage,
});

function RequestsPage() {
  return (
    <Fr14Page>
      <PageHeading
        title="Data Requests"
        subtitle="Requests for PVS data are assessed by Business Admin before any country is asked."
        breadcrumb="Confidentiality Management / Data Requests"
      />

      <Panel>
        <NoteBox tone="info">
          A request status does not grant access, prove delivery, or remove a country restriction.
        </NoteBox>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[1050px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="px-3 py-2 font-semibold">Request ID</th>
                <th className="px-3 py-2 font-semibold">Requester</th>
                <th className="px-3 py-2 font-semibold">Organization</th>
                <th className="px-3 py-2 font-semibold">Intended use</th>
                <th className="px-3 py-2 font-semibold">Countries</th>
                <th className="px-3 py-2 font-semibold">Requested data</th>
                <th className="px-3 py-2 font-semibold">Submitted</th>
                <th className="px-3 py-2 font-semibold">Status</th>
                <th className="px-3 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {DATA_REQUESTS.map((r) => (
                <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface">
                  <td className="px-3 py-3 font-mono text-xs font-semibold">{r.id}</td>
                  <td className="px-3 py-3 font-semibold">{r.requester}</td>
                  <td className="px-3 py-3">{r.organization}</td>
                  <td className="px-3 py-3">{r.intendedUse}</td>
                  <td className="px-3 py-3">{r.countries.join(", ")}</td>
                  <td className="px-3 py-3">{r.requestedData.join(", ")}</td>
                  <td className="px-3 py-3">{r.submitted}</td>
                  <td className="px-3 py-3">
                    <ConsentBadge status={r.status} />
                  </td>
                  <td className="px-3 py-3">
                    <Button asChild size="sm" variant="outline">
                      <Link to="/requests/$requestId" params={{ requestId: r.id }}>
                        Review
                      </Link>
                    </Button>
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
