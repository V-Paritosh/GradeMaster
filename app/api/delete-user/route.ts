import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { connectToDatabase } from "@/lib/mongodb";

function env(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`Missing env: ${name}`);
  }
  return value;
}

export async function POST(req: NextRequest) {
  // 1. Extract the Token
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 },
    );
  }

  const token = authHeader.split(" ")[1];

  // 2. Verify the User (Standard Client)
  // Fix: Add auth options to disable persistence
  const supabase = createClient(
    env(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    env(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
    ),
    {
      auth: {
        persistSession: false, // Critical for server-side usage
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  // Pass the token directly to getUser to validate it
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(token);

  if (userError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = user.id;

  // 3. Delete User from Supabase (Admin Client)
  // Fix: Add auth options to disable persistence here too
  const admin = createClient(
    env(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    env(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false, // Critical: Prevents "localStorage is not defined" errors
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    },
  );

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // 4. Delete User Data from MongoDB
  try {
    const { db } = await connectToDatabase();

    // Using deleteMany in case there are orphaned records, though deleteOne works for unique IDs
    await db.collection("grades").deleteMany({ userId });
  } catch (mongoError: any) {
    console.error("MongoDB Error:", mongoError);
    return NextResponse.json(
      { error: mongoError.message || "Failed to delete MongoDB data" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
