import { Skeleton } from "@/components/ui/skeleton"

export default function EditorSkeleton() {
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between p-4 bg-background border-b">
        <Skeleton className="h-12 w-80"></Skeleton>
        <Skeleton className="h-4 w-24"></Skeleton>
      </div>
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-4">
          <Skeleton className="h-8 w-3/4"></Skeleton>
          <Skeleton className="h-4 w-full"></Skeleton>
          <Skeleton className="h-4 w-5/6"></Skeleton>
          <Skeleton className="h-4 w-4/6"></Skeleton>
          <Skeleton className="h-32 w-full"></Skeleton>
        </div>
      </div>
    </div>
  )
}


