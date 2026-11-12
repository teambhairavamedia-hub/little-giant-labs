/* Matches the dashboard layout: summary cards on top, the applications table full width below */
export function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)]">
        <div className="h-72 animate-pulse rounded-2xl border border-[#e8e8e6] bg-white" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="h-28 animate-pulse rounded-2xl border border-[#e8e8e6] bg-white sm:h-full" />
          <div className="h-28 animate-pulse rounded-2xl border border-[#e8e8e6] bg-white sm:h-full" />
          <div className="h-28 animate-pulse rounded-2xl border border-[#e8e8e6] bg-white sm:h-full" />
        </div>
      </div>
      <div className="h-[560px] animate-pulse rounded-2xl border border-[#e8e8e6] bg-white" />
    </div>
  );
}
