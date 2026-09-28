import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { AlertTriangle, Plus } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { AuditDrawer } from "@/components/pvsis/audit-drawer";
import { Field, Fr14Page, NoteBox, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import {
  AccessLegend,
  ConsentBadge,
  Pill,
  PublicationBadge,
  StatusBadge,
} from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  auditFor,
  CONFIDENTIALITY_VALUES,
  effectiveAccess,
  RECIPIENTS,
  REPORTS,
  type Confidentiality,
  type DataAccessRow,
} from "@/data/fr14";

export const Route = createFileRoute("/reports/$reportId")({
  loader: ({ params }) => {
    const report = REPORTS.find((r) => r.id === params.reportId);
    if (!report) throw notFound();
    return { report };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Report not found — PVSIS FR14" }, { name: "robots", content: "noindex" }] };
    }
    const title = `${loaderData.report.country} — ${loaderData.report.reportType} confidentiality | PVSIS`;
    const description = `Confidentiality and data-level access for ${loaderData.report.reference}.`;
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
      ],
    };
  },
  component: ReportDetail,
});

const OVERRIDE_NONE = "None";

function ReportDetail() {
  const { report } = Route.useLoaderData();
  const [overall, setOverall] = useState<Confidentiality>(report.overall);
  const [rows, setRows] = useState<DataAccessRow[]>(report.dataAccess);
  const [dirty, setDirty] = useState(false);
  const recipients = RECIPIENTS.filter((r) => r.reportId === report.id);

  const setOverride = (dataType: string, value: string) => {
    setRows((prev) =>
      prev.map((r) =>
        r.dataType === dataType
          ? { ...r, override: value === OVERRIDE_NONE ? null : (value as Confidentiality) }
          : r,
      ),
    );
    setDirty(true);
  };

  const publicationHeld =
    report.publication.status === "Publication Held" &&
    rows.some(
      (r) =>
        (r.dataType === "Key Concepts" || r.dataType === "Umbrella Concepts") &&
        effectiveAccess(r) === "Public",
    );

  return (
    <Fr14Page>
      <PageHeading
        breadcrumb={
          <>
            <Link to="/reports" className="hover:text-primary">
              Country Reports
            </Link>{" "}
            / {report.reference}
          </>
        }
        title={`${report.country} — ${report.reportType}`}
        subtitle="Overall report confidentiality and data-level access are managed separately."
        actions={
          <>
            <AuditDrawer entries={auditFor(report.id)} title={`History — ${report.reference}`} />
            <Button
              variant="outline"
              onClick={() => {
                setDirty(false);
                toast("Draft saved", { description: "Your changes are kept as a draft." });
              }}
            >
              Save draft
            </Button>
            <Button
              onClick={() => {
                setDirty(false);
                toast.success("Confidentiality update submitted", {
                  description: "PVSIS has recorded the submission and notified Business Admin.",
                });
              }}
            >
              Submit update
            </Button>
          </>
        }
      />

      <Panel>
        <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
          <Field label="Country" value={report.country} />
          <Field label="Report type" value={report.reportType} />
          <Field label="Report reference" value={report.reference} />
          <Field label="Mission date" value={report.missionDate} />
          <Field label="Current overall status" value={<StatusBadge status={report.overall} />} />
          <Field label="Period" value={report.period} />
          <Field label="Last updated" value={report.lastUpdated} />
          <Field label="Last updated by" value={report.updatedBy} />
        </div>
        {dirty && (
          <div className="mt-5">
            <NoteBox tone="warning">
              Unsaved changes. Changing confidentiality does not share the report — distribution is
              a separate action.
            </NoteBox>
          </div>
        )}
      </Panel>

      <Tabs defaultValue="confidentiality">
        <TabsList>
          <TabsTrigger value="confidentiality">Confidentiality</TabsTrigger>
          <TabsTrigger value="recipients">Authorized Recipients ({recipients.length})</TabsTrigger>
          <TabsTrigger value="publication">Publication Readiness</TabsTrigger>
        </TabsList>

        <TabsContent value="confidentiality" className="mt-4 space-y-6">
          <Panel
            title="Overall Confidentiality"
            description="Applies to the report as a whole. Data inside the report can differ."
          >
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {CONFIDENTIALITY_VALUES.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => {
                    setOverall(value);
                    setDirty(true);
                  }}
                  className={`rounded-md border px-4 py-3 text-left transition-colors ${
                    overall === value
                      ? "border-primary bg-primary-soft"
                      : "border-border hover:bg-surface"
                  }`}
                >
                  <StatusBadge status={value} />
                  <p className="mt-2 text-xs text-muted-foreground">{DESCRIPTIONS[value]}</p>
                </button>
              ))}
            </div>
          </Panel>

          <Panel
            title="Data-Level Access"
            description="Default, Delegate override and the resulting effective access per data type."
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-[820px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                    <th className="px-3 py-2 font-semibold">Data type</th>
                    <th className="px-3 py-2 font-semibold">Default / inherited</th>
                    <th className="px-3 py-2 font-semibold">Delegate override</th>
                    <th className="bg-surface px-3 py-2 font-semibold">Effective access</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row) => (
                    <tr key={row.dataType} className="border-b border-border last:border-0">
                      <td className="px-3 py-3 font-semibold">
                        {row.dataType}
                        {row.note && (
                          <span className="block text-xs font-normal text-muted-foreground">
                            {row.note}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-3">
                        <StatusBadge status={row.defaultValue} size="sm" />
                      </td>
                      <td className="px-3 py-3">
                        <Select
                          value={row.override ?? OVERRIDE_NONE}
                          onValueChange={(v) => setOverride(row.dataType, v)}
                        >
                          <SelectTrigger className="w-[190px] bg-card">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value={OVERRIDE_NONE}>None (keep default)</SelectItem>
                            {CONFIDENTIALITY_VALUES.map((v) => (
                              <SelectItem key={v} value={v}>
                                {v}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="bg-surface px-3 py-3">
                        <StatusBadge status={effectiveAccess(row)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <AccessLegend className="mt-5" />
            {publicationHeld && (
              <div className="mt-4">
                <NoteBox tone="danger">
                  <span className="flex items-center gap-2">
                    <AlertTriangle className="size-4" /> Publication held — identifying information
                    remains.
                  </span>
                </NoteBox>
              </div>
            )}
          </Panel>
        </TabsContent>

        <TabsContent value="recipients" className="mt-4 space-y-6">
          <Panel
            title="Authorized Recipients"
            description="Who the country allows to receive this report or parts of it."
            actions={<AddRecipientDialog />}
          >
            <NoteBox tone="info">
              Authorization does not mean the report has already been sent. Permission for one data
              type does not authorize the complete report.
            </NoteBox>
            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[980px] text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                    <th className="px-3 py-2 font-semibold">Recipient</th>
                    <th className="px-3 py-2 font-semibold">Organization</th>
                    <th className="px-3 py-2 font-semibold">Type</th>
                    <th className="px-3 py-2 font-semibold">Email</th>
                    <th className="px-3 py-2 font-semibold">Authorized scope</th>
                    <th className="px-3 py-2 font-semibold">Authorized by</th>
                    <th className="px-3 py-2 font-semibold">Date</th>
                    <th className="px-3 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recipients.map((r) => (
                    <tr key={r.id} className="border-b border-border last:border-0">
                      <td className="px-3 py-3 font-semibold">{r.name}</td>
                      <td className="px-3 py-3">{r.organization}</td>
                      <td className="px-3 py-3">
                        <Pill>{r.type}</Pill>
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">{r.email}</td>
                      <td className="px-3 py-3">{r.scope}</td>
                      <td className="px-3 py-3">{r.authorizedBy}</td>
                      <td className="px-3 py-3">{r.date}</td>
                      <td className="px-3 py-3">
                        <ConsentBadge status={r.status} />
                      </td>
                    </tr>
                  ))}
                  {recipients.length === 0 && (
                    <tr>
                      <td colSpan={8} className="px-3 py-10 text-center text-muted-foreground">
                        No recipients authorized for this report yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Panel>
        </TabsContent>

        <TabsContent value="publication" className="mt-4 space-y-6">
          <Panel
            title="Publication Readiness"
            description="Concepts marked Public may only be released once identifying information has been removed."
          >
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              <Field
                label="De-identification status"
                value={<PublicationBadge status={report.publication.deidentification} />}
              />
              <Field
                label="Identifying content remaining"
                value={`${report.publication.identifyingRemaining} item(s)`}
              />
              <Field
                label="Publication readiness"
                value={<PublicationBadge status={report.publication.status} />}
              />
              <Field label="Evidence / status" value={report.publication.evidence} />
              <Field label="Responsible reviewer" value={report.publication.reviewer} />
            </div>
            {report.publication.status === "Publication Held" && (
              <div className="mt-5">
                <NoteBox tone="danger">
                  Publication held — identifying information remains.
                </NoteBox>
              </div>
            )}
            <p className="mt-4 text-xs text-muted-foreground">
              Responsibility and evidence requirements for publication readiness are proposed and
              still to be confirmed by the business.
            </p>
          </Panel>
        </TabsContent>
      </Tabs>
    </Fr14Page>
  );
}

const DESCRIPTIONS: Record<Confidentiality, string> = {
  Public: "WOAH may publish the report and use its data for anonymous analyses.",
  "Partners & Donors": "WOAH may share with Partners and Donors; anonymous analyses permitted.",
  Confidential: "External sharing restricted; requests referred to the country.",
  Other: "A specific alternative instruction. Its effect must be clear before acting.",
};

function AddRecipientDialog() {
  const [open, setOpen] = useState(false);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4" /> Add Authorized Recipient
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Authorize a recipient</DialogTitle>
          <DialogDescription>
            Authorization does not send the report. Sending is a separate action.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="rname">Recipient name</Label>
            <Input id="rname" placeholder="e.g. John Smith" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="remail">Email</Label>
            <Input id="remail" type="email" placeholder="name@organisation.org" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rorg">Organization</Label>
            <Input id="rorg" placeholder="Organization X" />
          </div>
          <div className="grid gap-2">
            <Label>Recipient category</Label>
            <Select defaultValue="Named Person">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {["Ministry", "Partner", "Donor", "Technical Partner", "Named Person"].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label>Report / data scope</Label>
            <Select defaultValue="Complete report">
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[
                  "Complete report",
                  "Level of Advancement (LoA) only",
                  "Key Concepts",
                  "Umbrella Concepts",
                  "Computed Indicators",
                ].map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rpurpose">Purpose</Label>
            <Input id="rpurpose" placeholder="e.g. Diplomatic transmission" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="rnotes">Notes</Label>
            <Textarea id="rnotes" rows={3} placeholder="Optional conditions or remarks" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setOpen(false);
              toast.success("Authorization saved", {
                description: "The recipient is authorized. The report has not been sent.",
              });
            }}
          >
            Save Authorization
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
