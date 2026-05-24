import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const revalidate = 300; // Cache for 5 minutes

export async function GET() {
  try {
    const [totalCategories, totalPrompts, totalUsers] = await Promise.all([
      db.category.count(),
      db.prompt.count({ where: { isPrivate: false, isUnlisted: false } }),
      db.user.count(),
    ]);

    return NextResponse.json({ totalCategories, totalPrompts, totalUsers });
  } catch {
    return NextResponse.json(
      { totalCategories: 0, totalPrompts: 0, totalUsers: 0 },
      { status: 200 }
    );
  }
}
