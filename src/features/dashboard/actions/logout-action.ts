"use server";

import { auth } from "@/shared/lib/auth/server";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function logoutAction() {
  await auth.api.signOut({
    headers: await headers(),
  });
  
  redirect("/");
}