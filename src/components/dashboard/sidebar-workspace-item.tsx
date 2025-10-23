"use client"

import { Workspace } from "@/lib/actions/workspaces"
import { Button } from "@/components/ui/button"
import { MoreHorizontal, Trash2, Edit, Users } from "lucide-react"
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
import { deleteWorkspace } from "@/lib/actions/workspaces"
import { useWorkspaces } from "@/contexts/workspaces-context"
import { toast } from "sonner"

interface SidebarWorkspaceItemProps {
  workspace: Workspace
}

export function SidebarWorkspaceItem({ workspace }: SidebarWorkspaceItemProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isActive = pathname === `/workspace/${workspace.id}`
  const { removeWorkspace } = useWorkspaces()

  const handleDeleteWorkspace = async (e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await deleteWorkspace(workspace.id)
      removeWorkspace(workspace.id)
      toast.success("Workspace deleted successfully!")
      if (isActive) {
        router.push("/dashboard")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Failed to delete workspace"
      toast.error(errorMessage)
    }
  }

  const handleClickWorkspace = () => {
    router.push(`/workspace/${workspace.slug}`)
  }

  const getMemberCount = () => {
    return workspace.workspaceMembers?.length || 0
  }

  return (
    <div
      onClick={handleClickWorkspace}
      className={cn(
        "group relative p-3 rounded-lg cursor-pointer transition-colors hover:bg-accent",
        isActive && "bg-accent"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-sm truncate">
            {workspace.name}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3"></Users>
              <span>{getMemberCount()} members</span>
            </div>
            <span>•</span>
            <span>{formatDistanceToNow(new Date(workspace.updatedAt), { addSuffix: true })}</span>
          </div>
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
            <DropdownMenuItem onClick={(e) => e.stopPropagation()} className="cursor-pointer">
              <Edit className="w-4 h-4 mr-2" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={handleDeleteWorkspace}
              className="text-destructive focus:text-destructive cursor-pointer"
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

