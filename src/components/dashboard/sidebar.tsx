"use client"

import { useEffect, useState, useCallback } from "react"
import { SidebarHeader } from "./sidebar-header"
import { SidebarContent } from "./sidebar-content"
import { Button } from "@/components/ui/button"
import { ChevronsLeft, ChevronsRight } from "lucide-react"

const SIDEBAR_STORAGE_KEY = "aela_sidebar_open"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (stored !== null) {
      setIsOpen(stored === "true")
    }
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(next))
      } catch {}
      return next
    })
  }, [])

  return (
    <div className="h-full">
      <div
        className={
          `bg-background border-r flex h-full transition-all duration-300 ease-in-out overflow-hidden ` +
          (isOpen ? "w-72" : "w-10")
        }
      >
        {isOpen ? (
          <div className="flex flex-col h-full w-full">
            <div className="border-b py-2 flex justify-between">
              <SidebarHeader />
              <Button aria-label="Collapse sidebar" variant="ghost" size="icon" onClick={toggle}>
                <ChevronsLeft className="h-4 w-4"></ChevronsLeft>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 py-3">
                <SidebarContent />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center h-full w-10 py-2">
            <Button aria-label="Expand sidebar" variant="ghost" size="icon" onClick={toggle}>
              <ChevronsRight className="h-4 w-4"></ChevronsRight>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
