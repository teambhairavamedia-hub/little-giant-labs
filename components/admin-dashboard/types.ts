export type QualificationStatus = "pending_review" | "qualified" | "rejected";

export type Application = {
  id: string;
  legal_name: string;
  contact_name: string | null;
  help_with: string | null;
  qualification_status: QualificationStatus;
  submitted_at: string;
  decision_maker_email: string;
  contact_phone: string | null;
  lead_source: unknown;
};

export type PaginationInfo = {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
};

export type QualificationCounts = {
  qualified: number;
  rejected: number;
  pendingReview: number;
};

export type DashboardMetricsData = {
  totalApplications: number;
  newApplicationsLast7Days: number;
  qualifiedApplicationsLast7Days: number;
  qualification: QualificationCounts;
  window: { startsAt: string; endsAt: string };
};

export type DashboardData = {
  applications: Application[];
  pagination: PaginationInfo;
  metrics: DashboardMetricsData;
};

/* Enquiry fields (contact form v2) plus legacy partnership-application answers kept on older rows */
export type ApplicationDetail = Application & {
  contact_role: string | null;
  project_details: string | null;
  company_size: string | null;
  industry_vertical: string | null;
  budget_range: string | null;
  timeline: string | null;
  ttm_revenue: string | null;
  monthly_ad_spend: string | null;
  growth_bottleneck: string | null;
  partnership_readiness: string | null;
  decision_maker_linkedin: string | null;
  rejection_reasons: unknown;
};

export type ActionFeedback = {
  type: "success" | "error";
  message: string;
};

export const rejectionLabels: Record<string, string> = {
  ttm_revenue_below_1m: "Trailing twelve-month revenue below $1 million",
  monthly_ad_spend_below_10k: "Monthly paid acquisition spend below $10,000",
  cheap_execution_vendor: "Seeking a low-cost, hands-off execution vendor",
};

export const statusLabels: Record<QualificationStatus, string> = {
  pending_review: "Pending review",
  qualified: "Qualified",
  rejected: "Rejected",
};

export const numberFormat = new Intl.NumberFormat("en-US");
export const dateFormat = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short", timeZone: "Asia/Kolkata" });
