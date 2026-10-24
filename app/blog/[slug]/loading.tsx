/**
 * Skeleton in the shape of the real post: header, then body lines. A spinner
 * tells you nothing is happening yet; this tells you what's coming and keeps
 * the layout from jumping when the content lands.
 */
function Line({ className = "" }: { className?: string }) {
  return (
    <div className={`bg-surface h-4 animate-pulse rounded-full ${className}`} />
  );
}

export default function BlogPostLoading() {
  return (
    <div className="pt-10 sm:pt-16" aria-busy="true" aria-label="Loading post">
      <Line className="w-24" />
      <div className="mt-6 space-y-2">
        <div className="bg-surface h-9 w-4/5 animate-pulse rounded-xl" />
        <div className="bg-surface h-9 w-2/5 animate-pulse rounded-xl" />
      </div>
      <div className="mt-5 space-y-2">
        <Line className="w-full max-w-2xl" />
        <Line className="w-3/5" />
      </div>
      <div className="mt-6 flex gap-2">
        <Line className="w-16" />
        <Line className="w-20" />
      </div>

      <div className="blog-measure mt-12 space-y-4 pb-16">
        <Line className="w-3/4" />
        <Line className="w-full" />
        <Line className="w-5/6" />
        <Line className="w-full" />
        <Line className="w-2/3" />
        <div className="bg-surface h-6 w-1/3 animate-pulse rounded-lg" />
        <Line className="w-full" />
        <Line className="w-4/5" />
      </div>
    </div>
  );
}
