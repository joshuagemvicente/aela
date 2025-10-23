import type { Metadata } from "next";
import { requireAuth } from "@/lib/actions/auth";
import { getUserNotes } from "@/lib/actions/notes";
import { getUserWorkspaces } from "@/lib/actions/workspaces";
import { NotesProvider } from "@/contexts/notes-context";
import { WorkspacesProvider } from "@/contexts/workspaces-context";
import Sidebar from "@/components/dashboard/sidebar";

export const metadata: Metadata = {
  title: "Dashboard | Aela",
  description: "Aela is just an another note taking app but even better.",
};

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  await requireAuth();
  
  const notes = await getUserNotes();
  const workspaces = await getUserWorkspaces();

  return (
    <NotesProvider initialNotes={notes}>
      <WorkspacesProvider initialWorkspaces={workspaces}>
        <div className="flex h-screen bg-background">
          <Sidebar />
          <main className="flex-1 overflow-hidden">
            {children}
          </main>
        </div>
      </WorkspacesProvider>
    </NotesProvider>
  );
}
  