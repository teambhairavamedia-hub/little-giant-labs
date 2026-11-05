export function DashboardSkeleton() {
  return (
    <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
      <div className="min-w-0 lg:col-span-2">
        <div className="h-[560px] animate-pulse rounded-2xl border border-[#e8e8e6] bg-white" />
      </div>
      <div className="flex flex-col gap-6 lg:col-span-1">
        <div className="h-72 animate-pulse rounded-2xl border border-[#e8e8e6] bg-white" />
        <div className="flex flex-col gap-4">
          <div className="h-28 animate-pulse rounded-2xl border border-[#e8e8e6] bg-white" />
          <div className="h-28 animate-pulse rounded-2xl border border-[#e8e8e6] bg-white" />
          <div className="h-28 animate-pulse rounded-2xl border border-[#e8e8e6] bg-white" />
        </div>
      </div>
    </div>
  );
}
