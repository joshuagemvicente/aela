"use client";
import { SidebarNoteItem } from "./sidebar-note-item";
import { useNotes } from "@/contexts/notes-context";

export function SidebarContent() {
  const { notes } = useNotes();

  return (
    <>
      <div className="mb-2 px-2">
        <h2 className="text-xs font-semibold text-muted-foreground/60 uppercase tracking-wider mb-1 px-2">
          Private
        </h2>
      </div>

      {notes.length === 0 ? (
        <div className="px-4 py-2">
          <p className="text-muted-foreground text-xs">
            No pages yet
          </p>
        </div>
      ) : (
        <div className="space-y-[1px]">
          {notes.map((note) => (
            <SidebarNoteItem key={note.id} note={note} />
          ))}
        </div>
      )}
    </>
  );
}
