"use client"

import { useEffect, useState, useCallback } from "react"
import { SidebarHeader } from "./sidebar-header"
import { SidebarContent } from "./sidebar-content"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileText } from "lucide-react"

const SIDEBAR_STORAGE_KEY = "aela_sidebar_open"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)

  useEffect(() => {
    const storedSidebarState = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (storedSidebarState !== null) {
      setIsOpen(storedSidebarState === "true")
    }
  }, [])

  const toggleSidebar = useCallback(() => {
    setIsOpen((previousState) => {
      const nextState = !previousState
      try {
        localStorage.setItem(SIDEBAR_STORAGE_KEY, String(nextState))
      } catch {}
      return nextState
    })
  }, [])

  return (
    <div className="h-full">
      <div
        className={
          `bg-sidebar border-r border-sidebar-border flex h-full transition-all duration-300 ease-in-out overflow-hidden ` +
          (isOpen ? "w-64" : "w-0 opacity-0") 
        }
      >
        {isOpen ? (
          <div className="flex flex-col h-full w-full">
            <div className="py-3 px-4 flex flex-col group">
              
              <Button 
                aria-label="Collapse sidebar" 
                variant="ghost" 
                size="icon" 
                onClick={toggleSidebar}
                className="h-6 w-6 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:bg-sidebar-accent hover:text-sidebar-foreground self-end"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <SidebarHeader />
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="px-2 py-2">
                <SidebarContent />
              </div>
            </div>
          </div>
        ) : null}
      </div>
      
      {!isOpen && (
        <div className="absolute top-3 left-3 z-50">
           <Button 
             aria-label="Expand sidebar" 
             variant="ghost" 
             size="icon" 
             onClick={toggleSidebar}
             className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-foreground"
           >
             <ChevronRight className="h-4 w-4" />
           </Button>
        </div>
      )}
    </div>
  )
}
