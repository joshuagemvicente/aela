"use client";
import { SidebarNoteItem } from "./sidebar-note-item";
import { SidebarWorkspaceItem } from "./sidebar-workspace-item";
import { useNotes } from "@/contexts/notes-context";
import { useWorkspaces } from "@/contexts/workspaces-context";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
} from "../ui/dialog";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { createWorkspace } from "@/lib/actions/workspaces";
import { toast } from "sonner";

interface SidebarContentProps {
  activeTab: string;
}

export function SidebarContent({ activeTab }: SidebarContentProps) {
  const { notes } = useNotes();
  const { workspaces, addWorkspace } = useWorkspaces();
  const [isCreateWorkspaceDialogOpen, setIsCreateWorkspaceDialogOpen] = useState(false);
  const [workspaceName, setWorkspaceName] = useState("");
  const [isPending, startTransition] = useTransition();

  const handleCreateWorkspace = async (e: React.FormEvent) => {
    e.preventDefault();
    
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("name", workspaceName);
        
        const newWorkspace = await createWorkspace(formData);
        addWorkspace(newWorkspace);
        toast.success("Workspace created successfully!");
        setWorkspaceName("");
        setIsCreateWorkspaceDialogOpen(false);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to create workspace";
        toast.error(errorMessage);
      }
    });
  };

  if (activeTab === "notes") {
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
    );
  }

  if (activeTab === "workspaces") {
    return (
      <>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-medium text-muted-foreground">
            Workspaces ({workspaces.length})
          </h2>
          <Dialog open={isCreateWorkspaceDialogOpen} onOpenChange={setIsCreateWorkspaceDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-4 w-4"></Plus>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Workspace</DialogTitle>
                <DialogDescription>
                  Create a workspace to collaborate with others on notes.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateWorkspace}>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="workspace-name">Workspace Name</Label>
                    <Input
                      id="workspace-name"
                      placeholder="Enter workspace name"
                      value={workspaceName}
                      onChange={(e) => setWorkspaceName(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsCreateWorkspaceDialogOpen(false)}
                    disabled={isPending}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isPending}>
                    {isPending ? "Creating..." : "Create Workspace"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {workspaces.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground text-sm">
              No workspaces yet. Create your first workspace to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-1">
            {workspaces.map((workspace) => (
              <SidebarWorkspaceItem key={workspace.id} workspace={workspace} />
            ))}
          </div>
        )}
      </>
    );
  }

  return null;
}
