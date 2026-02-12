import { redirect } from "next/navigation";
import Editor from "@/components/shared/editor";
import { getNoteBySlug, getUserNotes } from "@/lib/actions/notes";

interface NotePageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function NotePage({ params }: NotePageProps) {
  let note: Awaited<ReturnType<typeof getNoteBySlug>> | null = null;

  try {
    const { id } = await params;
    note = await getNoteBySlug(id);
  } catch (error) {
    if (process.env.APP_ENV || process.env.NODE_ENV !== "production") {
      console.error("Error loading note:", error);
    }
    const notes = await getUserNotes();
    if (notes.length > 0) {
      redirect(`/dashboard/${notes[0].slug}`);
    }
    redirect(`/dashboard`);
  }

  return (
    <div className="h-full">
      <Editor key={note?.id} note={note} />
    </div>
  );
}
