"use client"

import { duplicateNote, Note } from "@/lib/actions/notes"
import { Button } from "@/components/ui/button"
import { Copy, MoreHorizontal, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { useRouter, usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
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
        "group relative p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
        isActive && "bg-accent"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">
            {note.title}
          </h3>
          <p className="text-xs text-muted-foreground mt-1">
            {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
          </p>
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="opacity-0 group-hover:opacity-100 transition-opacity h-6 w-6 p-0"
              onClick={(e) => e.stopPropagation()}
            >
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={handleDuplicate} className="cursor-pointer">
              <Copy className="w-4 h-4 mr-2" />
              Duplicate
            </DropdownMenuItem>
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
