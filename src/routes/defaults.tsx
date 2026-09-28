import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Fr14Page, NoteBox, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { AccessLegend, Pill, StatusBadge } from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import {
  CONFIDENTIALITY_VALUES,
  COUNTRIES,
  DATA_TYPES,
  effectiveAccess,
  PERIODS,
  REPORTS,
  REPORT_TYPES,
  type Confidentiality,
} from "@/data/fr14";

export const Route = createFileRoute("/defaults")({
  head: () => ({
    meta: [
      { title: "Confidentiality Defaults — PVSIS FR14" },
      {
        name: "description",
        content:
          "Business Admin defaults: apply one-time updates or continuing rules with an impact review.",
      },
      { property: "og:title", content: "Confidentiality Defaults — PVSIS FR14" },
      {
        property: "og:description",
        content: "Business Admin confidentiality defaults with impact review before applying.",
      },
    ],
  }),
  component: DefaultsPage,
});

const ALL = "All";

type MatrixRow = {
  key: string;
  reportId: string;
  country: string;
  report: string;
  reportType: string;
  period: string;
  dataType: string;
  defaultValue: Confidentiality;
  override: Confidentiality | null;
  effective: Confidentiality;
  publicationHeld: boolean;
};

const MATRIX: MatrixRow[] = REPORTS.flatMap((r) =>
  r.dataAccess.map((d) => ({
    key: `${r.id}-${d.dataType}`,
    reportId: r.id,
    country: r.country,
    report: r.reference,
    reportType: r.reportType,
    period: r.period,
    dataType: d.dataType,
    defaultValue: d.defaultValue,
    override: d.override,
    effective: effectiveAccess(d),
    publicationHeld: r.publication.status === "Publication Held",
  })),
);

function DefaultsPage() {
  const [country, setCountry] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [period, setPeriod] = useState(ALL);
  const [dataType, setDataType] = useState("Level of Advancement (LoA)");
  const [current, setCurrent] = useState(ALL);
  const [selected, setSelected] = useState<string[]>([]);
  const [newValue, setNewValue] = useState<Confidentiality>("Public");
  const [mode, setMode] = useState("one-time");
  const [reason, setReason] = useState("");
  const [reviewOpen, setReviewOpen] = useState(false);
  const [appliedChanges, setAppliedChanges] = useState<Record<string, Confidentiality>>({});

  const rows = useMemo(
    () =>
      MATRIX.map((m) => ({
        ...m,
        effective: appliedChanges[m.key] ?? m.effective,
      })).filter(
        (m) =>
          (country === ALL || m.country === country) &&
          (type === ALL || m.reportType === type) &&
          (period === ALL || m.period === period) &&
          (dataType === ALL || m.dataType === dataType) &&
          (current === ALL || m.effective === current),
      ),
    [appliedChanges, country, type, period, dataType, current],
  );

  const selectedRows = rows.filter((r) => selected.includes(r.key));
  const affectedCountries = [...new Set(selectedRows.map((r) => r.country))];
  const withOverride = selectedRows.filter((r) => r.override);
  const unchanged = selectedRows.filter((r) => r.effective === newValue);
  const willChange = selectedRows.filter((r) => r.effective !== newValue && !r.override);
  const publicationIssues = selectedRows.filter((r) => r.publicationHeld && newValue === "Public");
  const canReview = selected.length > 0 && willChange.length > 0;

  const toggle = (key: string) =>
    setSelected((s) => (s.includes(key) ? s.filter((k) => k !== key) : [...s, key]));

  return (
    <Fr14Page contentClassName="flex flex-col">
      <PageHeading
        title="Confidentiality Defaults"
        subtitle="Business Admin control panel for defaults, one-time updates and continuing rules."
        breadcrumb="Confidentiality Management / Confidentiality Defaults"
      />

      <Panel
        id="change-controls"
        title="Apply Change"
        className="order-3"
        description={
          selected.length > 0
            ? `${selected.length} record(s) selected. Choose the new access value, then review the impact.`
            : "Select records in the matrix to configure a change."
        }
        actions={
          selected.length > 0 ? (
            <Button variant="ghost" size="sm" onClick={() => setSelected([])}>
              Clear selection
            </Button>
          ) : undefined
        }
      >
        {selected.length > 0 && (
          <div className="mb-4 flex flex-wrap gap-2">
            {selectedRows.map((r) => (
              <Pill key={r.key} size="sm" tone="info">
                {r.country} — {r.report} — {r.dataType}
              </Pill>
            ))}
          </div>
        )}
        {selected.length === 0 && (
          <div className="mb-4">
            <NoteBox tone="info">
              Select one or more records in the matrix below to begin a change.
            </NoteBox>
          </div>
        )}
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-5">
            <div>
              <Label className="mb-2 block">Change type</Label>
              <RadioGroup
                value={mode}
                onValueChange={setMode}
                className="grid gap-3 sm:grid-cols-2"
              >
                <label className="flex cursor-pointer gap-3 rounded-md border border-border p-4 hover:bg-surface">
                  <RadioGroupItem value="one-time" className="mt-1" />
                  <span>
                    <span className="block font-semibold">One-time update</span>
                    <span className="text-xs text-muted-foreground">
                      Changes only the selected existing records.
                    </span>
                  </span>
                </label>
                <label className="flex cursor-pointer gap-3 rounded-md border border-border p-4 hover:bg-surface">
                  <RadioGroupItem value="continuing" className="mt-1" />
                  <span>
                    <span className="block font-semibold">Continuing default</span>
                    <span className="text-xs text-muted-foreground">
                      A rule for matching reports. Effect on future reports is configurable and to
                      be confirmed.
                    </span>
                  </span>
                </label>
              </RadioGroup>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="reason">Reason for change</Label>
              <Textarea
                id="reason"
                rows={3}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Why is this change being made?"
              />
            </div>
          </div>
          <div className="space-y-4 rounded-md bg-surface p-4">
            <div>
              <Label className="mb-2 block">New access value</Label>
              <Select value={newValue} onValueChange={(v) => setNewValue(v as Confidentiality)}>
                <SelectTrigger className="w-full bg-card">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CONFIDENTIALITY_VALUES.map((v) => (
                    <SelectItem key={v} value={v}>
                      {v}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <Button className="w-full" disabled={!canReview} onClick={() => setReviewOpen(true)}>
              Review impact
            </Button>
            <p className="text-xs text-muted-foreground">
              Add a reason before confirming this change.
            </p>
          </div>
        </div>
      </Panel>

      <Panel title="Scope" className="order-1">
        <div className="flex flex-wrap gap-4">
          <Picker
            label="Country / group"
            value={country}
            onChange={setCountry}
            options={COUNTRIES}
          />
          <Picker label="Report type" value={type} onChange={setType} options={REPORT_TYPES} />
          <Picker label="Year / period" value={period} onChange={setPeriod} options={PERIODS} />
          <Picker
            label="Data type"
            value={dataType}
            onChange={setDataType}
            options={[...DATA_TYPES]}
          />
          <Picker
            label="Current status"
            value={current}
            onChange={setCurrent}
            options={[...CONFIDENTIALITY_VALUES]}
          />
        </div>
      </Panel>

      <Panel
        title={`Matrix (${rows.length} records)`}
        className="order-2"
        actions={
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              setSelected(selected.length === rows.length ? [] : rows.map((r) => r.key))
            }
          >
            {selected.length === rows.length && rows.length > 0 ? "Clear all" : "Select all"}
          </Button>
        }
      >
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="w-10 px-3 py-2" />
                <th className="px-3 py-2 font-semibold">Country</th>
                <th className="px-3 py-2 font-semibold">Report</th>
                <th className="px-3 py-2 font-semibold">Data</th>
                <th className="px-3 py-2 font-semibold">Default</th>
                <th className="px-3 py-2 font-semibold">Delegate override</th>
                <th className="bg-surface px-3 py-2 font-semibold">Effective access</th>
                <th className="px-3 py-2 font-semibold">Selected change</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.key}
                  className={
                    selected.includes(r.key)
                      ? "border-b border-border bg-primary/10 last:border-0"
                      : "border-b border-border last:border-0 hover:bg-surface"
                  }
                >
                  <td className="px-3 py-3">
                    <Checkbox
                      checked={selected.includes(r.key)}
                      onCheckedChange={() => toggle(r.key)}
                      aria-label={`Select ${r.report} ${r.dataType}`}
                    />
                  </td>
                  <td className="px-3 py-3 font-semibold">{r.country}</td>
                  <td className="px-3 py-3 font-mono text-xs">{r.report}</td>
                  <td className="px-3 py-3">{r.dataType}</td>
                  <td className="px-3 py-3">
                    <StatusBadge status={r.defaultValue} size="sm" />
                  </td>
                  <td className="px-3 py-3">
                    {r.override ? (
                      <StatusBadge status={r.override} size="sm" />
                    ) : (
                      <Pill size="sm">None</Pill>
                    )}
                  </td>
                  <td className="bg-surface px-3 py-3">
                    <StatusBadge status={r.effective} />
                  </td>
                  <td className="px-3 py-3">
                    {selected.includes(r.key) ? (
                      r.effective === newValue ? (
                        <Pill size="sm">No change</Pill>
                      ) : (
                        <span className="font-semibold text-primary">-&gt; {newValue}</span>
                      )
                    ) : (
                      <span className="text-muted-foreground">Select to change</span>
                    )}
                  </td>
                </tr>
              ))}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-3 py-10 text-center text-muted-foreground">
                    No records in this scope.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AccessLegend className="mt-5" />
        {selected.length > 0 && (
          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-md border border-primary/25 bg-primary-soft px-4 py-3">
            <div>
              <p className="text-sm font-semibold">
                {selected.length} record{selected.length === 1 ? "" : "s"} ready to update
              </p>
              <p className="text-xs text-muted-foreground">
                Continue below to choose the new access value and review the impact.
              </p>
            </div>
            <Button asChild size="sm">
              <a href="#change-controls">Continue to change controls</a>
            </Button>
          </div>
        )}
      </Panel>

      <Sheet open={reviewOpen} onOpenChange={setReviewOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-xl">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold">Impact Review</SheetTitle>
          </SheetHeader>
          <div className="space-y-5 px-4 pb-8">
            <NoteBox tone="warning">
              You are about to change access for {selectedRows.length} record(s) across{" "}
              {affectedCountries.length} countries.
            </NoteBox>

            <ImpactBlock title="Countries affected" items={affectedCountries} />
            <ImpactBlock
              title="Records that will change"
              items={willChange.map((r) => `${r.country} — ${r.report} — ${r.dataType}`)}
              empty="No records change with this value."
            />
            <ImpactBlock
              title="Existing Delegate overrides (kept visible, not silently replaced)"
              items={withOverride.map(
                (r) => `${r.country} — ${r.report} — ${r.dataType} (override: ${r.override})`,
              )}
              empty="No Delegate overrides in the selection."
            />
            <ImpactBlock
              title="Records that will not change"
              items={unchanged.map((r) => `${r.country} — ${r.report} — ${r.dataType}`)}
              empty="None."
            />
            <ImpactBlock
              title="Publication readiness implications"
              items={publicationIssues.map(
                (r) =>
                  `${r.country} — ${r.report}: publication held, identifying information remains`,
              )}
              empty="No publication readiness issues detected."
            />

            <div className="rounded-md border border-border p-4 text-sm">
              <div>
                <span className="text-muted-foreground">Change type: </span>
                <strong>{mode === "one-time" ? "One-time update" : "Continuing default"}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">New value: </span>
                <strong>{newValue}</strong>
              </div>
              <div>
                <span className="text-muted-foreground">Reason: </span>
                {reason}
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setReviewOpen(false)}>
                Back
              </Button>
              <Button
                disabled={reason.trim() === ""}
                title={
                  reason.trim() === "" ? "Enter a reason for change before confirming" : undefined
                }
                onClick={() => {
                  setAppliedChanges((changes) => ({
                    ...changes,
                    ...Object.fromEntries(willChange.map((r) => [r.key, newValue])),
                  }));
                  setReviewOpen(false);
                  setSelected([]);
                  setReason("");
                  toast.success("Change applied", {
                    description: `${willChange.length} record(s) updated. Delegate overrides were preserved.`,
                  });
                }}
              >
                Confirm Change
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </Fr14Page>
  );
}

function ImpactBlock({
  title,
  items,
  empty,
}: {
  title: string;
  items: string[];
  empty?: string | undefined;
}) {
  return (
    <div>
      <h3 className="text-sm font-bold">{title}</h3>
      {items.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">{empty ?? "None."}</p>
      ) : (
        <ul className="mt-1 list-disc space-y-1 pl-5 text-sm">
          {items.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

function Picker({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  return (
    <label className="block min-w-[170px] flex-1">
      <span className="mb-1 block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
        {label}
      </span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full bg-card">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={ALL}>All</SelectItem>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </label>
  );
}
