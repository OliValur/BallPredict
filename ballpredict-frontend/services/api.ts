import { useAuth } from "@clerk/clerk-react";

export function useGamesAndUserGuesses() {
  const { getToken } = useAuth();

  async function getGamesAndUserGuesses(week: number) {
    const token = await getToken({ template: "supabase" });
    console.log("Token:", token);
    const res = await fetch(`http://localhost:5245/api/Guesses/week/${week}`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      console.error("Server rejected:", await res.text());
      return null;
    }

    return await res.json();
  }

  return { getGamesAndUserGuesses };
}
