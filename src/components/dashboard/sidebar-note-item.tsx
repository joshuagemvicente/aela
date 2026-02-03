"use client"

import { duplicateNote, Note } from "@/lib/actions/notes"
import { FileText, Copy, MoreHorizontal, Trash2 } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { deleteNote } from "@/lib/actions/notes"
import { useNotes } from "@/contexts/notes-context"
import { toast } from "sonner"

interface SidebarNoteItemProps {
  note: Note
}

export function SidebarNoteItem({ note }: SidebarNoteItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = pathname === `/dashboard/${note.id}`
  const { removeNote, addNote } = useNotes()

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteNote(note.id)
      removeNote(note.id)
      toast.success("Note deleted successfully!")
      if (isActive) {
        router.push("/dashboard")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete note"
      toast.error(errorMessage)
    }
  }

  const handleDuplicate =  async(e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      const duplicated = await duplicateNote(note.id)
      addNote(duplicated)
      toast.success("Note duplicated successfully!")
      router.push(`/dashboard/${duplicated.slug}`)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to duplicate note."
      toast.error(errorMessage)
    }
  }

  const handleClick = () => {
    router.push(`/dashboard/${note.slug}`)
  }

  // Sidebar shows only titles; content preview intentionally hidden

  return (
    <div
      onClick={handleClick}
      className={cn(
        "group relative px-2 py-1 rounded-sm cursor-pointer transition-colors hover:bg-sidebar-accent text-sidebar-foreground",
        isActive && "bg-sidebar-accent font-medium"
      )}
    >
      <div className="flex items-center justify-between h-7">
        <div className="flex-1 min-w-0 flex items-center gap-2">
           <span className="text-muted-foreground opacity-70 group-hover:opacity-100 transition-opacity">
             <FileText className="w-4 h-4" />
           </span>
          <span className="text-sm truncate leading-none pt-0.5">
            {note.title || "Untitled"}
          </span>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div
              className="opacity-0 group-hover:opacity-100 transition-opacity p-0.5 rounded-sm hover:bg-sidebar-accent/50 text-muted-foreground"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDelete}
              className="text-destructive focus:text-destructive"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}
