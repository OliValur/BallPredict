"use client";
import Image from "next/image";
import { getTeamLogoPath } from "@/utils/getTeamLogoPath";

interface DivisionWinnerProps {
  divisionName: string;
  divisionDbName: string;
  teams: string[];
  onSubmit: (category: string, guess: string) => void;
  initialGuess?: string;
}

export default function DivisionWinner({
  divisionName,
  divisionDbName,
  teams,
  onSubmit,
  initialGuess,
}: DivisionWinnerProps) {
  // Determine grid layout based on number of teams
  const getGridCols = () => {
    if (teams.length > 16) {
      // Super Bowl winner with 32 teams - responsive grid up to 8 columns
      return "grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8";
    } else {
      // Regular divisions with 4 teams - 2x2 grid
      return "grid-cols-2";
    }
  };

  return (
    <div className="bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 p-4 hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 text-center mb-4">
        {divisionName}
      </h3>
      <div className={`grid ${getGridCols()} gap-3`}>
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => onSubmit(divisionDbName, team)}
            className={`group relative p-3 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
              team === initialGuess
                ? "border-green-500 bg-green-50 dark:bg-green-900/20 shadow-md"
                : "border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-600 hover:border-blue-400 dark:hover:border-blue-500"
            }`}
          >
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <Image
                  src={getTeamLogoPath(team)}
                  alt={team}
                  width={48}
                  height={48}
                  className="rounded-lg"
                />
                {team === initialGuess && (
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                )}
              </div>
              <span
                className={`text-xs font-medium text-center leading-tight ${
                  team === initialGuess
                    ? "text-green-700 dark:text-green-300"
                    : "text-slate-600 dark:text-slate-300"
                }`}
              >
                {team.split(" ").pop()} {/* Show only team name, not city */}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
