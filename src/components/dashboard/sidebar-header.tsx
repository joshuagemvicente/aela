"use client"

import { Button } from "@/components/ui/button"
import { Plus, Search, Settings } from "lucide-react"
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

  // Load user data on component mount
  useEffect(() => {
    getCurrentUserProfile()
      .then((result) => setUser(result.user))
      .catch(() => {
        // Handle error silently
      })
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
    <div className="px-3 py-2">
      <div className="flex items-center justify-between">
        <h1 className="text-base font-semibold">Aela</h1>
        
        {/* Profile Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.image} alt={user?.name || "User"} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user?.name?.charAt(0).toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" forceMount>
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                {user?.name && (
                  <p className="font-medium">{user.name}</p>
                )}
                {user?.email && (
                  <p className="w-[200px] truncate text-sm text-muted-foreground">
                    {user.email}
                  </p>
                )}
              </div>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsSettingsOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <span>Sign out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <div className="space-y-2 mt-2">
        <Button 
          onClick={handleCreateNote}
          className="w-full justify-start h-8 text-sm"
          size="sm"
        >
          <Plus className="w-4 h-4 mr-2"></Plus>
          New Note
        </Button>
        
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4"></Search>
          <Input
            placeholder="Search notes..."
            className="pl-8 h-8 text-sm"
          />
        </div>
      </div>

      {/* Settings Modal */}
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
