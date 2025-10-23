"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { generateSlugWithCuid, generateSlug } from "@/lib/utils/slug";
import { User } from "@prisma/client";

const createNoteSchema = z.object({
  title: z.string().min(1, "Title is required").max(255, "Title is too long"),
  workspaceId: z.string().optional(),
});

const updateNoteSchema = z.object({
  id: z.string().min(1, "Note ID is required"),
  title: z
    .string()
    .min(1, "Title is required")
    .max(255, "Title is too long")
    .optional(),
  content: z.any().optional(),
});

export type Note = {
  id: string;
  title: string;
  slug: string;
  content: any;
  userId: string;
  workspaceId: string | null;
  createdBy: string | null;
  updatedBy: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  notes: string[];
};

/**
 * Get current user session
 */
export async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  return session.user;
}

/**
 * Create a new note
 */
export async function createNote(formData: FormData): Promise<Note> {
  const user = await getCurrentUser();

  const rawData = {
    title: formData.get("title") as string,
    workspaceId: formData.get("workspaceId") as string | undefined,
  };

  const validatedData = createNoteSchema.safeParse(rawData);
  if (!validatedData.success) {
    const firstError = Object.values(
      validatedData.error.flatten().fieldErrors,
    )[0]?.[0];
    throw new Error(firstError || "Invalid input data");
  }

  if (validatedData.data.workspaceId) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: validatedData.data.workspaceId,
        OR: [
          { ownerId: user.id },
          {
            workspaceMembers: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
    });

    if (!workspace) {
      throw new Error("Workspace not found or you don't have access");
    }
  }

  const slug = generateSlugWithCuid(validatedData.data.title);

  const noteData: any = {
    title: validatedData.data.title,
    slug: slug,
    userId: user.id,
    workspaceId: validatedData.data.workspaceId || null,
  };

  if (validatedData.data.workspaceId) {
    noteData.createdBy = user.id;
    noteData.updatedBy = user.id;
  }

  const note = await prisma.note.create({
    data: noteData,
  });

  return note as Note;
}

/**
 * Get all personal notes for the current user (excludes workspace notes)
 */
export async function getUserNotes(): Promise<Note[]> {
  const user = await getCurrentUser();

  const notes = await prisma.note.findMany({
    where: {
      userId: user.id,
      workspaceId: null,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return notes as Note[];
}

/**
 * Get all notes in a workspace with creator/updater information
 */
export async function getWorkspaceNotes(workspaceId: string): Promise<any[]> {
  const user = await getCurrentUser();

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      OR: [
        { ownerId: user.id },
        {
          workspaceMembers: {
            some: {
              userId: user.id,
            },
          },
        },
      ],
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or you don't have access");
  }

  const notes = await prisma.note.findMany({
    where: {
      workspaceId: workspaceId,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      userId: true,
      workspaceId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  const notesWithCreatorInfo = await Promise.all(
    notes.map(async (note) => {
      let creatorInfo = null;
      let updaterInfo = null;

      if (note.createdBy) {
        const creator = await prisma.user.findUnique({
          where: { id: note.createdBy },
          select: { id: true, name: true, email: true },
        });
        creatorInfo = creator;
      }

      if (note.updatedBy) {
        const updater = await prisma.user.findUnique({
          where: { id: note.updatedBy },
          select: { id: true, name: true, email: true },
        });
        updaterInfo = updater;
      }

      return {
        ...note,
        creator: creatorInfo,
        updater: updaterInfo,
      };
    })
  );

  return notesWithCreatorInfo;
}

/**
 * Get a specific note by ID
 */
export async function getNoteById(noteId: string): Promise<Note> {
  const user = await getCurrentUser();

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      userId: true,
      workspaceId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return note as Note;
}

/**
 * Get a specific note by slug
 */
export async function getNoteBySlug(slug: string): Promise<Note> {
  const user = await getCurrentUser();

  const note = await prisma.note.findFirst({
    where: {
      slug: slug,
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      userId: true,
      workspaceId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!note) {
    throw new Error("Note not found");
  }

  return note as Note;
}

/**
 * Update a note
 */
export async function updateNote(formData: FormData): Promise<Note> {
  const user = await getCurrentUser();

  const rawData = {
    id: formData.get("id") as string,
    title: formData.get("title") as string,
    content: formData.get("content")
      ? JSON.parse(formData.get("content") as string)
      : undefined,
  };

  const validatedData = updateNoteSchema.safeParse(rawData);
  if (!validatedData.success) {
    const firstError = Object.values(
      validatedData.error.flatten().fieldErrors,
    )[0]?.[0];
    throw new Error(firstError || "Invalid input data");
  }

  // Check if note exists and belongs to user
  const existingNote = await prisma.note.findFirst({
    where: {
      id: validatedData.data.id,
      userId: user.id,
    },
  });

  if (!existingNote) {
    throw new Error("Note not found");
  }

  const updateData: any = {};
  if (validatedData.data.title !== undefined) {
    updateData.title = validatedData.data.title;
    updateData.slug = generateSlugWithCuid(validatedData.data.title);
  }
  if (validatedData.data.content !== undefined) {
    updateData.content = validatedData.data.content;
  }

  if (existingNote.workspaceId) {
    updateData.updatedBy = user.id;
  }

  const note = await prisma.note.update({
    where: {
      id: validatedData.data.id,
    },
    data: updateData,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      userId: true,
      workspaceId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
      user: {
        select: {
          name: true
        }
      }
    },
  });

  return note as Note;
}

/**
 * Delete a note
 */
export async function deleteNote(noteId: string): Promise<void> {
  const user = await getCurrentUser();

  // Check if note exists and belongs to user
  const existingNote = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId: user.id,
    },
  });

  if (!existingNote) {
    throw new Error("Note not found");
  }

  await prisma.note.delete({
    where: {
      id: noteId,
    },
  });
}

/**
 * Create a blank note (for quick creation)
 */
export async function createBlankNote(): Promise<Note> {
  const user = await getCurrentUser();

  const slug = generateSlugWithCuid("Untitled");

  const note = await prisma.note.create({
    data: {
      title: "Untitled",
      slug: slug,
      userId: user.id,
      workspaceId: null,
      createdBy: null,
      updatedBy: null,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      userId: true,
      workspaceId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return note as Note;
}

export async function duplicateNote(noteId: string): Promise<Note> {
  const user = await getCurrentUser();

  const note = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      userId: true,
      workspaceId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (note) {
    const duplicateNoteData: any = {
      title: note.title,
      slug: generateSlugWithCuid(note.title),
      userId: user.id,
      content: note.content ?? undefined,
      workspaceId: note.workspaceId,
    };

    if (note.workspaceId) {
      duplicateNoteData.createdBy = user.id;
      duplicateNoteData.updatedBy = user.id;
    }

    const duplicateNote = await prisma.note.create({
      data: duplicateNoteData,
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        userId: true,
        workspaceId: true,
        createdBy: true,
        updatedBy: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return duplicateNote as Note;
  } else {
    throw new Error("Note not found");
  }
}

export async function moveNoteToWorkspace(
  noteId: string,
  workspaceId: string | null,
): Promise<Note> {
  const user = await getCurrentUser();

  const existingNote = await prisma.note.findFirst({
    where: {
      id: noteId,
      userId: user.id,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      userId: true,
      workspaceId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!existingNote) {
    throw new Error("Note not found");
  }

  if (workspaceId) {
    const workspace = await prisma.workspace.findFirst({
      where: {
        id: workspaceId,
        OR: [
          { ownerId: user.id },
          {
            workspaceMembers: {
              some: {
                userId: user.id,
              },
            },
          },
        ],
      },
    });

    if (!workspace) {
      throw new Error("Workspace not found or you don't have access");
    }
  }

  const updateData: any = {
    workspaceId: workspaceId,
  };

  if (workspaceId) {
    if (!existingNote.createdBy) {
      updateData.createdBy = user.id;
    }
    updateData.updatedBy = user.id;
  } else {
    updateData.createdBy = null;
    updateData.updatedBy = null;
  }

  const note = await prisma.note.update({
    where: {
      id: noteId,
    },
    data: updateData,
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      userId: true,
      workspaceId: true,
      createdBy: true,
      updatedBy: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return note as Note;
}
