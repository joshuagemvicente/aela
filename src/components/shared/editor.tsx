"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import EditorJS from "@editorjs/editorjs";

import { Input } from "@/components/ui/input";
import { CheckCircle, Clock, AlertCircle } from "lucide-react";
import { updateNote, type Note } from "@/lib/actions/notes";
import useDebounce from "@/hooks/useDebounce";
import { useNotes } from "@/contexts/notes-context";

type SaveStatus = "saved" | "saving" | "error" | "pending";

interface EditorProps {
  note?: Note;
  onNoteChange?: (note: Note) => void;
  onNewNote?: () => void;
}

export default function Editor({ note, onNoteChange, onNewNote }: EditorProps) {
  const editorRef = useRef<EditorJS | null>(null);
  const [title, setTitle] = useState(note?.title || "Untitled");
  const [isSaving, setIsSaving] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("saved");
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const { updateNote: updateNoteInContext } = useNotes();

  // Auto-save function
  const autoSave = useCallback(
    async (content: any, noteTitle: string) => {
      if (!note || isSaving) return;

      setSaveStatus("saving");
      try {
        const formData = new FormData();
        formData.append("id", note.id);
        formData.append("title", noteTitle);
        formData.append("content", JSON.stringify(content));

        const updatedNote = await updateNote(formData);
        onNoteChange?.(updatedNote);
        updateNoteInContext(updatedNote); // Update sidebar in real-time
        setSaveStatus("saved");
        setHasUnsavedChanges(false);
      } catch (error) {
        setSaveStatus("error");
        if (process.env.NODE_ENV !== "production") {
          console.error("Auto-save failed:", error);
        }
      }
    },
    [note, onNoteChange, isSaving],
  );

  // Debounced auto-save - 1 seconds after user stops typing
  const debouncedAutoSave = useDebounce(autoSave, 1000);

  // Handle content changes in the editor
  const handleContentChange = useCallback(async () => {
    if (!editorRef.current || !note) return;

    setHasUnsavedChanges(true);
    setSaveStatus("pending");

    try {
      const content = await editorRef.current.save();
      debouncedAutoSave(content, title);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error("Failed to get editor content:", error);
      }
    }
  }, [debouncedAutoSave, title, note]);

  // Handle title changes with auto-save
  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasUnsavedChanges(true);
    setSaveStatus("pending");

    // Auto-save title changes immediately if we have content
    if (editorRef.current && note) {
      editorRef.current
        .save()
        .then((content) => {
          debouncedAutoSave(content, newTitle);
        })
        .catch((error) => {
          if (process.env.NODE_ENV !== "production") {
            console.error("Failed to save title change:", error);
          }
        });
    }
  };

  // Periodic save every 30 seconds if there are unsaved changes
  useEffect(() => {
    const interval = setInterval(() => {
      if (hasUnsavedChanges && editorRef.current && note && !isSaving) {
        editorRef.current
          .save()
          .then((content) => {
            autoSave(content, title);
          })
          .catch((error) => {
            if (process.env.NODE_ENV !== "production") {
              console.error("Periodic save failed:", error);
            }
          });
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [hasUnsavedChanges, autoSave, title, note, isSaving]);

  // Save on page unload
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = ""; // Chrome requires returnValue to be set
        return "You have unsaved changes. Are you sure you want to leave?";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    let isMounted = true;

    const initializeEditor = async () => {
      // Clean up existing editor first
      if (editorRef.current) {
        try {
          await editorRef.current.destroy();
        } catch (error) {
          console.error("Error destroying editor:", error);
        }
        editorRef.current = null;
      }

      // Check if component is still mounted
      if (!isMounted) return;

      const [
        { default: Header },
        { default: List },
        { default: Quote },
        { default: Code },
        { default: Delimiter },
        { default: Table },
        { default: Warning },
      ] = await Promise.all([
        import("@editorjs/header"),
        import("@editorjs/list"),
        import("@editorjs/quote"),
        import("@editorjs/code"),
        import("@editorjs/delimiter"),
        import("@editorjs/table"),
        import("@editorjs/warning"),
      ]);

      // Double check if component is still mounted after async operations
      if (!isMounted) return;

      editorRef.current = new EditorJS({
        holder: "editorjs",
        placeholder: "Start writing your note...",
        autofocus: true,
        tools: {
          header: Header,
          list: List,
          quote: Quote,
          code: Code,
          delimiter: Delimiter,
          table: Table,
          warning: Warning,
        },
        data: note?.content || {
          blocks: [
            {
              type: "header",
              data: {
                text: "Welcome to your new note!",
                level: 1,
              },
            },
            {
              type: "paragraph",
              data: {
                text: "Start writing your thoughts here. Use the toolbar above to format your text, add headers, lists, quotes, and more.",
              },
            },
          ],
        },
        onChange: handleContentChange,
      });
    };

    initializeEditor();

    return () => {
      isMounted = false;
      if (editorRef.current) {
        try {
          editorRef.current.destroy();
        } catch (error) {
          if (process.env.NODE_ENV !== "production") {
            console.error("Error destroying editor:", error);
          }
          if (process.env.NODE_ENV !== "production") {
            console.error("Error destroying editor:", error);
          }
        }
        editorRef.current = null;
      }
    };
  }, [note?.id]); // Removed handleContentChange from dependencies

  // const handleSave = async () => {
  //   if (!editorRef.current || !note) return

  //   setIsSaving(true)
  //   try {
  //     const outputData = await editorRef.current.save()

  //     const formData = new FormData()
  //     formData.append("id", note.id)
  //     formData.append("title", title)
  //     formData.append("content", JSON.stringify(outputData))

  //     const updatedNote = await updateNote(formData)
  //     onNoteChange?.(updatedNote)
  //     updateNoteInContext(updatedNote) // Update sidebar in real-time
  //     setSaveStatus('saved')
  //     setHasUnsavedChanges(false)
  //     toast.success("Note saved successfully!")
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : "Failed to save note"
  //     setSaveStatus('error')
  //     toast.error(errorMessage)
  //   } finally {
  //     setIsSaving(false)
  //   }
  // }

  // const handleCreateNew = async () => {
  //   setIsCreating(true)
  //   try {
  //     const newNote = await createBlankNote()
  //     onNewNote?.()
  //     toast.success("New note created!")
  //   } catch (error) {
  //     const errorMessage = error instanceof Error ? error.message : "Failed to create note"
  //     toast.error(errorMessage)
  //   } finally {
  //     setIsCreating(false)
  //   }
  // }

  // Save status indicator component
  const SaveStatusIndicator = () => {
    const getIcon = () => {
      switch (saveStatus) {
        case "saved":
          return <CheckCircle className="w-4 h-4 text-green-500" />;
        case "saving":
          return <Clock className="w-4 h-4 text-blue-500 animate-spin" />;
        case "error":
          return <AlertCircle className="w-4 h-4 text-red-500" />;
        case "pending":
          return <Clock className="w-4 h-4 text-yellow-500" />;
        default:
          return null;
      }
    };

    const getText = () => {
      switch (saveStatus) {
        case "saved":
          return "Saved";
        case "saving":
          return "Saving...";
        case "error":
          return "Save failed";
        case "pending":
          return "Unsaved changes";
        default:
          return "";
      }
    };

    return (
      <div className="flex items-center gap-1 text-sm text-muted-foreground ">
        {getIcon()}
        <span className="text-xs">{getText()}</span>
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-background">
        <div className="flex items-center gap-4 flex-1">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            className="sm:text-2xl font-semibold border-none shadow-none focus-visible:ring-0 p-0 h-auto"
            placeholder="Untitled"
          />
        </div>
        <div className="flex items-center gap-3">
          <SaveStatusIndicator />
          {/* <Button
            size="sm"
            onClick={handleSave}
            disabled={isSaving || !note}
            variant={saveStatus === 'error' ? 'destructive' : 'default'}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save"}
          </Button> */}
        </div>
      </div>

      {/* Editor */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="max-w-4xl mx-auto">
          <div
            key={note?.id || "new-note"}
            id="editorjs"
            className="prose prose-lg max-w-none"
            style={{
              wordBreak: "break-word",
              overflowWrap: "anywhere",
              whiteSpace: "pre-wrap",
            }}
          />
        </div>
      </div>
    </div>
  );
}

