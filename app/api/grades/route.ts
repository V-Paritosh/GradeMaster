import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { method, userId, update } = body;

  const { db } = await connectToDatabase();
  const collection = db.collection("grades");

  if (method === "GET") {
    const userGrades = await collection.findOne({ userId });
    return NextResponse.json(userGrades || { classes: [] });
  }

  if (method === "POST") {
    await collection.updateOne(
      { userId },
      { $set: { classes: update } },
      { upsert: true }
    );
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ message: "Invalid method" }, { status: 400 });
}
