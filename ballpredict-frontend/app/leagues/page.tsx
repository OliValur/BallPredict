"use client";
import { createLeague, joinLeague } from "@/services/api";
import Form from "next/form";
import { useAuth } from "@clerk/clerk-react";

export default function LeaguesPage() {
  const { getToken } = useAuth();

  const createLeagueHandler = async (formData: FormData) => {
    const leagueName = formData.get("leagueName") as string;
    const token = await getToken({ template: "supabase" });
    if (!token) {
      throw new Error("No token found");
    }
    return createLeague(leagueName, token);
  };
  return (
    <div>
      <h1>Leagues</h1>
      <p>Leagues page content goes here.</p>
      <Form action={createLeagueHandler}>
        <input
          type="text"
          name="leagueName"
          placeholder="League Name"
          required
        />
        <button type="submit">Create League</button>
      </Form>
    </div>
  );
}
