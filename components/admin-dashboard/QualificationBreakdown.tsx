import { numberFormat, type QualificationCounts } from "./types";

interface BreakdownProps {
  label: string;
  count: number;
  percent: number;
  color: string;
  labelClass: string;
}

function Breakdown({ label, count, percent, color, labelClass }: BreakdownProps) {
  return (
    <li className="flex items-center gap-3">
      <span className="h-3 w-3 rounded-full" style={{ backgroundColor: color }} />
      <span className={`text-sm font-medium ${labelClass}`}>{label}</span>
      <span className="ml-auto text-sm font-semibold tabular-nums">
        {numberFormat.format(count)}{" "}
        <span className="font-normal text-[#6b6b6b]">({percent}%)</span>
      </span>
    </li>
  );
}

interface QualificationBreakdownProps {
  qualification: QualificationCounts;
}

export function QualificationBreakdown({ qualification }: QualificationBreakdownProps) {
  const qualified = qualification.qualified ?? 0;
  const rejected = qualification.rejected ?? 0;
  const pendingReview = qualification.pendingReview ?? 0;
  const breakdownTotal = qualified + rejected + pendingReview;
  const qualifiedPercent = breakdownTotal ? Math.round((qualified / breakdownTotal) * 100) : 0;
  const rejectedPercent = breakdownTotal ? Math.round((rejected / breakdownTotal) * 100) : 0;
  const pendingReviewPercent = breakdownTotal ? 100 - qualifiedPercent - rejectedPercent : 0;

  return (
    <section aria-labelledby="qualification-heading" className="rounded-2xl border border-[#e8e8e6] bg-white p-6 sm:p-8 lg:p-6">
      <div>
        <p className="label-eyebrow text-[#800000]">All time</p>
        <h2 id="qualification-heading" className="mt-3 text-2xl font-semibold">Qualification breakdown</h2>
      </div>
      {breakdownTotal === 0 ? (
        <p className="mt-7 text-sm text-[#6b6b6b]">No applications have been received.</p>
      ) : (
        <div className="mt-7 flex flex-col items-center gap-8 sm:flex-row lg:flex-col lg:gap-6">
          <div
            role="img"
            aria-label={`Application status: ${qualified} qualified (${qualifiedPercent}%), ${rejected} rejected (${rejectedPercent}%), ${pendingReview} pending review (${pendingReviewPercent}%)`}
            className="h-40 w-40 shrink-0 rounded-full"
            style={{
              background: `conic-gradient(#15803d 0% ${qualifiedPercent}%, #b91c1c ${qualifiedPercent}% ${qualifiedPercent + rejectedPercent}%, #0284c7 ${qualifiedPercent + rejectedPercent}% 100%)`,
            }}
          />
          <ul className="grid w-full gap-4 sm:grid-cols-3 lg:grid-cols-1 lg:gap-3">
            <Breakdown label="Qualified" count={qualified} percent={qualifiedPercent} color="#15803d" labelClass="text-green-800" />
            <Breakdown label="Rejected" count={rejected} percent={rejectedPercent} color="#b91c1c" labelClass="text-red-800" />
            <Breakdown label="Pending review" count={pendingReview} percent={pendingReviewPercent} color="#0284c7" labelClass="text-sky-800" />
          </ul>
        </div>
      )}
    </section>
  );
}
