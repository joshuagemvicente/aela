import { getNoteBySlug, getUserNotes } from "@/lib/actions/notes"
import { redirect } from "next/navigation"
import Editor from "@/components/shared/editor"

interface NotePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NotePage({ params }: NotePageProps) {
  let note
  
  try {
    const { id } = await params;
    note = await getNoteBySlug(id)
  } catch (error) {
    const notes = await getUserNotes()
    if (notes.length > 0) {
      redirect(`/dashboard/${notes[0].slug}`)
    }
    redirect(`/dashboard`)
  }

  return (
    <div className="h-full">
      <Editor note={note} />
    </div>
  )
}
