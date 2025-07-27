"use client";

import { useState } from "react";
import { Game, TeamWithGuesses } from "@/types/allTypes";
import Standing from "../components/Standings";
import GameGuesses from "../components/Guesses";
import SeasonGuesses from "../components/SeasonGuesses";

export default function LeaderboardClient({
  teams,
  initialWeek,
  allGames,
  leagueId,
}: {
  teams: TeamWithGuesses[];
  initialWeek: number;
  allGames: Game[];
  leagueId: string;
}) {
  const [week, setWeek] = useState(initialWeek);
  const [selection, setSelection] = useState<
    "standings" | "guesses" | "seasonGuesses"
  >("standings");
  const weeksGames = allGames.filter((game) => game.week === week);

  const sortedTeams = [...teams].sort(
    (a, b) => b.team.points.totalPoints - a.team.points.totalPoints
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* View Selector */}
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 p-6">
          <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
            <button
              onClick={() => setSelection("standings")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selection === "standings"
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg transform scale-105"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              📊 Standings
            </button>
            <button
              onClick={() => setSelection("guesses")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selection === "guesses"
                  ? "bg-gradient-to-r from-emerald-500 to-teal-600 text-white shadow-lg transform scale-105"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              🎯 Weekly Guesses
            </button>
            <button
              onClick={() => setSelection("seasonGuesses")}
              className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                selection === "seasonGuesses"
                  ? "bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg transform scale-105"
                  : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              🏈 Season Predictions
            </button>
          </div>

          {/* Week Selector */}
          {selection === "guesses" && (
            <div className="mt-6 flex items-center justify-center sm:justify-start gap-3">
              <label className="font-medium text-slate-700 dark:text-slate-300">
                Select Week:
              </label>
              <select
                value={week}
                onChange={(e) => setWeek(Number(e.target.value))}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              >
                {Array.from({ length: 22 }, (_, i) => i + 1).map((w) => (
                  <option key={w} value={w}>
                    Week {w}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Render selected view */}
        {selection === "standings" && <Standing teams={sortedTeams} />}
        {selection === "guesses" && (
          <GameGuesses sortedTeams={sortedTeams} weeksGames={weeksGames} />
        )}
        {selection === "seasonGuesses" && (
          <SeasonGuesses leagueId={leagueId} teams={teams} />
        )}
      </div>
    </div>
  );
}
