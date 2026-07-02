export function CardSkeleton() {
  return (
    <div className="animate-pulse rounded-xl border bg-white overflow-hidden">
      <div className="aspect-video bg-slate-200" />
      <div className="p-4 space-y-3">
        <div className="h-5 bg-slate-200 rounded w-3/4" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
        <div className="flex gap-2">
          <div className="h-6 bg-slate-200 rounded-full w-20" />
          <div className="h-6 bg-slate-200 rounded-full w-16" />
        </div>
        <div className="flex justify-between items-center pt-2">
          <div className="h-6 bg-slate-200 rounded w-24" />
          <div className="h-8 bg-slate-200 rounded w-20" />
        </div>
      </div>
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="animate-pulse mx-auto max-w-7xl px-4 py-10">
      <div className="h-4 bg-slate-200 rounded w-48 mb-6" />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="aspect-video bg-slate-200 rounded-xl" />
          <div className="space-y-2">
            <div className="h-8 bg-slate-200 rounded w-3/4" />
            <div className="flex gap-2">
              <div className="h-6 bg-slate-200 rounded-full w-20" />
              <div className="h-6 bg-slate-200 rounded-full w-24" />
              <div className="h-6 bg-slate-200 rounded-full w-16" />
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-full" />
            <div className="h-4 bg-slate-200 rounded w-2/3" />
          </div>
        </div>
        <div>
          <div className="rounded-xl border bg-white p-6 space-y-4">
            <div className="h-8 bg-slate-200 rounded w-32" />
            <div className="h-4 bg-slate-200 rounded w-24" />
            <div className="space-y-3">
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
              <div className="h-10 bg-slate-200 rounded" />
            </div>
            <div className="h-12 bg-slate-200 rounded" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ListSkeleton({ count = 6 }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function TableSkeleton({ rows = 5 }) {
  return (
    <div className="animate-pulse">
      <div className="h-10 bg-slate-200 rounded mb-4" />
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-12 bg-slate-100 rounded mb-2" />
      ))}
    </div>
  );
}
