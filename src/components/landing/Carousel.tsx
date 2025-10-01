"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

type CarouselProps = {
  items: Array<React.ReactNode>
  className?: string
}

export default function Carousel({ items, className }: CarouselProps) {
  const ref = useRef<HTMLDivElement | null>(null)

  const scrollBy = (delta: number) => {
    const el = ref.current
    if (!el) return
    el.scrollBy({ left: delta, behavior: "smooth" })
  }

  return (
    <div className={"relative " + (className ?? "")}> 
      <button
        aria-label="Previous"
        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-background/80 border shadow hover:bg-accent"
        onClick={() => scrollBy(-320)}
      >
        <ChevronLeft className="h-4 w-4"></ChevronLeft>
      </button>
      <div
        ref={ref}
        className="overflow-x-auto scroll-smooth snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none]"
        style={{ scrollbarWidth: "none" as any }}
      >
        <div className="flex gap-4 min-w-full pr-6">
          {items.map((item, idx) => (
            <div key={idx} className="snap-start shrink-0 w-[320px]">
              {item}
            </div>
          ))}
        </div>
      </div>
      <button
        aria-label="Next"
        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center h-8 w-8 rounded-full bg-background/80 border shadow hover:bg-accent"
        onClick={() => scrollBy(320)}
      >
        <ChevronRight className="h-4 w-4"></ChevronRight>
      </button>
    </div>
  )
}


