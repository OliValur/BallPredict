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
import { Game } from "@/types/allTypes";
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

  if (!isLoaded || query.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="text-lg text-slate-600 dark:text-slate-300">
              Loading your game predictions...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (query.isError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <h3 className="font-semibold text-red-900 dark:text-red-100">
                  Error Loading Games
                </h3>
                <p className="text-red-700 dark:text-red-200">
                  {(query.error as Error).message}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const userId = user?.id;
  if (!userId || !token) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
        <div className="container mx-auto px-4 py-16">
          <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 max-w-md mx-auto">
            <div className="flex items-center space-x-3">
              <span className="text-2xl">🔐</span>
              <div>
                <h3 className="font-semibold text-yellow-900 dark:text-yellow-100">
                  Authentication Required
                </h3>
                <p className="text-yellow-700 dark:text-yellow-200">
                  Please sign in to access your predictions
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <SignedIn>
        <div className="container mx-auto px-4 py-12">
          {/* Week Selection */}
          <div className="mb-12">
            <div className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto">
              {weeks.map((week) => (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={`group relative px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
                    selectedWeek === week
                      ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg scale-105"
                      : "bg-white/80 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 hover:shadow-md hover:scale-102"
                  }`}
                >
                  {selectedWeek === week && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-50 -z-10"></div>
                  )}
                  Week {week}
                </button>
              ))}
            </div>
          </div>

          {/* Games Section */}
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4">
              {query.data?.length === 0 ? (
                <div className="col-span-full text-center py-12">
                  <div className="w-20 h-20 bg-slate-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-3xl">🤔</span>
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                    No Games This Week
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300">
                    Check back later for upcoming matchups!
                  </p>
                </div>
              ) : (
                query.data
                  ?.sort(
                    (a: Game, b: Game) =>
                      new Date(a.startTime).getTime() -
                      new Date(b.startTime).getTime()
                  )
                  ?.map((game: Game) => (
                    <GameRow
                      key={game.id}
                      game={game}
                      userId={userId}
                      token={token}
                      initialGuess={
                        game.guesses?.find((g) => g.userId === userId) || null
                      }
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </SignedIn>

      <SignedOut>
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-md mx-auto">
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-xl p-8">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl">🔐</span>
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                Sign In Required
              </h2>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Please sign in to access your game predictions and compete with
                friends.
              </p>
              <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4">
                <SignIn />
              </div>
            </div>
          </div>
        </div>
      </SignedOut>
    </div>
  );
}
