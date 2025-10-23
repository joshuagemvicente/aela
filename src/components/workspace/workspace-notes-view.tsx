"use client";

import { Workspace } from "@/lib/actions/workspaces";
import { Note, createNote } from "@/lib/actions/notes";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Plus, Settings, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";
import { WorkspaceSettingsModal } from "@/components/workspace/workspace-settings-modal";

interface WorkspaceNotesViewProps {
  workspace: Workspace;
  initialNotes: Note[];
}

export function WorkspaceNotesView({ workspace, initialNotes }: WorkspaceNotesViewProps) {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleCreateNote = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("title", "Untitled");
        formData.append("workspaceId", workspace.id);

        const newNote = await createNote(formData);
        setNotes([newNote, ...notes]);
        toast.success("Note created successfully!");
        router.push(`/dashboard/${newNote.slug}`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create note";
        toast.error(errorMessage);
      }
    });
  };

  const getMemberCount = () => {
    return workspace.workspaceMembers?.length || 0;
  };

  return (
    <div className="h-full flex flex-col">
      <div className="border-b px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{workspace.name}</h1>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
              <div className="flex items-center gap-1">
                <Users className="w-4 h-4"></Users>
                <span>{getMemberCount()} members</span>
              </div>
              <span>•</span>
              <span>{notes.length} notes</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button onClick={() => setIsSettingsOpen(true)} variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2"></Settings>
              Settings
            </Button>
            <Button onClick={handleCreateNote} disabled={isPending}>
              <Plus className="w-4 h-4 mr-2"></Plus>
              New Note
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-6">
        {notes.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="max-w-md">
              <h2 className="text-lg font-semibold mb-2">No notes yet</h2>
              <p className="text-muted-foreground mb-4">
                Create your first note in this workspace to get started. All workspace members will be able to access it.
              </p>
              <Button onClick={handleCreateNote} disabled={isPending}>
                <Plus className="w-4 h-4 mr-2"></Plus>
                Create First Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} />
            ))}
          </div>
        )}
      </div>

      <WorkspaceSettingsModal
        workspace={workspace}
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

function NoteCard({ note }: { note: any }) {
  const router = useRouter();

  const handleClickNote = () => {
    router.push(`/dashboard/${note.slug}`);
  };

  const getCreatorName = () => {
    if (note.creator) {
      return note.creator.name || note.creator.email;
    }
    return "Unknown";
  };

  const getUpdaterName = () => {
    if (note.updater) {
      return note.updater.name || note.updater.email;
    }
    return "Unknown";
  };

  return (
    <div
      onClick={handleClickNote}
      className={cn(
        "p-4 border rounded-lg cursor-pointer transition-colors hover:bg-accent",
        "flex flex-col gap-2"
      )}
    >
      <h3 className="font-medium text-base truncate">{note.title}</h3>
      <div className="flex flex-col gap-1">
        <p className="text-xs text-muted-foreground">
          Created by {getCreatorName()}
        </p>
        <p className="text-xs text-muted-foreground">
          Last updated by {getUpdaterName()} • {formatDistanceToNow(new Date(note.updatedAt), { addSuffix: true })}
        </p>
      </div>
    </div>
  );
}

