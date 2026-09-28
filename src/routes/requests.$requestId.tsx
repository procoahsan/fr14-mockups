import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Check, ShieldAlert } from "lucide-react";
import { toast } from "sonner";
import { Field, Fr14Page, NoteBox, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { ConsentBadge } from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import { DATA_REQUESTS } from "@/data/fr14";

export const Route = createFileRoute("/requests/$requestId")({
  loader: ({ params }) => {
    const request = DATA_REQUESTS.find((r) => r.id === params.requestId);
    if (!request) throw notFound();
    return { request };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Request not found — PVSIS FR14" }, { name: "robots", content: "noindex" }],
      };
    }
    const title = `${loaderData.request.id} — Data request | PVSIS FR14`;
    const description = `Assessment of data request ${loaderData.request.id} from ${loaderData.request.organization}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: RequestDetail,
});

function RequestDetail() {
  const { request } = Route.useLoaderData();

  return (
    <Fr14Page>
      <PageHeading
        breadcrumb={
          <>
            <Link to="/requests" className="hover:text-primary">
              Data Requests
            </Link>{" "}
            / {request.id}
          </>
        }
        title={`Data Request ${request.id}`}
        subtitle="Business Admin assessment. The request itself does not grant access."
        actions={<ConsentBadge status={request.status} />}
      />

      <Panel title="Request">
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
          <Field label="Requester" value={request.requester} />
          <Field label="Contact" value={request.email} />
          <Field label="Organization" value={request.organization} />
          <Field label="Intended use" value={request.intendedUse} />
          <Field label="Countries" value={request.countries.join(", ")} />
          <Field label="Reports / periods" value={request.reports} />
          <Field label="Data requested" value={request.requestedData.join(", ")} />
          <Field label="Submitted" value={request.submitted} />
        </div>
      </Panel>

      <Panel
        title="Permission Assessment"
        description="What is already authorized, and what requires additional country permission."
      >
        <div className="grid gap-5 md:grid-cols-2">
          <div className="rounded-md border border-success/30 bg-success-soft p-4">
            <h3 className="flex items-center gap-2 font-bold text-success">
              <Check className="size-4" /> Already authorized
            </h3>
            <ul className="mt-2 space-y-1 text-sm">
              {request.assessment.covered.length === 0 ? (
                <li className="text-muted-foreground">Nothing in this request is already covered.</li>
              ) : (
                request.assessment.covered.map((c) => <li key={c}>• {c}</li>)
              )}
            </ul>
          </div>
          <div className="rounded-md border border-warning/40 bg-warning-soft p-4">
            <h3 className="flex items-center gap-2 font-bold text-warning-foreground">
              <ShieldAlert className="size-4" /> Requires country permission
            </h3>
            <ul className="mt-2 space-y-1 text-sm">
              {request.assessment.needsPermission.map((c) => (
                <li key={c}>• {c}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-5">
          <NoteBox tone="info">
            Permission for one data type (for example LoA) does not authorize the complete report.
          </NoteBox>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <Button
            onClick={() =>
              toast.success("Country permission requested", {
                description: "Affected Delegates have been asked a focused permission question.",
              })
            }
          >
            Request Country Permission
          </Button>
          <Button
            variant="outline"
            onClick={() =>
              toast("Authorized response prepared", {
                description: "Only data already covered by permissions is included.",
              })
            }
          >
            Prepare Authorized Response
          </Button>
          <Button asChild variant="ghost">
            <Link to="/donor-permissions">View country permission requests</Link>
          </Button>
        </div>
      </Panel>
    </Fr14Page>
  );
}
