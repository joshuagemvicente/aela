"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";
import { generateSlugWithCuid, generateSlug } from "@/lib/utils/slug";
import { getCurrentUser } from "./notes";

const createWorkspaceSchema = z.object({
  name: z
    .string({ message: "Workspace Name is required." })
    .trim()
    .min(1)
    .max(255),
});

const updateWorkspaceSchema = z.object({
  id: z.string().min(1, "Workspace ID is required"),
  name: z
    .string({ message: "Workspace Name is required." })
    .trim()
    .min(1)
    .max(255),
});

const addMemberSchema = z.object({
  workspaceId: z.string().min(1, "Workspace ID is required"),
  userId: z.string().min(1, "User ID is required"),
  role: z.enum(["admin", "member"]).default("member"),
});

export type Workspace = {
  id: string;
  name: string;
  slug: string;
  ownerId: string;
  createdAt: Date;
  updatedAt: Date;
  workspaceMembers?: WorkspaceMember[];
};

export type WorkspaceMember = {
  id: string;
  workspaceMemberName?: string;
  workspaceId: string;
  userId: string;
  role: string;
  joinedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
    image: string | null;
  };
};

export async function createWorkspace(formData: FormData): Promise<Workspace> {
  const user = await getCurrentUser();

  const rawData = {
    name: formData.get("name") as string,
  };

  const validatedData = createWorkspaceSchema.safeParse(rawData);

  if (!validatedData.success) {
    const firstError = Object.values(
      validatedData.error.flatten().fieldErrors,
    )[0]?.[0];
    throw new Error(firstError || "Invalid input data");
  }

  const slug = generateSlugWithCuid(validatedData.data.name);

  const workspace = await prisma.workspace.create({
    data: {
      name: validatedData.data.name,
      slug: slug,
      ownerId: user.id,
      workspaceMembers: {
        create: {
          userId: user.id,
          role: "admin",
        },
      },
    },
    include: {
      workspaceMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return workspace;
}

export async function getUserWorkspaces(): Promise<Workspace[]> {
  const user = await getCurrentUser();

  const workspaces = await prisma.workspace.findMany({
    where: {
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
    include: {
      workspaceMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  return workspaces;
}

export async function getWorkspaceById(
  workspaceId: string,
): Promise<Workspace> {
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
    include: {
      workspaceMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or access denied");
  }

  return workspace;
}

export async function getWorkspaceBySlug(slug: string): Promise<Workspace> {
  const user = await getCurrentUser();

  const workspace = await prisma.workspace.findFirst({
    where: {
      slug: slug,
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
    include: {
      workspaceMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    throw new Error("Workspace not found or access denied");
  }

  return workspace;
}

export async function updateWorkspace(formData: FormData): Promise<Workspace> {
  const user = await getCurrentUser();

  const rawData = {
    id: formData.get("id") as string,
    name: formData.get("name") as string,
  };

  const validatedData = updateWorkspaceSchema.safeParse(rawData);

  if (!validatedData.success) {
    const firstError = Object.values(
      validatedData.error.flatten().fieldErrors,
    )[0]?.[0];
    throw new Error(firstError || "Invalid input data");
  }

  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      id: validatedData.data.id,
      ownerId: user.id,
    },
  });

  if (!existingWorkspace) {
    throw new Error(
      "Workspace not found or you do not have permission to update it",
    );
  }

  const updateData: any = {
    name: validatedData.data.name,
    slug: generateSlugWithCuid(validatedData.data.name),
  };

  const workspace = await prisma.workspace.update({
    where: {
      id: validatedData.data.id,
    },
    data: updateData,
    include: {
      workspaceMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  return workspace;
}

export async function deleteWorkspace(workspaceId: string): Promise<void> {
  const user = await getCurrentUser();

  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      ownerId: user.id,
    },
  });

  if (!existingWorkspace) {
    throw new Error(
      "Workspace not found or you do not have permission to delete it",
    );
  }

  await prisma.workspace.delete({
    where: {
      id: workspaceId,
    },
  });
}

export async function addWorkspaceMember(
  formData: FormData,
): Promise<WorkspaceMember> {
  const user = await getCurrentUser();

  const rawData = {
    workspaceId: formData.get("workspaceId") as string,
    userId: formData.get("userId") as string,
    role: (formData.get("role") as string) || "member",
  };

  const validatedData = addMemberSchema.safeParse(rawData);

  if (!validatedData.success) {
    const firstError = Object.values(
      validatedData.error.flatten().fieldErrors,
    )[0]?.[0];
    throw new Error(firstError || "Invalid input data");
  }

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: validatedData.data.workspaceId,
      ownerId: user.id,
    },
    include: {
      workspaceMembers: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      },
    },
  });

  if (!workspace) {
    throw new Error(
      "Workspace not found or you do not have permission to add members",
    );
  }

  const existingMember = await prisma.workspaceMember.findFirst({
    where: {
      workspaceId: validatedData.data.workspaceId,
      userId: validatedData.data.userId,
    },
  });

  if (existingMember) {
    throw new Error("User is already a member of this workspace");
  }

  const member = await prisma.workspaceMember.create({
    data: {
      workspaceId: validatedData.data.workspaceId,
      userId: validatedData.data.userId,
      role: validatedData.data.role,
    },
  });

  return member;
}

export async function removeWorkspaceMember(
  workspaceId: string,
  memberId: string,
): Promise<void> {
  const user = await getCurrentUser();

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      ownerId: user.id,
    },
  });

  if (!workspace) {
    throw new Error(
      "Workspace not found or you do not have permission to remove members",
    );
  }

  await prisma.workspaceMember.delete({
    where: {
      id: memberId,
    },
  });
}

export async function updateWorkspaceMemberRole(
  workspaceId: string,
  memberId: string,
  role: "admin" | "member",
): Promise<WorkspaceMember> {
  const user = await getCurrentUser();

  const workspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      ownerId: user.id,
    },
  });

  if (!workspace) {
    throw new Error(
      "Workspace not found or you do not have permission to update member roles",
    );
  }

  const member = await prisma.workspaceMember.update({
    where: {
      id: memberId,
    },
    data: {
      role: role,
    },
  });

  return member;
}
