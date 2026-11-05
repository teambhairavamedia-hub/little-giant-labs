import type { QualificationStatus } from "./types";

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
