"use client";

import { useState } from "react";
import { createTeam } from "@/services/api";
import { useAuth } from "@clerk/clerk-react";

export default function CreateTeam() {
  const [teamName, setTeamName] = useState("");
  const { getToken } = useAuth();

  async function createTeamHandler() {
    const token = await getToken({ template: "supabase" });
    console.log("Creating team with name:", teamName, "and token:", token);
    await createTeam(teamName, token ?? "");
  }
  return (
    <div>
      <h1>Create Your Team</h1>
      <p>Choose Team Name</p>
      <div className="mt-8">
        <h2 className="font-bold mb-2">Join League</h2>
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Team Name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <button className="bg-blue-500 p-2 rounded" onClick={createTeamHandler}>
          CreateTeam
        </button>
      </div>
    </div>
  );
}
// import { useAuth } from "@clerk/clerk-react";
