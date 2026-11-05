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

export function DashboardMetrics({ metrics }: DashboardMetricsProps) {
  return (
    <section aria-label="Application metrics" className="flex flex-col gap-4">
      <Metric label="Total applications" value={metrics.totalApplications} />
      <Metric label="New applications · last 7 days" value={metrics.newApplicationsLast7Days} />
      <Metric label="Qualified · last 7 days" value={metrics.qualifiedApplicationsLast7Days} />
    </section>
  );
}
