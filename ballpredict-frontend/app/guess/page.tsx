"use client";

import { createClient } from "@/utils/supabase/client";

export default function GuessPage() {
  async function handleClick() {
    const supabase = await createClient();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
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
        gameId: "3049b672-adea-4cde-b746-138933b478a1", // a UUID string, e.g. "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        guess: 2, // an integer
      }),
    });
    if (!res.ok) {
      // handle error...
      console.error("Server rejected:", await res.text());
    } else {
      const created = await res.json();
      console.log("Saved guess:", created);
    }
    console.log(res);
    const data = await res.json();
    console.log(data);
  }

  async function getGuesses() {
    const supabase = await createClient();
    const { data: sessionData, error: sessionError } =
      await supabase.auth.getSession();
    const refreshToken = sessionData.session?.refresh_token;
    const res = await fetch("http://localhost:5245/api/Guesses", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
        "x-refresh-token": refreshToken ?? "",
      },
    });
    if (!res.ok) {
      // handle error...
      console.error("Server rejected:", await res.text());
    } else {
      const guesses = await res.json();
      console.log(guesses);
    }
  }
  return (
    <div>
      <div>
        <button className="bg-amber-500" onClick={handleClick}>
          Búa til Gisk
        </button>
      </div>
      <div>
        <button className="bg-red-500 mt-4" onClick={getGuesses}>
          Sækja Gisk
        </button>
      </div>
    </div>
  );
}
