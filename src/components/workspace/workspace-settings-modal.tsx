"use client";

import { Workspace, WorkspaceMember } from "@/lib/actions/workspaces";
import {
  updateWorkspace,
  deleteWorkspace,
  removeWorkspaceMember,
  addWorkspaceMember,
} from "@/lib/actions/workspaces";
import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, UserPlus, UserMinus } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useWorkspaces } from "@/contexts/workspaces-context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
interface WorkspaceSettingsModalProps {
  workspace: Workspace;
  isOpen: boolean;
  onClose: () => void;
}

export function WorkspaceSettingsModal({
  workspace,
  isOpen,
  onClose,
}: WorkspaceSettingsModalProps) {
  const [workspaceName, setWorkspaceName] = useState(workspace.name);
  const [memberEmail, setMemberEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { updateWorkspace: updateWorkspaceInContext, removeWorkspace } = useWorkspaces();

  const handleUpdateWorkspaceName = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("id", workspace.id);
        formData.append("name", workspaceName);

        const updatedWorkspace = await updateWorkspace(formData);
        updateWorkspaceInContext(updatedWorkspace);
        toast.success("Workspace updated successfully!");
        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to update workspace";
        toast.error(errorMessage);
      }
    });
  };

  const handleDeleteWorkspace = () => {
    if (!confirm("Are you sure you want to delete this workspace? This action cannot be undone.")) {
      return;
    }

    startTransition(async () => {
      try {
        await deleteWorkspace(workspace.id);
        removeWorkspace(workspace.id);
        toast.success("Workspace deleted successfully!");
        router.push("/dashboard");
        onClose();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to delete workspace";
        toast.error(errorMessage);
      }
    });
  };

  const handleRemoveMember = (memberId: string) => {
    startTransition(async () => {
      try {
        await removeWorkspaceMember(workspace.id, memberId);
        toast.success("Member removed successfully!");
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to remove member";
        toast.error(errorMessage);
      }
    });
  };

  const handleAddMember = () => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("workspaceId", workspace.id);
        formData.append("userId", memberEmail);
        formData.append("role", "member");

        await addWorkspaceMember(formData);
        toast.success("Member added successfully!");
        setMemberEmail("");
        router.refresh();
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to add member";
        toast.error(errorMessage);
      }
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Workspace Settings</DialogTitle>
          <DialogDescription>
            Manage your workspace settings and members
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="workspace-name">Workspace Name</Label>
              <Input
                id="workspace-name"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                placeholder="Enter workspace name"
              />
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleUpdateWorkspaceName}
                disabled={isPending || workspaceName === workspace.name}
              >
                Save Changes
              </Button>
            </div>

            <div className="pt-6 border-t">
              <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Once you delete a workspace, there is no going back. Please be certain.
              </p>
              <Button
                variant="destructive"
                onClick={handleDeleteWorkspace}
                disabled={isPending}
              >
                <Trash2 className="w-4 h-4 mr-2"></Trash2>
                Delete Workspace
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="members" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label htmlFor="member-email">Add Member by User ID</Label>
              <div className="flex gap-2">
                <Input
                  id="member-email"
                  value={memberEmail}
                  onChange={(e) => setMemberEmail(e.target.value)}
                  placeholder="Enter user ID"
                />
                <Button onClick={handleAddMember} disabled={isPending || !memberEmail}>
                  <UserPlus className="w-4 h-4 mr-2"></UserPlus>
                  Add
                </Button>
              </div>
              <p className="text-xs text-muted-foreground">
                Note: Currently requires exact user ID. Email invites coming soon.
              </p>
            </div>

            <div className="space-y-2">
              <Label>Current Members ({workspace.workspaceMembers?.length || 0})</Label>
              <div className="border rounded-lg divide-y max-h-64 overflow-y-auto">
                {workspace.workspaceMembers && workspace.workspaceMembers.length > 0 ? (
                  workspace.workspaceMembers.map((member) => (
                    <div
                      key={member.id}
                      className="flex items-center justify-between p-3"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <Avatar>
                            <AvatarImage src={member.user?.image || ""} alt={member.user?.name || ""} />
                            <AvatarFallback>{member.user?.name?.charAt(0)}</AvatarFallback>
                          </Avatar>
                        <p className="text-sm font-medium">{member.user?.name}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">Email: {member.user?.email}</p>
                        <p className="text-xs text-muted-foreground capitalize">Role: {member.role}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveMember(member.id)}
                        disabled={isPending || member.role === "admin"}
                      >
                        <UserMinus className="w-4 h-4"></UserMinus>
                      </Button>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-muted-foreground">
                    No members yet
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

