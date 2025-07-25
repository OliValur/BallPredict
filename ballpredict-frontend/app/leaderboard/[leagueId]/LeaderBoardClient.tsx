"use client";

import { useEffect, useState } from "react";
import { getLeagueScores } from "@/services/api";

type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  isFinished: boolean;
  result: number | null;
  guesses: {
    userId: string;
    guess: number;
  }[];
};

type Team = {
  id: string;
  team: string;
  points: {
    weeks: Record<string, number>;
    totalPoints: number;
  };
};

type TeamWithGuesses = {
  team: Team;
  guesses: {
    userId: string;
    prediction: number;
  }[];
};

export default function LeaderboardClient({
  leagueId,
  token,
  teams,
  initialWeek,
  allGames,
}: {
  leagueId: string;
  token: string;
  teams: TeamWithGuesses[];
  initialWeek: number;
  allGames: Game[];
}) {
  const [week, setWeek] = useState(initialWeek);

  const sortedTeams = [...teams].sort(
    (a, b) => b.team.points.totalPoints - a.team.points.totalPoints
  );
  console.log("sortedTeams", sortedTeams);
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">League Leaderboard</h2>
      <div className="mb-4">
        <label>Week: </label>
        <select value={week} onChange={(e) => setWeek(Number(e.target.value))}>
          {[...Array(22)].map((_, i) => (
            <option key={i} value={i + 1}>
              Week {i + 1}
            </option>
          ))}
        </select>
      </div>
      <div>
        {sortedTeams.map((currentTeam) => (
          <div key={currentTeam.team.id} className="mb-4">
            <h3 className="text-lg font-semibold">{currentTeam.team.team}</h3>
            <p>Total Points: {currentTeam.team.points.totalPoints}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
