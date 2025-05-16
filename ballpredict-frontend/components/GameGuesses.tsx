"use client";
import { useAuth, SignedIn, SignedOut } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getGamesAndUserGuesses } from "@/services/api";
import SeasonCountdown from "./SeasonCountdown";

export default function GameGuesses() {
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: ["gameGuesses"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        throw new Error("No token found");
      }
      const data = await getGamesAndUserGuesses(1, token);
      console.log("Fetched data:", data);
      return data;
    },
  });

  if (query.isLoading) return <p>Loading...</p>;
  if (query.isError) return <p>Error: {(query.error as Error).message}</p>;

  return (
    <div>
      <SignedIn>
        <div>
          <SeasonCountdown />
          <h1>Game Guesses</h1>
          {query.data.map((game: any) => (
            <div key={game.id}>
              <p>{game.awayTeam}</p>
              {/* could add guess logic here */}
            </div>
          ))}
        </div>
      </SignedIn>
      <SignedOut>
        <div>
          <p>Please sign in to see your game guesses.</p>
        </div>
      </SignedOut>
    </div>
  );
}
