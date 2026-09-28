import { createFileRoute } from "@tanstack/react-router";
import { Field, Fr14Page, NoteBox, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { ConsentBadge } from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { DONOR_PERMISSIONS } from "@/data/fr14";

export const Route = createFileRoute("/donor-permissions")({
  head: () => ({
    meta: [
      { title: "Country Permission Requests — PVSIS FR14" },
      {
        name: "description",
        content:
          "Donor-specific country permission requests with per-country approve, decline or pending responses.",
      },
      { property: "og:title", content: "Country Permission Requests — PVSIS FR14" },
      {
        property: "og:description",
        content: "Donor-, country-, purpose- and scope-specific permission responses.",
      },
    ],
  }),
  component: DonorPermissionsPage,
});

function DonorPermissionsPage() {
  return (
    <Fr14Page>
      <PageHeading
        title="Country Permission Request"
        subtitle="Donor-specific permission. Each response applies only to that donor, country, purpose and scope."
        breadcrumb="Confidentiality Management / Donor Permissions"
      />

      <NoteBox tone="warning">
        Donor approval does not make country data generally Public, does not cover another donor or
        purpose, and a pending response is not approval.
      </NoteBox>

      {DONOR_PERMISSIONS.map((p) => (
        <Panel
          key={p.id}
          title={p.donor}
          description={`${p.id} — requested ${p.requestedOn}`}
          actions={
            <Button
              size="sm"
              variant="outline"
              onClick={() =>
                toast("Reminder sent", { description: "Pending countries have been reminded." })
              }
            >
              Send reminder
            </Button>
          }
        >
          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            <Field label="Donor" value={p.donor} />
            <Field label="Purpose" value={p.purpose} />
            <Field label="Countries" value={p.countries.map((c) => c.country).join(", ")} />
            <Field label="Requested data" value={p.requestedData} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {p.countries.map((c) => (
              <div key={c.country} className="rounded-md border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <h3 className="text-lg font-bold">{c.country}</h3>
                  <ConsentBadge status={c.status} />
                </div>
                <dl className="mt-3 space-y-2 text-sm">
                  <div>
                    <dt className="text-xs text-muted-foreground">Scope</dt>
                    <dd>{c.scope}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Donor / purpose</dt>
                    <dd>
                      {p.donor} — {p.purpose}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Response</dt>
                    <dd>{c.response}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted-foreground">Date</dt>
                    <dd>{c.date}</dd>
                  </div>
                  {c.conditions && (
                    <div>
                      <dt className="text-xs text-muted-foreground">Conditions</dt>
                      <dd>{c.conditions}</dd>
                    </div>
                  )}
                </dl>
                {c.status === "Pending" && (
                  <div className="mt-4 flex gap-2">
                    <Button
                      size="sm"
                      onClick={() =>
                        toast.success(`${c.country} response recorded`, {
                          description: "Approved for this donor, purpose and scope only.",
                        })
                      }
                    >
                      Approve
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toast(`${c.country} response recorded as declined`)}
                    >
                      Decline
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
          <p className="mt-4 text-xs text-muted-foreground">
            Whether consent applies to future reports, and consent expiry or withdrawal rules, are
            configurable and still to be confirmed.
          </p>
        </Panel>
      ))}
    </Fr14Page>
  );
}
