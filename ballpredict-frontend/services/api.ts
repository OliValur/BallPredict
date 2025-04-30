import { supabaseClient } from "@/utils/supabase/client";

export async function getGamesAndUserGuesses(week: number) {
  {
    const { data: sessionData } = await supabaseClient.auth.getSession();

    const res = await fetch(`http://localhost:5245/api/Guesses/week/${week}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionData.session?.access_token}`,
      },
    });

    if (!res.ok) {
      console.error("Server rejected:", await res.text());
    } else {
      const guesses = await res.json();
      console.log(guesses);
      return guesses;
    }
  }
}
