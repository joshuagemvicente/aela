import { Spinner } from "@/components/ui/spinner"
import Image from "next/image"

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      <div className="relative flex items-center justify-center">
        <Spinner size="lg" className="h-20 w-20"></Spinner>
        <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/aela.png" alt="Aela" width={48} height={48} className="animate-pulse"></Image>
        </div>
      </div>
    </div>
  )
}

