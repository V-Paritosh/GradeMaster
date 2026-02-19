import { NextRequest, NextResponse } from "next/server";
import { getAdminAuth } from "@/lib/firebaseAdmin";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json(
      { error: "Missing Authorization header" },
      { status: 401 },
    );
  }

  const token = authHeader.split(" ")[1];

  let userId: string;
  try {
    const decoded = await getAdminAuth().verifyIdToken(token);
    userId = decoded.uid;
  } catch {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    await getAdminAuth().deleteUser(userId);
  } catch (deleteError: unknown) {
    const err = deleteError as { message?: string };
    return NextResponse.json(
      { error: err.message ?? "Failed to delete user" },
      { status: 500 },
    );
  }

  try {
    const { db } = await connectToDatabase();
    await db.collection("grades").deleteMany({ userId });
  } catch (mongoError: unknown) {
    const err = mongoError as { message?: string };
    console.error("MongoDB Error:", mongoError);
    return NextResponse.json(
      { error: err.message ?? "Failed to delete MongoDB data" },
      { status: 500 },
    );
  }

  return NextResponse.json({ success: true }, { status: 200 });
}
