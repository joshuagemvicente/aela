"use client"

import { SidebarNoteItem } from "./sidebar-note-item"
import { useNotes } from "@/contexts/notes-context"

export function SidebarContent() {
  const { notes } = useNotes()

  return (
    <>
      <h2 className="text-sm font-medium text-muted-foreground mb-3">
        All Notes ({notes.length})
      </h2>
      
      {notes.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground text-sm">
            No notes yet. Create your first note to get started!
          </p>
        </div>
      ) : (
        <div className="space-y-1">
          {notes.map((note) => (
            <SidebarNoteItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </>
  )
}
