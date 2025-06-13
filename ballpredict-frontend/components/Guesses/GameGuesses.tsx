"use client";
import { useAuth, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getGamesAndUserGuesses } from "@/services/api";
import { Game } from "@/types/game";
import GameRow from "./GameRow";

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
      return data;
    },
  });

  if (query.isLoading) return <p>Loading...</p>;
  if (query.isError) return <p>Error: {(query.error as Error).message}</p>;

  return (
    <div className="flex flex-col items-center justify-center bg-amber-300 w-full md:w-2/3">
      <SignedIn>
        <div>
          <h1>Game Guesses</h1>
          <div>
            {query.data.map((game: Game) => (
              <GameRow key={game.id} {...game} />
            ))}
          </div>
        </div>
      </SignedIn>
      <SignedOut>
        <div>
          <p>Please sign in to see your game guesses.</p>
          <SignIn />
        </div>
      </SignedOut>
    </div>
  );
}
