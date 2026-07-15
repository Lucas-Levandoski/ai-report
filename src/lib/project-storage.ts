import type { Project } from "@/models/report";

import { createServerSupabaseClient } from "./supabase/server";

type ProjectRow = {
  id: number;
  name: string;
  created_at: string;
};

function mapRowToProject(row: ProjectRow): Project {
  return {
    createdAt: row.created_at,
    id: row.id,
    name: row.name,
  };
}

export async function listProjects() {
  const supabase = createServerSupabaseClient();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Could not load projects: ${error.message}`);
  }

  return (data as ProjectRow[]).map(mapRowToProject);
}

export async function createProject(name: string) {
  const supabase = createServerSupabaseClient();
  const trimmed = name.trim();

  if (!trimmed) {
    throw new Error("Project name is required.");
  }

  const { error } = await supabase
    .from("projects")
    .insert({ name: trimmed });

  if (error) {
    throw new Error(`Could not create project: ${error.message}`);
  }

  const projects = await listProjects();
  const created = projects.find((project) => project.name === trimmed);

  if (!created) {
    throw new Error("Project was created but could not be loaded.");
  }

  return created;
}
