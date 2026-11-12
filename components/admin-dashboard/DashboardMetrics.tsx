import { numberFormat } from "./constants";

interface MetricProps {
  label: string;
  value: number;
}

function Metric({ label, value }: MetricProps) {
  return (
    <article className="rounded-2xl border border-[#e8e8e6] bg-white p-6">
      <p className="text-sm text-[#6b6b6b]">{label}</p>
      <p className="mt-3 text-4xl font-semibold tabular-nums">{numberFormat.format(value)}</p>
    </article>
  );
}

interface DashboardMetricsProps {
  metrics: {
    totalApplications: number;
    newApplicationsLast7Days: number;
    qualifiedApplicationsLast7Days: number;
  };
}

export function DashboardMetrics({ metrics, layout = "column" }: DashboardMetricsProps & { layout?: "column" | "row" }) {
  // "row": three cards side by side on wider screens (dashboard summary above the table)
  const className = layout === "row" ? "grid grid-cols-1 gap-4 sm:grid-cols-3 [&>article]:flex [&>article]:flex-col [&>article]:justify-between" : "flex flex-col gap-4";
  return (
    <section aria-label="Application metrics" className={className}>
      <Metric label="Total applications" value={metrics.totalApplications} />
      <Metric label="New applications · last 7 days" value={metrics.newApplicationsLast7Days} />
      <Metric label="Qualified · last 7 days" value={metrics.qualifiedApplicationsLast7Days} />
    </section>
  );
}
