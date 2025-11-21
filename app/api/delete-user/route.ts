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
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 }
    );
  }

  const token = authHeader.split(" ")[1];

  const supabaseClient = createClient(
    env(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    env(
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      "NEXT_PUBLIC_SUPABASE_ANON_KEY"
    ),
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  );

  const { data: authUser, error: userError } =
    await supabaseClient.auth.getUser();
  if (userError || !authUser?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = authUser.user.id;

  // Delete user from Supabase
  const admin = createClient(
    env(process.env.NEXT_PUBLIC_SUPABASE_URL, "NEXT_PUBLIC_SUPABASE_URL"),
    env(process.env.SUPABASE_SERVICE_ROLE_KEY, "SUPABASE_SERVICE_ROLE_KEY")
  );

  const { error: deleteError } = await admin.auth.admin.deleteUser(userId);
  if (deleteError) {
    return NextResponse.json({ error: deleteError.message }, { status: 500 });
  }

  // Delete user data from MongoDB
  try {
    const { db } = await connectToDatabase();
    await db.collection("grades").deleteOne({ userId });
  } catch (mongoError: any) {
    return NextResponse.json(
      { error: mongoError.message || "Failed to delete MongoDB data" },
      { status: 500 }
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
