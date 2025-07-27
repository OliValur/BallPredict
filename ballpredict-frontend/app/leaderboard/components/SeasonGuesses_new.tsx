"use client";

import { useState, useEffect } from "react";
import { getLeagueSeasonPredictions } from "@/services/api";
import { useAuth } from "@clerk/clerk-react";
import { UserSeasonPredictions, TeamWithGuesses } from "@/types/allTypes";
import { getTeamLogoPath } from "@/utils/getTeamLogoPath";
import Image from "next/image";

interface SeasonGuessesProps {
  leagueId: string;
  teams: TeamWithGuesses[];
}

const categories = [
  { key: "nfc_east_winner", label: "NFC East Winner", type: "team" },
  { key: "nfc_north_winner", label: "NFC North Winner", type: "team" },
  { key: "nfc_south_winner", label: "NFC South Winner", type: "team" },
  { key: "nfc_west_winner", label: "NFC West Winner", type: "team" },
  { key: "afc_east_winner", label: "AFC East Winner", type: "team" },
  { key: "afc_north_winner", label: "AFC North Winner", type: "team" },
  { key: "afc_south_winner", label: "AFC South Winner", type: "team" },
  { key: "afc_west_winner", label: "AFC West Winner", type: "team" },
  {
    key: "most_receiving_yards",
    label: "Most Receiving Yards",
    type: "player",
  },
  { key: "most_running_yards", label: "Most Running Yards", type: "player" },
  { key: "most_throwing_yards", label: "Most Throwing Yards", type: "player" },
  { key: "rookie_of_the_year", label: "Rookie of the Year", type: "player" },
  { key: "mvp", label: "MVP", type: "player" },
  { key: "superbowl_winner", label: "Super Bowl Winner", type: "team" },
];

export default function SeasonGuesses({ leagueId, teams }: SeasonGuessesProps) {
  const { getToken } = useAuth();
  const [predictions, setPredictions] = useState<UserSeasonPredictions[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Create a mapping from userId to team name
  const userIdToTeamName = teams.reduce((acc, teamWithGuesses) => {
    acc[teamWithGuesses.team.id] = teamWithGuesses.team.team;
    return acc;
  }, {} as { [userId: string]: string });

  useEffect(() => {
    const fetchPredictions = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) {
          setError("Unable to authenticate");
          return;
        }

        const data = await getLeagueSeasonPredictions(leagueId, token);
        setPredictions(data);
      } catch (err) {
        console.error("Error fetching season predictions:", err);
        setError("Failed to load season predictions");
      } finally {
        setLoading(false);
      }
    };

    fetchPredictions();
  }, [leagueId, getToken]);

  const getUserPrediction = (userId: string, category: string): string => {
    const user = predictions.find((p) => p.userId === userId);
    if (!user) return "—";

    const value = user[category as keyof UserSeasonPredictions];
    return value || "—";
  };

  const isTeamGuess = (guess: string): boolean => {
    return guess !== "—" && guess !== null && guess !== "" && guess.length > 0;
  };

  const getTeamAbbreviation = (teamName: string): string => {
    const teamMap: { [key: string]: string } = {
      "Arizona Cardinals": "ARI",
      "Atlanta Falcons": "ATL",
      "Baltimore Ravens": "BAL",
      "Buffalo Bills": "BUF",
      "Carolina Panthers": "CAR",
      "Chicago Bears": "CHI",
      "Cincinnati Bengals": "CIN",
      "Cleveland Browns": "CLE",
      "Dallas Cowboys": "DAL",
      "Denver Broncos": "DEN",
      "Detroit Lions": "DET",
      "Green Bay Packers": "GB",
      "Houston Texans": "HOU",
      "Indianapolis Colts": "IND",
      "Jacksonville Jaguars": "JAX",
      "Kansas City Chiefs": "KC",
      "Las Vegas Raiders": "LV",
      "Los Angeles Chargers": "LAC",
      "Los Angeles Rams": "LAR",
      "Miami Dolphins": "MIA",
      "Minnesota Vikings": "MIN",
      "New England Patriots": "NE",
      "New Orleans Saints": "NO",
      "New York Giants": "NYG",
      "New York Jets": "NYJ",
      "Philadelphia Eagles": "PHI",
      "Pittsburgh Steelers": "PIT",
      "San Francisco 49ers": "SF",
      "Seattle Seahawks": "SEA",
      "Tampa Bay Buccaneers": "TB",
      "Tennessee Titans": "TEN",
      "Washington Commanders": "WAS",
    };
    return teamMap[teamName] || teamName;
  };

  const getCellBackgroundColor = (
    prediction: string,
    isCorrect?: boolean
  ): string => {
    if (prediction === "—" || prediction === "" || !prediction) {
      return "bg-slate-100 dark:bg-slate-700"; // Empty/no prediction
    }

    if (isCorrect === true) {
      return "bg-green-200 dark:bg-green-800"; // Correct prediction
    } else if (isCorrect === false) {
      return "bg-red-200 dark:bg-red-800"; // Incorrect prediction
    }

    return "bg-blue-100 dark:bg-blue-900"; // Has prediction, result unknown
  };

  if (loading) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏈</span>
            <h2 className="text-xl font-bold text-white">Season Predictions</h2>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-lg text-slate-600 dark:text-slate-400">
            Loading season predictions...
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏈</span>
            <h2 className="text-xl font-bold text-white">Season Predictions</h2>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-red-600 dark:text-red-400">{error}</div>
        </div>
      </div>
    );
  }

  if (predictions.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
        <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🏈</span>
            <h2 className="text-xl font-bold text-white">Season Predictions</h2>
          </div>
        </div>
        <div className="p-8 text-center">
          <div className="text-6xl mb-4">🏈</div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            No Season Predictions Yet
          </h3>
          <p className="text-slate-600 dark:text-slate-400">
            League members haven&apos;t made their season predictions yet.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700">
      <div className="bg-gradient-to-r from-purple-500 to-pink-600 px-6 py-4">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏈</span>
          <h2 className="text-xl font-bold text-white">Season Predictions</h2>
        </div>
      </div>

      <div className="p-6 overflow-x-auto">
        <div className="min-w-full">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="sticky left-0 z-20 bg-slate-200 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-4 py-3 text-left font-bold text-slate-900 dark:text-slate-100">
                  Prediction Category
                </th>
                {predictions.map((user) => (
                  <th
                    key={user.userId}
                    className="border border-slate-300 dark:border-slate-600 px-3 py-3 text-center font-semibold text-slate-900 dark:text-slate-100 bg-slate-100 dark:bg-slate-700 min-w-[140px]"
                  >
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-bold">
                        {userIdToTeamName[user.userId] ||
                          `User ${user.userId.slice(-4)}`}
                      </span>
                    </div>
                  </th>
                ))}
                <th className="border border-slate-300 dark:border-slate-600 px-3 py-3 text-center font-semibold text-slate-900 dark:text-slate-100 bg-emerald-100 dark:bg-emerald-800">
                  Winner
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category, index) => (
                <tr key={category.key}>
                  <td className="sticky left-0 z-10 bg-slate-100 dark:bg-slate-700 border border-slate-300 dark:border-slate-600 px-4 py-3 font-medium text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">
                        {category.type === "team" ? "🏆" : "👤"}
                      </span>
                      <span className="text-sm font-medium">
                        {category.label}
                      </span>
                    </div>
                  </td>
                  {predictions.map((user) => {
                    const guess = getUserPrediction(user.userId, category.key);
                    return (
                      <td
                        key={user.userId}
                        className={`border border-slate-300 dark:border-slate-600 px-3 py-3 text-center ${getCellBackgroundColor(
                          guess
                        )}`}
                      >
                        {category.type === "team" && isTeamGuess(guess) ? (
                          <div className="flex flex-col items-center gap-1">
                            <Image
                              src={getTeamLogoPath(getTeamAbbreviation(guess))}
                              alt={guess}
                              width={24}
                              height={24}
                              className="rounded"
                            />
                            <span className="text-xs font-medium text-slate-900 dark:text-slate-100">
                              {getTeamAbbreviation(guess)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm font-medium text-slate-900 dark:text-slate-100">
                            {guess}
                          </span>
                        )}
                      </td>
                    );
                  })}
                  <td className="border border-slate-300 dark:border-slate-600 px-3 py-3 text-center bg-emerald-100 dark:bg-emerald-800">
                    <span className="text-sm font-bold text-slate-900 dark:text-slate-100">
                      TBD
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
