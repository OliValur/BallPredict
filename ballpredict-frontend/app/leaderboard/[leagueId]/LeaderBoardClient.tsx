"use client";

import { useEffect, useState } from "react";
import { getGamesAndUserGuesses, getLeagueScores } from "@/services/api";

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
  initialGames,
}: {
  leagueId: string;
  token: string;
  teams: TeamWithGuesses[];
  initialWeek: number;
  initialGames: Game[];
}) {
  const [week, setWeek] = useState(initialWeek);
  const [games, setGames] = useState<Game[]>(initialGames);

  useEffect(() => {
    async function fetchGames() {
      //get games for the selected week
      const res = await getLeagueScores(leagueId, token);

      console.log("Fetched league scores:", res);
      setGames(res);
    }
    fetchGames();
  }, []);

  const sortedTeams = [...teams].sort(
    (a, b) => b.team.points.totalPoints - a.team.points.totalPoints
  );

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

      <table className="w-full mb-8 border">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Team</th>
            <th>Total Points</th>
            <th>Week {week} Points</th>
          </tr>
        </thead>
        <tbody>
          {sortedTeams.map((t, i) => (
            <tr key={t.team.id}>
              <td>{i + 1}</td>
              <td>{t.team.team}</td>
              <td>{t.team.points.totalPoints}</td>
              <td>{t.team.points.weeks[week.toString()] ?? 0}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3 className="text-lg font-semibold mb-2">Games Week {week}</h3>
      <table className="w-full border">
        <thead>
          <tr>
            <th>Game</th>
            {teams.map((t) => (
              <th key={t.team.id}>{t.team.team}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {games.map((game) => (
            <tr key={game.id}>
              <td>
                {game.homeTeam} vs {game.awayTeam}
              </td>
              {teams.map((t) => {
                const userGuess = t.guesses.find(
                  (g) => g.prediction !== undefined && g.userId === t.team.id
                );

                const playerGuess = game.guesses.find(
                  (g) => g.userId === t.team.id
                );

                const show = true;
                //game.isFinished || new Date(game.startTime) < new Date();
                const correct =
                  game.isFinished && playerGuess?.guess === game.result;
                return (
                  <td
                    key={t.team.id + game.id}
                    className={correct ? "bg-green-200" : ""}
                  >
                    {show ? playerGuess?.guess ?? "-" : "🔒"}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>Total correct</td>
            {teams.map((t) => {
              const correctCount = games.reduce((acc, game) => {
                const guess = game.guesses.find((g) => g.userId === t.team.id);
                return (
                  acc +
                  (game.isFinished && guess?.guess === game.result ? 1 : 0)
                );
              }, 0);
              return <td key={t.team.id}>{correctCount}</td>;
            })}
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
