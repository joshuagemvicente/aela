"use client"

import { Button } from "@/components/ui/button"
import { ChevronsUpDown, Plus, Settings } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { createBlankNote } from "@/lib/actions/notes"
import { signOut } from "@/lib/actions/auth"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { useState, useEffect } from "react"
import { SettingsModal } from "./settings-modal"
import { getCurrentUserProfile, type AuthResult } from "@/lib/actions/auth"
import { useNotes } from "@/contexts/notes-context"

export function SidebarHeader({ onCollapse }: { onCollapse?: () => void }) {
  const router = useRouter()
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [user, setUser] = useState<AuthResult["user"] | null>(null)
  const { addNote } = useNotes()

  useEffect(() => {
    getCurrentUserProfile()
      .then((result) => setUser(result.user))
      .catch(() => {})
  }, [])

  const handleCreateNote = async () => {
    try {
      const newNote = await createBlankNote()
      addNote(newNote)
      toast.success("New note created!")
      router.push(`/dashboard/${newNote.slug}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to create note"
      toast.error(errorMessage)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
      toast.success("Signed out successfully!")
      router.push("/login")
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to sign out"
      toast.error(errorMessage)
    }
  }

  return (
    <div className="px-2 py-2 mb-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="flex items-center gap-2 p-1.5 rounded-sm hover:bg-sidebar-accent cursor-pointer transition-colors mb-2 group">
             <Avatar className="h-5 w-5 rounded-sm">
                <AvatarImage src={user?.image} alt={user?.name || "User"} />
                <AvatarFallback className="rounded-sm text-[10px]">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
             </Avatar>
             <span className="text-sm font-medium truncate flex-1">{user?.name || "Aela Workspace"}</span>
             <ChevronsUpDown className="h-3 w-3 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" /> 
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-64" align="start" forceMount>
            <div className="px-2 py-1.5">
               <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <span>Log out</span>
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <div className="space-y-[1px]">
        <button
          onClick={handleCreateNote}
          className="flex items-center w-full gap-2 px-2 py-1 h-8 text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground rounded-sm transition-colors text-left"
        >
          <Plus className="w-4 h-4" />
          <span>New page</span>
        </button>
      </div>

      {user && (
        <SettingsModal
          isOpen={isSettingsOpen}
          onOpenChange={setIsSettingsOpen}
          user={user}
        />
      )}
    </div>
  )
}
