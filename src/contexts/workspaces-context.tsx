"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { type Workspace } from "@/lib/actions/workspaces";

interface WorkspacesContextType {
  workspaces: Workspace[];
  setWorkspaces: (workspaces: Workspace[]) => void;
  updateWorkspace: (updatedWorkspace: Workspace) => void;
  addWorkspace: (workspace: Workspace) => void;
  removeWorkspace: (workspaceId: string) => void;
}

const WorkspacesContext = createContext<WorkspacesContextType | undefined>(undefined);

export function WorkspacesProvider({
  children,
  initialWorkspaces,
}: {
  children: ReactNode;
  initialWorkspaces: Workspace[];
}) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>(initialWorkspaces);

  const updateWorkspace = useCallback((updatedWorkspace: Workspace) => {
    setWorkspaces((previousWorkspaces) =>
      previousWorkspaces.map((workspace) =>
        workspace.id === updatedWorkspace.id ? updatedWorkspace : workspace,
      ),
    );
  }, []);

  const addWorkspace = useCallback((workspace: Workspace) => {
    setWorkspaces((previousWorkspaces) => [workspace, ...previousWorkspaces]);
  }, []);

  const removeWorkspace = useCallback((workspaceId: string) => {
    setWorkspaces((previousWorkspaces) =>
      previousWorkspaces.filter((workspace) => workspace.id !== workspaceId),
    );
  }, []);

  return (
    <WorkspacesContext.Provider
      value={{
        workspaces,
        setWorkspaces,
        updateWorkspace,
        addWorkspace,
        removeWorkspace,
      }}
    >
      {children}
    </WorkspacesContext.Provider>
  );
}

export function useWorkspaces() {
  const context = useContext(WorkspacesContext);
  if (context === undefined) {
    throw new Error("useWorkspaces must be used within a WorkspacesProvider");
  }
  return context;
}

