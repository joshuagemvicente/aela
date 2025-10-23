import { getWorkspaceBySlug } from "@/lib/actions/workspaces";
import { getWorkspaceNotes } from "@/lib/actions/notes";
import { WorkspaceNotesView } from "@/components/workspace/workspace-notes-view";
import { notFound } from "next/navigation";

interface WorkspacePageProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function WorkspacePage({ params }: WorkspacePageProps) {
  try {
    const { slug } = await params;
    const workspace = await getWorkspaceBySlug(slug);
    const notes = await getWorkspaceNotes(workspace.id);

    return (
      <div className="h-full flex flex-col">
        <WorkspaceNotesView workspace={workspace} initialNotes={notes} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}

