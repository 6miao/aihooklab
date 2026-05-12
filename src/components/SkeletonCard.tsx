export default function SkeletonCard() {
  return (
    <div className="rounded-xl border border-border bg-bg-card p-5 animate-shimmer">
      <div className="flex justify-between items-start mb-4">
        <div className="h-5 w-16 bg-border rounded-full" />
        <div className="h-5 w-5 bg-border rounded" />
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-4 bg-border rounded w-full" />
        <div className="h-4 bg-border rounded w-3/4" />
        <div className="h-4 bg-border rounded w-1/2" />
      </div>
      <div className="border-t border-border pt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-5 w-12 bg-border rounded" />
          <div className="h-4 w-20 bg-border rounded" />
        </div>
        <div className="h-8 w-14 bg-border rounded-lg" />
      </div>
    </div>
  )
}
