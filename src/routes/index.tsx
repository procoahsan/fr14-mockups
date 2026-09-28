import { createFileRoute, Link } from "@tanstack/react-router";
import {
  FileText,
  History,
  Inbox,
  Send,
  Settings2,
  ShieldCheck,
  Stamp,
  ArrowRight,
} from "lucide-react";
import { Fr14Page, PageHeading, Panel } from "@/components/pvsis/fr14-shell";
import { AccessLegend } from "@/components/pvsis/status-badge";
import { SUMMARY } from "@/data/fr14";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Confidentiality Management — PVSIS FR14" },
      {
        name: "description",
        content:
          "Overview of report confidentiality, data access, authorizations and country permissions in PVSIS.",
      },
      { property: "og:title", content: "Confidentiality Management — PVSIS FR14" },
      {
        property: "og:description",
        content: "Overview of confidentiality, authorizations and country permissions in PVSIS.",
      },
    ],
  }),
  component: Index,
});

const SUMMARY_CARDS = [
  { label: "Reports Managed", value: SUMMARY.reportsManaged, to: "/reports" },
  { label: "Confidential Reports", value: SUMMARY.confidential, to: "/reports" },
  { label: "Pending Delegate Updates", value: SUMMARY.pendingDelegateUpdates, to: "/notifications" },
  { label: "Pending Data Requests", value: SUMMARY.pendingDataRequests, to: "/requests" },
  {
    label: "Pending Country Permissions",
    value: SUMMARY.pendingCountryPermissions,
    to: "/donor-permissions",
  },
  { label: "Publication Readiness Items", value: SUMMARY.publicationItems, to: "/publication" },
] as const;

const AREAS = [
  {
    to: "/reports",
    icon: FileText,
    title: "Country Reports",
    text: "Review and update overall confidentiality and data-level access per report.",
  },
  {
    to: "/defaults",
    icon: Settings2,
    title: "Confidentiality Defaults",
    text: "Business Admin defaults, one-time updates and continuing rules with impact review.",
  },
  {
    to: "/requests",
    icon: Inbox,
    title: "Data Requests",
    text: "Assess PVS data requests. A request does not itself grant access.",
  },
  {
    to: "/donor-permissions",
    icon: ShieldCheck,
    title: "Donor Permissions",
    text: "Donor-, country-, purpose- and scope-specific country permission.",
  },
  {
    to: "/publication",
    icon: Stamp,
    title: "Publication Readiness",
    text: "De-identification status for Key and Umbrella Concepts before release.",
  },
  {
    to: "/sharing",
    icon: Send,
    title: "Authorization & Sharing",
    text: "Authorized recipients, actual sharing actions and delivery outcomes.",
  },
  {
    to: "/notifications",
    icon: History,
    title: "History / Audit",
    text: "Delegate submissions, who changed what, when and why.",
  },
] as const;

function Index() {
  return (
    <Fr14Page>
      <PageHeading
        title="Confidentiality Management"
        subtitle="Manage report confidentiality, data access, authorizations and country permissions."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {SUMMARY_CARDS.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="pvsis-panel group px-5 py-4 transition-colors hover:border-primary"
          >
            <div className="text-4xl font-bold text-primary">{c.value}</div>
            <div className="mt-1 flex items-center gap-1 text-sm font-medium text-muted-foreground">
              {c.label}
              <ArrowRight className="size-3.5 opacity-0 transition-opacity group-hover:opacity-100" />
            </div>
          </Link>
        ))}
      </div>

      <Panel title="Manage" description="Everything in FR14, grouped by task.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {AREAS.map((a) => (
            <Link
              key={a.to}
              to={a.to}
              className="flex gap-3 rounded-md border border-border p-4 transition-colors hover:border-primary hover:bg-surface"
            >
              <a.icon className="mt-0.5 size-5 shrink-0 text-primary" />
              <div>
                <div className="font-semibold">{a.title}</div>
                <p className="mt-1 text-sm text-muted-foreground">{a.text}</p>
              </div>
            </Link>
          ))}
        </div>
        <AccessLegend className="mt-6" />
      </Panel>
    </Fr14Page>
  );
}
