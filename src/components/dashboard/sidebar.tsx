"use client"

import { useEffect, useState, useCallback } from "react"
import { SidebarHeader } from "./sidebar-header"
import { SidebarContent } from "./sidebar-content"
import { Button } from "@/components/ui/button"
import { ChevronsLeft, ChevronsRight, FileText, Users } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

const SIDEBAR_STORAGE_KEY = "aela_sidebar_open"
const SIDEBAR_TAB_KEY = "aela_sidebar_tab"

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("notes")

  useEffect(() => {
    const storedSidebarState = localStorage.getItem(SIDEBAR_STORAGE_KEY)
    if (storedSidebarState !== null) {
      setIsOpen(storedSidebarState === "true")
    }

    const storedTabState = localStorage.getItem(SIDEBAR_TAB_KEY)
    if (storedTabState !== null) {
      setActiveTab(storedTabState)
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

  const handleTabChange = useCallback((value: string) => {
    setActiveTab(value)
    try {
      localStorage.setItem(SIDEBAR_TAB_KEY, value)
    } catch {}
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
              <Button aria-label="Collapse sidebar" variant="ghost" size="icon" onClick={toggleSidebar}>
                <ChevronsLeft className="h-4 w-4"></ChevronsLeft>
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <div className="px-3 py-3">
                <SidebarContent activeTab={activeTab} />
              </div>
            </div>
            <div className="border-t py-2 px-3">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="w-full grid grid-cols-2">
                  <TabsTrigger value="notes" className="flex items-center gap-2">
                    <FileText className="h-4 w-4"></FileText>
                    <span>Notes</span>
                  </TabsTrigger>
                  <TabsTrigger value="workspaces" className="flex items-center gap-2">
                    <Users className="h-4 w-4"></Users>
                    <span>Workspaces</span>
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center h-full w-10 py-2">
            <Button aria-label="Expand sidebar" variant="ghost" size="icon" onClick={toggleSidebar}>
              <ChevronsRight className="h-4 w-4"></ChevronsRight>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
