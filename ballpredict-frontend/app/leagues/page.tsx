"use client";
import { createLeague, joinLeague } from "@/services/api";
import Form from "next/form";
import { useAuth } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";

export default function LeaguesPage() {
  const { getToken } = useAuth();
  const router = useRouter();

  const createLeagueHandler = async (formData: FormData) => {
    const leagueName = formData.get("leagueName") as string;
    const token = await getToken({ template: "supabase" });
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const response = await createLeague(leagueName, token);
      //if response is successful, redirect user to the leaderboard page for that league
      if (response && response.id) {
        console.log("League created with ID:", response.id);
        router.push("/leaderboard");
      }
      console.log("League created successfully:", response);
    } catch (error) {
      console.error("Error creating league:", error);
    }
  };

  const joinLeagueHandler = async (formData: FormData) => {
    const inviteCode = formData.get("leagueId") as string;
    if (inviteCode.length != 8) {
      console.error("Invalid invite code length. It should be 6 characters.");
      return;
    }
    const token = await getToken({ template: "supabase" });
    if (!token) {
      throw new Error("No token found");
    }
    try {
      const response = await joinLeague(inviteCode, token);
      //if response is successful, redirect user to the leaderboard page for that league
      if (response && response.id) {
        console.log("Joined league with ID:", response.id);
        router.push("/leaderboard");
      }
    } catch (error) {
      console.error("Error joining league:", error);
    }
  };
  return (
    <div>
      <h1>Leagues</h1>
      <p>Leagues page content goes here.</p>
      <Form action={createLeagueHandler}>
        <p>Enter league name:</p>
        <input
          type="text"
          name="inviteCode"
          placeholder="Invite Code"
          required
        />
        <button type="submit">Create League</button>
      </Form>

      <Form action={joinLeagueHandler}>
        <p>Join a league:</p>
        <input type="text" name="leagueId" placeholder="League ID" required />
        <button type="submit">Join League </button>
      </Form>
    </div>
  );
}
