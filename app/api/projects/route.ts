import { NextResponse } from "next/server";

import { createProject, listProjects } from "@/lib/project-storage";

export async function GET() {
  try {
    const projects = await listProjects();
    return NextResponse.json(projects);
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not load projects.",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as unknown;

    if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
      throw new Error("Request body must be an object.");
    }

    const { name } = payload as Record<string, unknown>;

    if (typeof name !== "string") {
      throw new Error("Project name must be a string.");
    }

    const project = await createProject(name);
    return NextResponse.json(project, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not create project.",
      },
      { status: 400 },
    );
  }
}
