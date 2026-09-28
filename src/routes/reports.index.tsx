import { createFileRoute, Link } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Fr14Page, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { AccessLegend, StatusBadge } from "@/components/pvsis/status-badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CONFIDENTIALITY_VALUES,
  COUNTRIES,
  effectiveAccess,
  PERIODS,
  REPORTS,
  REPORT_TYPES,
} from "@/data/fr14";

export const Route = createFileRoute("/reports/")({
  head: () => ({
    meta: [
      { title: "Country Reports — PVSIS FR14" },
      {
        name: "description",
        content: "Confidentiality records for country PVS reports, with overall status and LoA access.",
      },
      { property: "og:title", content: "Country Reports — PVSIS FR14" },
      {
        property: "og:description",
        content: "Confidentiality records for country PVS reports in PVSIS.",
      },
    ],
  }),
  component: ReportsPage,
});

const ALL = "All";

function FilterSelect({
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
    <label className="block min-w-[150px] flex-1">
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

function ReportsPage() {
  const [q, setQ] = useState("");
  const [country, setCountry] = useState(ALL);
  const [type, setType] = useState(ALL);
  const [period, setPeriod] = useState(ALL);
  const [overall, setOverall] = useState(ALL);
  const [loa, setLoa] = useState(ALL);

  const rows = useMemo(
    () =>
      REPORTS.filter((r) => {
        const loaRow = r.dataAccess.find((d) => d.dataType === "Level of Advancement (LoA)")!;
        return (
          (country === ALL || r.country === country) &&
          (type === ALL || r.reportType === type) &&
          (period === ALL || r.period === period) &&
          (overall === ALL || r.overall === overall) &&
          (loa === ALL || effectiveAccess(loaRow) === loa) &&
          (q === "" ||
            `${r.country} ${r.reference} ${r.reportType} ${r.updatedBy}`
              .toLowerCase()
              .includes(q.toLowerCase()))
        );
      }),
    [q, country, type, period, overall, loa],
  );

  const reset = () => {
    setQ("");
    setCountry(ALL);
    setType(ALL);
    setPeriod(ALL);
    setOverall(ALL);
    setLoa(ALL);
  };

  return (
    <Fr14Page>
      <PageHeading
        title="Country Reports"
        subtitle="Confidentiality records per report. Overall status and data-level access are managed separately."
        breadcrumb="Confidentiality Management / Country Reports"
      />

      <Panel
        title="Filters"
        actions={
          <Button variant="ghost" size="sm" onClick={reset}>
            Clear filters
          </Button>
        }
      >
        <div className="flex flex-wrap gap-4">
          <label className="block min-w-[220px] flex-1">
            <span className="mb-1 block text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              Search
            </span>
            <div className="relative">
              <Search className="absolute top-2.5 left-3 size-4 text-muted-foreground" />
              <Input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Country, reference, updated by…"
                className="bg-card pl-9"
              />
            </div>
          </label>
          <FilterSelect label="Country" value={country} onChange={setCountry} options={COUNTRIES} />
          <FilterSelect label="Report type" value={type} onChange={setType} options={REPORT_TYPES} />
          <FilterSelect label="Year / period" value={period} onChange={setPeriod} options={PERIODS} />
          <FilterSelect
            label="Overall status"
            value={overall}
            onChange={setOverall}
            options={[...CONFIDENTIALITY_VALUES]}
          />
          <FilterSelect
            label="LoA access"
            value={loa}
            onChange={setLoa}
            options={[...CONFIDENTIALITY_VALUES]}
          />
        </div>
      </Panel>

      <Panel title={`Reports (${rows.length})`}>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-[11px] tracking-wide text-muted-foreground uppercase">
                <th className="px-3 py-2 font-semibold">Country</th>
                <th className="px-3 py-2 font-semibold">Report type</th>
                <th className="px-3 py-2 font-semibold">Reference</th>
                <th className="px-3 py-2 font-semibold">Period / mission</th>
                <th className="px-3 py-2 font-semibold">Overall status</th>
                <th className="px-3 py-2 font-semibold">LoA access</th>
                <th className="px-3 py-2 font-semibold">Last updated</th>
                <th className="px-3 py-2 font-semibold">Updated by</th>
                <th className="px-3 py-2 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => {
                const loaRow = r.dataAccess.find((d) => d.dataType === "Level of Advancement (LoA)")!;
                return (
                  <tr key={r.id} className="border-b border-border last:border-0 hover:bg-surface">
                    <td className="px-3 py-3 font-semibold">{r.country}</td>
                    <td className="px-3 py-3">{r.reportType}</td>
                    <td className="px-3 py-3 font-mono text-xs">{r.reference}</td>
                    <td className="px-3 py-3">
                      {r.period}
                      <span className="block text-xs text-muted-foreground">{r.missionDate}</span>
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={r.overall} />
                    </td>
                    <td className="px-3 py-3">
                      <StatusBadge status={effectiveAccess(loaRow)} size="sm" />
                      {loaRow.override && (
                        <span className="mt-1 block text-[11px] text-muted-foreground">
                          Delegate override
                        </span>
                      )}
                    </td>
                    <td className="px-3 py-3">{r.lastUpdated}</td>
                    <td className="px-3 py-3">{r.updatedBy}</td>
                    <td className="px-3 py-3">
                      <Button asChild size="sm" variant="outline">
                        <Link to="/reports/$reportId" params={{ reportId: r.id }}>
                          Manage
                        </Link>
                      </Button>
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-3 py-10 text-center text-muted-foreground">
                    No reports match these filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <AccessLegend className="mt-5" />
      </Panel>
    </Fr14Page>
  );
}
