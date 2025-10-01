import { Button } from "@/components/ui/button"
import { Plus, FileText, Sparkles } from "lucide-react"
import { createBlankNote } from "@/lib/actions/notes"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const handleCreateNote = async () => {
    "use server"
    const newNote = await createBlankNote()
    redirect(`/dashboard/${newNote.slug}`)
  }

  return (
    <div className="flex items-center justify-center h-full bg-background">
      <div className="text-center max-w-md mx-auto p-8">
        <div className="mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Welcome to Aela</h1>
          <p className="text-muted-foreground">
            Your personal note-taking companion. Start writing your thoughts, ideas, and memories.
          </p>
        </div>

        <div className="space-y-4">
          <form action={handleCreateNote}>
            <Button type="submit" size="lg" className="w-full">
              <Plus className="w-5 h-5 mr-2" />
              Create Your First Note
            </Button>
          </form>
          
          <div className="text-sm text-muted-foreground">
            Or select an existing note from the sidebar
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-4 text-left">
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <FileText className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Rich Text Editor</h3>
              <p className="text-sm text-muted-foreground">
                Write with headers, lists, quotes, code blocks, and more using EditorJS.
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
            <Sparkles className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium mb-1">Organized & Searchable</h3>
              <p className="text-sm text-muted-foreground">
                Keep all your notes organized in one place with easy search and navigation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}