// Mock FR14 data. Illustrative only — these values do not represent real
// country confidentiality decisions.

export type Confidentiality = "Public" | "Partners & Donors" | "Confidential" | "Other";

export type DataType =
  | "Raw Text"
  | "Level of Advancement (LoA)"
  | "Key Concepts"
  | "Umbrella Concepts"
  | "Computed Indicators";

export const DATA_TYPES: DataType[] = [
  "Raw Text",
  "Level of Advancement (LoA)",
  "Key Concepts",
  "Umbrella Concepts",
  "Computed Indicators",
];

export const CONFIDENTIALITY_VALUES: Confidentiality[] = [
  "Public",
  "Partners & Donors",
  "Confidential",
  "Other",
];

export type DataAccessRow = {
  dataType: DataType;
  defaultValue: Confidentiality;
  override: Confidentiality | null;
  note?: string | undefined;
};

export type PublicationStatus = "Ready" | "In Progress" | "Publication Held";

export type Report = {
  id: string;
  country: string;
  reportType: "Evaluation" | "Evaluation Follow-Up" | "Gap Analysis" | "SAAR";
  reference: string;
  period: string;
  missionDate: string;
  overall: Confidentiality;
  lastUpdated: string;
  updatedBy: string;
  dataAccess: DataAccessRow[];
  publication: {
    deidentification: "Complete" | "In Progress" | "Not Started";
    identifyingRemaining: number;
    status: PublicationStatus;
    evidence: string;
    reviewer: string;
  };
};

export function effectiveAccess(row: DataAccessRow): Confidentiality {
  return row.override ?? row.defaultValue;
}

const da = (
  dataType: DataType,
  defaultValue: Confidentiality,
  override: Confidentiality | null = null,
  note?: string,
): DataAccessRow => ({ dataType, defaultValue, override, note });

export const REPORTS: Report[] = [
  {
    id: "PK-EV-2024",
    country: "Pakistan",
    reportType: "Evaluation",
    reference: "PVS/EV/PAK/2024-07",
    period: "2024",
    missionDate: "12 Mar 2024",
    overall: "Confidential",
    lastUpdated: "18 Sep 2026",
    updatedBy: "A. Rahman (Delegate)",
    dataAccess: [
      da("Raw Text", "Confidential"),
      da("Level of Advancement (LoA)", "Public"),
      da("Key Concepts", "Public", "Confidential", "Country override pending publication review"),
      da("Umbrella Concepts", "Public"),
      da("Computed Indicators", "Partners & Donors"),
    ],
    publication: {
      deidentification: "In Progress",
      identifyingRemaining: 4,
      status: "Publication Held",
      evidence: "De-identification checklist v2 — 4 named facilities outstanding",
      reviewer: "M. Duval (WOAH Publication Review)",
    },
  },
  {
    id: "KE-EV-2025",
    country: "Kenya",
    reportType: "Evaluation",
    reference: "PVS/EV/KEN/2025-02",
    period: "2025",
    missionDate: "05 Feb 2025",
    overall: "Partners & Donors",
    lastUpdated: "02 Sep 2026",
    updatedBy: "Business Admin",
    dataAccess: [
      da("Raw Text", "Confidential"),
      da("Level of Advancement (LoA)", "Public"),
      da("Key Concepts", "Public"),
      da("Umbrella Concepts", "Public"),
      da("Computed Indicators", "Public"),
    ],
    publication: {
      deidentification: "Complete",
      identifyingRemaining: 0,
      status: "Ready",
      evidence: "Reviewed and signed off 28 Aug 2026",
      reviewer: "L. Ochieng (WOAH Publication Review)",
    },
  },
  {
    id: "NP-EVF-2025",
    country: "Nepal",
    reportType: "Evaluation Follow-Up",
    reference: "PVS/EVF/NPL/2025-09",
    period: "2025",
    missionDate: "22 Sep 2025",
    overall: "Confidential",
    lastUpdated: "25 Sep 2026",
    updatedBy: "S. Thapa (Delegate)",
    dataAccess: [
      da("Raw Text", "Confidential"),
      da("Level of Advancement (LoA)", "Public", "Confidential", "Explicit country decision"),
      da("Key Concepts", "Partners & Donors"),
      da("Umbrella Concepts", "Partners & Donors"),
      da("Computed Indicators", "Partners & Donors"),
    ],
    publication: {
      deidentification: "Not Started",
      identifyingRemaining: 11,
      status: "Publication Held",
      evidence: "Awaiting de-identification pass",
      reviewer: "Unassigned",
    },
  },
  {
    id: "ZW-GA-2024",
    country: "Zimbabwe",
    reportType: "Gap Analysis",
    reference: "PVS/GA/ZWE/2024-11",
    period: "2024",
    missionDate: "14 Nov 2024",
    overall: "Public",
    lastUpdated: "11 Aug 2026",
    updatedBy: "T. Moyo (Delegate)",
    dataAccess: [
      da("Raw Text", "Partners & Donors"),
      da("Level of Advancement (LoA)", "Public"),
      da("Key Concepts", "Public"),
      da("Umbrella Concepts", "Public"),
      da("Computed Indicators", "Public"),
    ],
    publication: {
      deidentification: "Complete",
      identifyingRemaining: 0,
      status: "Ready",
      evidence: "Published extract approved 09 Aug 2026",
      reviewer: "M. Duval (WOAH Publication Review)",
    },
  },
  {
    id: "PK-SAAR-2025",
    country: "Pakistan",
    reportType: "SAAR",
    reference: "SAAR/PAK/2025",
    period: "2025",
    missionDate: "—",
    overall: "Other",
    lastUpdated: "20 Sep 2026",
    updatedBy: "A. Rahman (Delegate)",
    dataAccess: [
      da("Raw Text", "Confidential"),
      da("Level of Advancement (LoA)", "Partners & Donors"),
      da("Key Concepts", "Confidential"),
      da("Umbrella Concepts", "Confidential"),
      da("Computed Indicators", "Partners & Donors", "Public", "Shared for regional dashboard"),
    ],
    publication: {
      deidentification: "In Progress",
      identifyingRemaining: 2,
      status: "In Progress",
      evidence: "Catalogue for SAAR still to be confirmed (proposed)",
      reviewer: "Business Admin",
    },
  },
  {
    id: "KE-GA-2023",
    country: "Kenya",
    reportType: "Gap Analysis",
    reference: "PVS/GA/KEN/2023-06",
    period: "2023",
    missionDate: "18 Jun 2023",
    overall: "Partners & Donors",
    lastUpdated: "14 Jul 2026",
    updatedBy: "Business Admin",
    dataAccess: [
      da("Raw Text", "Confidential"),
      da("Level of Advancement (LoA)", "Partners & Donors"),
      da("Key Concepts", "Partners & Donors"),
      da("Umbrella Concepts", "Public"),
      da("Computed Indicators", "Public"),
    ],
    publication: {
      deidentification: "Complete",
      identifyingRemaining: 0,
      status: "Ready",
      evidence: "Checklist complete 10 Jul 2026",
      reviewer: "L. Ochieng (WOAH Publication Review)",
    },
  },
  {
    id: "NP-EV-2023",
    country: "Nepal",
    reportType: "Evaluation",
    reference: "PVS/EV/NPL/2023-04",
    period: "2023",
    missionDate: "03 Apr 2023",
    overall: "Confidential",
    lastUpdated: "21 Jun 2026",
    updatedBy: "S. Thapa (Delegate)",
    dataAccess: [
      da("Raw Text", "Confidential"),
      da("Level of Advancement (LoA)", "Confidential"),
      da("Key Concepts", "Confidential"),
      da("Umbrella Concepts", "Confidential"),
      da("Computed Indicators", "Confidential"),
    ],
    publication: {
      deidentification: "Not Started",
      identifyingRemaining: 7,
      status: "Publication Held",
      evidence: "No public scope requested",
      reviewer: "Unassigned",
    },
  },
  {
    id: "ZW-SAAR-2025",
    country: "Zimbabwe",
    reportType: "SAAR",
    reference: "SAAR/ZWE/2025",
    period: "2025",
    missionDate: "—",
    overall: "Public",
    lastUpdated: "30 Aug 2026",
    updatedBy: "T. Moyo (Delegate)",
    dataAccess: [
      da("Raw Text", "Partners & Donors"),
      da("Level of Advancement (LoA)", "Public"),
      da("Key Concepts", "Public", null, "De-identification outstanding"),
      da("Umbrella Concepts", "Public"),
      da("Computed Indicators", "Public"),
    ],
    publication: {
      deidentification: "In Progress",
      identifyingRemaining: 3,
      status: "Publication Held",
      evidence: "3 identifying references in Key Concepts",
      reviewer: "M. Duval (WOAH Publication Review)",
    },
  },
];

export const COUNTRIES = ["Pakistan", "Kenya", "Nepal", "Zimbabwe"];
export const REPORT_TYPES = ["Evaluation", "Evaluation Follow-Up", "Gap Analysis", "SAAR"];
export const PERIODS = ["2023", "2024", "2025"];

export type Recipient = {
  id: string;
  name: string;
  organization: string;
  type: "Ministry" | "Partner" | "Donor" | "Technical Partner" | "Named Person";
  email: string;
  scope: string;
  authorizedBy: string;
  date: string;
  status: "Authorized" | "Pending" | "Withdrawn";
  reportId: string;
};

export const RECIPIENTS: Recipient[] = [
  {
    id: "AUTH-1041",
    name: "Ministry of National Food Security",
    organization: "Government of Pakistan",
    type: "Ministry",
    email: "records@mnfsr.gov.pk",
    scope: "Complete Evaluation Report",
    authorizedBy: "A. Rahman (Delegate)",
    date: "18 Sep 2026",
    status: "Authorized",
    reportId: "PK-EV-2024",
  },
  {
    id: "AUTH-1042",
    name: "John Smith",
    organization: "Organization X",
    type: "Named Person",
    email: "j.smith@organization-x.org",
    scope: "Complete Evaluation Report",
    authorizedBy: "A. Rahman (Delegate)",
    date: "19 Sep 2026",
    status: "Authorized",
    reportId: "PK-EV-2024",
  },
  {
    id: "AUTH-1043",
    name: "Pandemic Fund Secretariat",
    organization: "Pandemic Fund",
    type: "Donor",
    email: "reporting@pandemicfund.org",
    scope: "LoA only — Annual Reporting",
    authorizedBy: "Business Admin (on country response)",
    date: "12 Sep 2026",
    status: "Pending",
    reportId: "PK-EV-2024",
  },
  {
    id: "AUTH-1044",
    name: "Dr. Alice Wanjiku",
    organization: "Regional Technical Institute",
    type: "Technical Partner",
    email: "a.wanjiku@rti.example",
    scope: "Key Concepts + Computed Indicators",
    authorizedBy: "Delegate of Kenya",
    date: "02 Sep 2026",
    status: "Authorized",
    reportId: "KE-EV-2025",
  },
  {
    id: "AUTH-1045",
    name: "Global Health Partners",
    organization: "GHP",
    type: "Partner",
    email: "data@ghp.example",
    scope: "LoA only",
    authorizedBy: "T. Moyo (Delegate)",
    date: "11 Aug 2026",
    status: "Withdrawn",
    reportId: "ZW-GA-2024",
  },
];

export type SharingRecord = {
  id: string;
  authorizationId: string;
  recipient: string;
  organization: string;
  sender: string;
  report: string;
  scope: string;
  date: string;
  delivery: "Successful" | "Failed" | "Sent" | "Draft";
  note?: string | undefined;
};

export const SHARING: SharingRecord[] = [
  {
    id: "SHR-2201",
    authorizationId: "AUTH-1042",
    recipient: "John Smith",
    organization: "Organization X",
    sender: "Mission Manager — C. Perrin",
    report: "PVS/EV/PAK/2024-07",
    scope: "Complete Evaluation Report",
    date: "20 Sep 2026 14:12",
    delivery: "Successful",
  },
  {
    id: "SHR-2202",
    authorizationId: "AUTH-1041",
    recipient: "Ministry of National Food Security",
    organization: "Government of Pakistan",
    sender: "Mission Manager — C. Perrin",
    report: "PVS/EV/PAK/2024-07",
    scope: "Complete Evaluation Report",
    date: "21 Sep 2026 09:40",
    delivery: "Failed",
    note: "Mailbox rejected the attachment. Not recorded as a delivery.",
  },
  {
    id: "SHR-2203",
    authorizationId: "AUTH-1044",
    recipient: "Dr. Alice Wanjiku",
    organization: "Regional Technical Institute",
    sender: "Authorized Sender — N. Abbas",
    report: "PVS/EV/KEN/2025-02",
    scope: "Key Concepts + Computed Indicators",
    date: "03 Sep 2026 11:05",
    delivery: "Sent",
  },
  {
    id: "SHR-2204",
    authorizationId: "AUTH-1044",
    recipient: "Dr. Alice Wanjiku",
    organization: "Regional Technical Institute",
    sender: "Authorized Sender — N. Abbas",
    report: "PVS/GA/KEN/2023-06",
    scope: "Umbrella Concepts",
    date: "—",
    delivery: "Draft",
  },
];

export type DataRequest = {
  id: string;
  requester: string;
  email: string;
  organization: string;
  intendedUse: string;
  countries: string[];
  reports: string;
  requestedData: string[];
  submitted: string;
  status: "Open" | "In Progress" | "Closed";
  assessment: { covered: string[]; needsPermission: string[] };
};

export const DATA_REQUESTS: DataRequest[] = [
  {
    id: "REQ-3301",
    requester: "Maria Lopez",
    email: "m.lopez@pandemicfund.org",
    organization: "Pandemic Fund",
    intendedUse: "Annual reporting on investment outcomes",
    countries: ["Pakistan", "Kenya", "Nepal"],
    reports: "Evaluation & Evaluation Follow-Up, 2024–2025",
    requestedData: ["Level of Advancement (LoA)", "Computed Indicators"],
    submitted: "10 Sep 2026",
    status: "In Progress",
    assessment: {
      covered: [
        "Kenya — LoA is Public (effective access)",
        "Kenya — Computed Indicators are Public",
      ],
      needsPermission: [
        "Pakistan — Computed Indicators are Partners & Donors",
        "Nepal — LoA carries a Delegate override to Confidential",
      ],
    },
  },
  {
    id: "REQ-3302",
    requester: "Prof. Daniel Osei",
    email: "d.osei@university.example",
    organization: "University of Accra",
    intendedUse: "Comparative academic research on veterinary services",
    countries: ["Zimbabwe", "Kenya"],
    reports: "Gap Analysis, 2023–2024",
    requestedData: ["Key Concepts", "Umbrella Concepts"],
    submitted: "22 Sep 2026",
    status: "Open",
    assessment: {
      covered: ["Zimbabwe — Umbrella Concepts are Public"],
      needsPermission: [
        "Kenya — Key Concepts are Partners & Donors",
        "Zimbabwe — Key Concepts publication held pending de-identification",
      ],
    },
  },
  {
    id: "REQ-3303",
    requester: "Helena Braun",
    email: "h.braun@donor.example",
    organization: "Regional Development Bank",
    intendedUse: "Funding appraisal",
    countries: ["Nepal"],
    reports: "Evaluation, 2023",
    requestedData: ["Raw Text"],
    submitted: "04 Aug 2026",
    status: "Closed",
    assessment: {
      covered: [],
      needsPermission: ["Nepal — Raw Text is Confidential; country declined the request"],
    },
  },
];

export type ConsentStatus = "Pending" | "Approved" | "Declined";

export type DonorPermission = {
  id: string;
  donor: string;
  purpose: string;
  requestedData: string;
  requestedOn: string;
  countries: {
    country: string;
    status: ConsentStatus;
    scope: string;
    response: string;
    date: string;
    conditions?: string;
  }[];
};

export const DONOR_PERMISSIONS: DonorPermission[] = [
  {
    id: "CP-5501",
    donor: "Pandemic Fund",
    purpose: "Annual Reporting",
    requestedData: "Specific confidential data (LoA, Computed Indicators)",
    requestedOn: "12 Sep 2026",
    countries: [
      {
        country: "Pakistan",
        status: "Pending",
        scope: "LoA + Computed Indicators, Evaluation 2024",
        response: "Awaiting Delegate response",
        date: "—",
      },
      {
        country: "Kenya",
        status: "Approved",
        scope: "LoA + Computed Indicators, Evaluation 2025",
        response: "Approved for this donor and purpose only",
        date: "19 Sep 2026",
        conditions: "No onward transfer; aggregate use in the annual report only.",
      },
      {
        country: "Nepal",
        status: "Declined",
        scope: "LoA, Evaluation Follow-Up 2025",
        response: "Declined — data remains Confidential",
        date: "21 Sep 2026",
      },
    ],
  },
  {
    id: "CP-5502",
    donor: "Regional Development Bank",
    purpose: "Funding appraisal",
    requestedData: "Raw Text, Evaluation 2023",
    requestedOn: "06 Aug 2026",
    countries: [
      {
        country: "Nepal",
        status: "Declined",
        scope: "Raw Text, Evaluation 2023",
        response: "Declined by Delegate",
        date: "14 Aug 2026",
      },
    ],
  },
];

export type Notification = {
  id: string;
  country: string;
  report: string;
  change: string;
  previous: string;
  next: string;
  actor: string;
  datetime: string;
  status: "New" | "Reviewed";
  reason: string;
  reportId: string;
};

export const NOTIFICATIONS: Notification[] = [
  {
    id: "NTF-9001",
    country: "Pakistan",
    report: "PVS/EV/PAK/2024-07",
    change: "Key Concepts override added",
    previous: "Public (default)",
    next: "Confidential (Delegate override)",
    actor: "A. Rahman (Delegate)",
    datetime: "18 Sep 2026 10:22",
    status: "New",
    reason: "Named facilities still present in concepts.",
    reportId: "PK-EV-2024",
  },
  {
    id: "NTF-9002",
    country: "Nepal",
    report: "PVS/EVF/NPL/2025-09",
    change: "LoA access changed",
    previous: "Public (default)",
    next: "Confidential (Delegate override)",
    actor: "S. Thapa (Delegate)",
    datetime: "25 Sep 2026 08:47",
    status: "New",
    reason: "Country decision pending national review.",
    reportId: "NP-EVF-2025",
  },
  {
    id: "NTF-9003",
    country: "Zimbabwe",
    report: "SAAR/ZWE/2025",
    change: "Overall confidentiality changed",
    previous: "Partners & Donors",
    next: "Public",
    actor: "T. Moyo (Delegate)",
    datetime: "30 Aug 2026 16:03",
    status: "Reviewed",
    reason: "Country agreed to publication of the annual report.",
    reportId: "ZW-SAAR-2025",
  },
  {
    id: "NTF-9004",
    country: "Pakistan",
    report: "SAAR/PAK/2025",
    change: "Computed Indicators override added",
    previous: "Partners & Donors (default)",
    next: "Public (Delegate override)",
    actor: "A. Rahman (Delegate)",
    datetime: "20 Sep 2026 12:15",
    status: "Reviewed",
    reason: "Shared for the regional dashboard.",
    reportId: "PK-SAAR-2025",
  },
];

export type AuditEntry = {
  id: string;
  who: string;
  what: string;
  when: string;
  reason: string;
  previous: string;
  next: string;
};

export const AUDIT: Record<string, AuditEntry[]> = {
  "PK-EV-2024": [
    {
      id: "A-1",
      who: "A. Rahman (Delegate)",
      what: "Key Concepts access",
      when: "18 Sep 2026 10:22",
      reason: "Named facilities still present in concepts.",
      previous: "Public (default)",
      next: "Confidential (override)",
    },
    {
      id: "A-2",
      who: "Business Admin",
      what: "LoA default",
      when: "04 Jul 2026 09:10",
      reason: "Continuing default for Evaluation reports.",
      previous: "Partners & Donors",
      next: "Public",
    },
    {
      id: "A-3",
      who: "A. Rahman (Delegate)",
      what: "Overall confidentiality",
      when: "11 Apr 2024 15:31",
      reason: "Initial country instruction after mission.",
      previous: "—",
      next: "Confidential",
    },
  ],
};

export function auditFor(reportId: string): AuditEntry[] {
  return (
    AUDIT[reportId] ?? [
      {
        id: "A-0",
        who: "Business Admin",
        what: "Confidentiality record created",
        when: "—",
        reason: "Imported with report record.",
        previous: "—",
        next: "Default catalogue applied",
      },
    ]
  );
}

export const SUMMARY = {
  reportsManaged: REPORTS.length,
  confidential: REPORTS.filter((r) => r.overall === "Confidential").length,
  pendingDelegateUpdates: NOTIFICATIONS.filter((n) => n.status === "New").length,
  pendingDataRequests: DATA_REQUESTS.filter((r) => r.status !== "Closed").length,
  pendingCountryPermissions: DONOR_PERMISSIONS.flatMap((d) => d.countries).filter(
    (c) => c.status === "Pending",
  ).length,
  publicationItems: REPORTS.filter((r) => r.publication.status !== "Ready").length,
};
