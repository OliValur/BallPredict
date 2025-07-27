// lib/getServerToken.ts
import { auth } from "@clerk/nextjs/server";

export async function getServerToken(): Promise<string> {
  const { getToken } = await auth();
  const token = await getToken({ template: "supabase" });

  if (!token) {
    throw new Error("No JWT token found");
  }

  return token;
}
