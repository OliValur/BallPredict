"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import GameGuesses from "@/components/GameGuesses";

export default function GuessPage() {
  const [leagueName, setLeagueName] = useState("");
  const [sportType, setSportType] = useState("");
  const [leagueIdToJoin, setLeagueIdToJoin] = useState("");

  async function handleClick() {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const refreshToken = sessionData.session?.refresh_token;

    const res = await fetch("http://localhost:5245/api/Guesses", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
        "x-refresh-token": refreshToken ?? "",
      },
      body: JSON.stringify({
        gameId: "3049b672-adea-4cde-b746-138933b478a1",
        guess: 2,
      }),
    });

    if (!res.ok) {
      console.error("Server rejected:", await res.text());
    } else {
      const created = await res.json();
      console.log("Saved guess:", created);
    }
  }

  async function getGuesses() {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const refreshToken = sessionData.session?.refresh_token;

    const res = await fetch("http://localhost:5245/api/Guesses/week/1", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
        "x-refresh-token": refreshToken ?? "",
      },
    });

    if (!res.ok) {
      console.error("Server rejected:", await res.text());
    } else {
      const guesses = await res.json();
      console.log(guesses);
    }
  }

  async function createLeague() {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const refreshToken = sessionData.session?.refresh_token;

    const res = await fetch("http://localhost:5245/api/League", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
        "x-refresh-token": refreshToken ?? "",
      },
      body: JSON.stringify({
        name: leagueName,
        sportType: sportType,
      }),
    });

    if (!res.ok) {
      console.error("Server rejected:", await res.text());
    } else {
      const createdLeague = await res.json();
      console.log("Created league:", createdLeague);
    }
  }

  async function joinLeague() {
    const supabase = await createClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const refreshToken = sessionData.session?.refresh_token;

    const res = await fetch(
      `http://localhost:5245/api/LeagueMembership/${leagueIdToJoin}`,
      {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionData.session?.access_token}`,
          "x-refresh-token": refreshToken ?? "",
        },
      }
    );

    if (!res.ok) {
      console.error("Server rejected:", await res.text());
    } else {
      const joined = await res.json();
      console.log("Joined league:", joined);
    }
  }

  return (
    <div className="p-4 space-y-4">
      <GameGuesses />
      <div>
        <button className="bg-amber-500 p-2 rounded" onClick={handleClick}>
          Búa til Gisk
        </button>
      </div>

      <div>
        <button className="bg-red-500 mt-4 p-2 rounded" onClick={getGuesses}>
          Sækja Gisk
        </button>
      </div>

      <div className="mt-8">
        <h2 className="font-bold mb-2">Create League</h2>
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="League Name"
          value={leagueName}
          onChange={(e) => setLeagueName(e.target.value)}
        />
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="Sport Type"
          value={sportType}
          onChange={(e) => setSportType(e.target.value)}
        />
        <button className="bg-green-500 p-2 rounded" onClick={createLeague}>
          Create League
        </button>
      </div>

      <div className="mt-8">
        <h2 className="font-bold mb-2">Join League</h2>
        <input
          className="border p-2 mr-2"
          type="text"
          placeholder="League ID"
          value={leagueIdToJoin}
          onChange={(e) => setLeagueIdToJoin(e.target.value)}
        />
        <button className="bg-blue-500 p-2 rounded" onClick={joinLeague}>
          Join League
        </button>
      </div>
    </div>
  );
}
