export default function Loading() {
  return (
    <div className="px-4 md:px-8 py-6 md:py-8 max-w-6xl mx-auto">
      {/* Header skeleton */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="h-8 w-48 bg-[#1A1A1C] rounded-md animate-pulse mb-2" />
          <div className="h-4 w-32 bg-[#1A1A1C] rounded-md animate-pulse" />
        </div>
        <div className="h-9 w-28 bg-[#1A1A1C] rounded-md animate-pulse" />
      </div>

      {/* Cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {[1, 2, 3].map(i => (
          <div key={i} className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-5">
            <div className="h-3 w-24 bg-[#1A1A1C] rounded animate-pulse mb-4" />
            <div className="h-8 w-16 bg-[#1A1A1C] rounded animate-pulse" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="bg-[#0F0F10] border border-[#1E1E20] rounded-lg p-5">
        <div className="h-3 w-32 bg-[#1A1A1C] rounded animate-pulse mb-6" />
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="flex items-center justify-between py-3.5 border-b border-[#1E1E20] last:border-0">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-[#1A1A1C] animate-pulse" />
              <div>
                <div className="h-3.5 w-36 bg-[#1A1A1C] rounded animate-pulse mb-1.5" />
                <div className="h-3 w-24 bg-[#1A1A1C] rounded animate-pulse" />
              </div>
            </div>
            <div className="h-5 w-16 bg-[#1A1A1C] rounded-full animate-pulse" />
          </div>
        ))}
      </div>
    </div>
  )
}
