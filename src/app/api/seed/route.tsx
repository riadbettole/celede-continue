import { NextResponse } from "next/server";

import { auth } from "@/shared/lib/auth/server";
import { db } from "@/shared/lib/drizzle";

import { eq } from "drizzle-orm";
import { user } from "@/shared/db/schema";

export async function POST(req: Request) {

  const secret = req.headers.get("x-api-secret");
  if (!secret || secret !== "slt-admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const email = "riad@gmail.com";
  const password = "Abcd1234";

  const existingCount = await db.$count(user, eq(user.email, email));
  if (existingCount > 0) {
    return NextResponse.json({ ok: true, skipped: true, reason: "User already exists" });
  }


  const created = await auth.api.signUpEmail({
    body: {
      email,
      password,
      name: "Admin",
    },
  });

  return NextResponse.json({ ok: true, created });
}