import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/storage/supabase";

export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    // If Supabase credentials configured, fetch projects from DB
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
      let query = supabase.from("projects").select("id, name, description, template_id, created_at, updated_at").order("updated_at", { ascending: false });

      if (token) {
        // Authenticated user query
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) {
          query = query.eq("user_id", user.id);
        }
      }

      const { data, error } = await query;
      if (error) throw error;
      return NextResponse.json({ projects: data || [] });
    }

    // Default sample projects if no DB configured yet
    return NextResponse.json({
      projects: [
        {
          id: "proj-default",
          name: "My Next.js Application",
          description: "Default starter workspace with React & Tailwind",
          template_id: "react",
          updated_at: new Date().toISOString(),
        },
      ],
    });
  } catch (error: any) {
    console.error("GET /api/projects error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, template_id = "react", files, settings } = body;

    if (!name) {
      return NextResponse.json({ error: "Project name is required" }, { status: 400 });
    }

    const projectId = `proj-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const authHeader = req.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_URL !== "https://placeholder-project.supabase.co") {
      let userId = null;
      if (token) {
        const { data: { user } } = await supabase.auth.getUser(token);
        if (user) userId = user.id;
      }

      const { data, error } = await supabase
        .from("projects")
        .insert([
          {
            id: projectId,
            user_id: userId,
            name,
            template_id,
            files_json: JSON.stringify(files || []),
            settings_json: JSON.stringify(settings || {}),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;
      return NextResponse.json({ project: data });
    }

    return NextResponse.json({
      project: {
        id: projectId,
        name,
        template_id,
        updated_at: new Date().toISOString(),
      },
    });
  } catch (error: any) {
    console.error("POST /api/projects error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}

