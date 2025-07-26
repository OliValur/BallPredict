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
}: {
  teams: TeamWithGuesses[];
  initialWeek: number;
  allGames: Game[];
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
    <div className="p-4 space-y-4">
      {/* View Selector */}
      <div className="flex gap-2">
        <button
          onClick={() => setSelection("standings")}
          className={`px-4 py-2 rounded-md ${
            selection === "standings" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Standings
        </button>
        <button
          onClick={() => setSelection("guesses")}
          className={`px-4 py-2 rounded-md ${
            selection === "guesses" ? "bg-blue-600 text-white" : "bg-gray-200"
          }`}
        >
          Weekly Guesses
        </button>
        <button
          onClick={() => setSelection("seasonGuesses")}
          className={`px-4 py-2 rounded-md ${
            selection === "seasonGuesses"
              ? "bg-blue-600 text-white"
              : "bg-gray-200"
          }`}
        >
          Season Guesses
        </button>
      </div>

      {/* Week Selector */}
      {selection === "guesses" && (
        <div>
          <label className="mr-2 font-medium">Week:</label>
          <select
            value={week}
            onChange={(e) => setWeek(Number(e.target.value))}
            className="border px-2 py-1 rounded-md"
          >
            {Array.from({ length: 22 }, (_, i) => i + 1).map((w) => (
              <option key={w} value={w}>
                Week {w}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Render selected view */}
      {selection === "standings" && <Standing teams={sortedTeams} />}
      {selection === "guesses" && (
        <GameGuesses sortedTeams={sortedTeams} weeksGames={weeksGames} />
      )}
      {selection === "seasonGuesses" && <SeasonGuesses name="Season Guesses" />}
    </div>
  );
}
