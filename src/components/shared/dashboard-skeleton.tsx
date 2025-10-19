import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardSkeleton() {
  return (
    <div className="flex h-screen bg-background">
      <div className="w-72 border-r flex flex-col h-full">
        <div className="border-b px-3 py-2">
          <div className="flex items-center justify-between mb-4">
            <Skeleton className="h-6 w-16"></Skeleton>
            <Skeleton className="h-8 w-8 rounded-full"></Skeleton>
          </div>
          <div className="space-y-2">
            <Skeleton className="h-8 w-full"></Skeleton>
            <Skeleton className="h-8 w-full"></Skeleton>
          </div>
        </div>
        <div className="flex-1 px-3 py-3">
          <Skeleton className="h-4 w-24 mb-3"></Skeleton>
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-16 w-full rounded-lg"></Skeleton>
            ))}
          </div>
        </div>
      </div>
      <main className="flex-1 overflow-hidden">
        <div className="p-4">
          <Skeleton className="h-12 w-64 mb-6"></Skeleton>
          <div className="space-y-4">
            <Skeleton className="h-4 w-full"></Skeleton>
            <Skeleton className="h-4 w-5/6"></Skeleton>
            <Skeleton className="h-4 w-4/6"></Skeleton>
          </div>
        </div>
      </main>
    </div>
  )
}


