export function DoctorDashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="h-28 animate-pulse rounded-[28px] bg-white/70" />
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="h-32 animate-pulse rounded-[24px] bg-white/70" />
        <div className="h-32 animate-pulse rounded-[24px] bg-white/70" />
        <div className="h-32 animate-pulse rounded-[24px] bg-white/70" />
      </div>
      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="h-[380px] animate-pulse rounded-[28px] bg-white/70" />
        <div className="h-[380px] animate-pulse rounded-[28px] bg-white/70" />
      </div>
    </div>
  );
}
