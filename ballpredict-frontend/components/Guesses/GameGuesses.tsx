"use client";
import { useAuth, SignedIn, SignedOut, SignIn } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getGamesAndUserGuesses } from "@/services/api";
import { Game } from "@/types/game";
import GameRow from "./GameRow";
import { useState } from "react";

export default function GameGuesses() {
  const { getToken } = useAuth();
  const [selectedWeek, setSelectedWeek] = useState(1);

  const query = useQuery({
    queryKey: ["gameGuesses", selectedWeek],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        throw new Error("No token found");
      }
      const data = await getGamesAndUserGuesses(selectedWeek, token);
      return data;
    },
  });
  const weeks: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (query.isLoading) return <p>Loading...</p>;
  if (query.isError) return <p>Error: {(query.error as Error).message}</p>;

  return (
    <div className="flex flex-col items-center justify-center bg-amber-300 w-full md:w-2/3">
      <SignedIn>
        <div>
          <h1>Game Guesses</h1>
          <div>
            {weeks.map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`px-4 py-2 m-2 rounded-lg ${
                  selectedWeek === week
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 text-black"
                }`}
              >
                Week {week}
              </button>
            ))}
          </div>
          <div>
            <h2 className="mt-4 text-lg font-semibold">
              Games for Week {selectedWeek}
            </h2>
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
