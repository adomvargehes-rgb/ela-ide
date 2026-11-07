import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder-project.supabase.co";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-anon-key";

// Supabase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ProjectRecord {
  id: string;
  user_id?: string;
  name: string;
  description?: string;
  files_json: string;
  settings_json: string;
  created_at?: string;
  updated_at?: string;
}

export async function saveProjectToCloud(
  name: string,
  files: any[],
  settings: any,
  projectId?: string
): Promise<{ success: boolean; id?: string; error?: string }> {
  try {
    const payload = {
      name,
      files_json: JSON.stringify(files),
      settings_json: JSON.stringify(settings),
      updated_at: new Date().toISOString(),
    };

    if (projectId) {
      const { data, error } = await supabase
        .from("projects")
        .update(payload)
        .eq("id", projectId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, id: data.id };
    } else {
      const { data, error } = await supabase
        .from("projects")
        .insert([{ ...payload, created_at: new Date().toISOString() }])
        .select()
        .single();

      if (error) throw error;
      return { success: true, id: data.id };
    }
  } catch (err: any) {
    console.warn("Supabase project sync skipped or unavailable:", err.message);
    return { success: false, error: err.message };
  }
}

export async function loadProjectFromCloud(projectId: string): Promise<ProjectRecord | null> {
  try {
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .eq("id", projectId)
      .single();

    if (error) throw error;
    return data;
  } catch (err) {
    console.warn("Failed to load project from Supabase:", err);
    return null;
  }
}
