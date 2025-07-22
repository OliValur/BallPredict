"use client";

import {
  useAuth,
  useUser,
  SignedIn,
  SignedOut,
  SignIn,
} from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getGamesAndUserGuesses } from "@/services/api";
import { Game } from "@/types/game";
import GameRow from "./GameRow";
import { useEffect, useState } from "react";

export default function GameGuesses() {
  const { getToken } = useAuth();
  const { user, isLoaded } = useUser();
  const [token, setToken] = useState<string | null>(null);
  const [selectedWeek, setSelectedWeek] = useState(1);

  useEffect(() => {
    const fetchToken = async () => {
      const fetched = await getToken({ template: "supabase" });
      setToken(fetched || null);
    };
    fetchToken();
  }, [getToken]);

  const query = useQuery({
    queryKey: ["gameGuesses", selectedWeek],
    queryFn: async () => {
      if (!token) throw new Error("No token found");
      return getGamesAndUserGuesses(selectedWeek, token);
    },
    enabled: !!token,
  });

  const weeks = Array.from({ length: 10 }, (_, i) => i + 1);

  if (!isLoaded || query.isLoading) return <p>Loading...</p>;
  if (query.isError) return <p>Error: {(query.error as Error).message}</p>;

  const userId = user?.id;
  if (!userId || !token) return <p>Not authenticated</p>;

  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 p-4">
      <SignedIn>
        <div>
          <h1 className="mb-2 text-center text-2xl font-bold">Game Guesses</h1>
          <div className="flex flex-wrap justify-center gap-2">
            {weeks.map((week) => (
              <button
                key={week}
                onClick={() => setSelectedWeek(week)}
                className={`rounded-md border px-3 py-1 text-sm transition-colors  ${
                  selectedWeek === week
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200 text-black hover:bg-gray-300"
                }`}
              >
                Week {week}
              </button>
            ))}
          </div>
          <div className="space-y-4">
            <h2 className="mt-4 text-lg font-semibold text-center">
              Games for Week {selectedWeek}
            </h2>
            {query.data.map((game: Game) => (
              <GameRow
                key={game.id}
                game={game}
                userId={userId}
                token={token}
                initialGuess={
                  game.guesses?.find((g) => g.userId === userId) || null
                }
              />
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
