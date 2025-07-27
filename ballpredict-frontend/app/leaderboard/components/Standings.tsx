"use client";

import { TeamWithGuesses } from "@/types/allTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

export default function Standing({ teams }: { teams: TeamWithGuesses[] }) {
  const sortedTeams = [...teams].sort(
    (a, b) => b.team.points.totalPoints - a.team.points.totalPoints
  );

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return "🥇";
      case 2:
        return "🥈";
      case 3:
        return "🥉";
      default:
        return `#${rank}`;
    }
  };

  const getRankBadgeClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "bg-gradient-to-r from-yellow-400 to-yellow-600 text-white";
      case 2:
        return "bg-gradient-to-r from-gray-300 to-gray-500 text-white";
      case 3:
        return "bg-gradient-to-r from-amber-600 to-amber-800 text-white";
      default:
        return "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300";
    }
  };

  return (
    <div className="space-y-4 sm:space-y-8">
      {/* Main Standings Table */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">🏆</span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              League Standings
            </h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm px-2 sm:px-4">
                  Rank
                </TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 text-xs sm:text-sm px-2 sm:px-4">
                  Team
                </TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 text-center text-xs sm:text-sm px-2 sm:px-4">
                  Points
                </TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 text-center text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                  Regular
                </TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 text-center text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                  Playoffs
                </TableHead>
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 text-center text-xs sm:text-sm px-2 sm:px-4 hidden sm:table-cell">
                  Season
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedTeams.map((team, index) => (
                <TableRow
                  key={team.team.id}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-600"
                >
                  <TableCell className="py-2 sm:py-4 px-2 sm:px-4">
                    <div
                      className={`inline-flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-bold ${getRankBadgeClass(
                        index + 1
                      )}`}
                    >
                      {index < 3 ? getRankIcon(index + 1) : index + 1}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 px-2 sm:px-4">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm sm:text-base truncate max-w-[100px] sm:max-w-none">
                        {team.team.team}
                      </span>
                      {index === 0 && (
                        <span className="text-xs sm:text-sm">👑</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 text-center px-2 sm:px-4">
                    <span className="font-bold text-base sm:text-lg text-blue-600 dark:text-blue-400">
                      {team.team.points.totalPoints}
                    </span>
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 text-center px-2 sm:px-4 hidden sm:table-cell">
                    <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                      Coming Soon
                    </span>
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 text-center px-2 sm:px-4 hidden sm:table-cell">
                    <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                      Coming Soon
                    </span>
                  </TableCell>
                  <TableCell className="py-2 sm:py-4 text-center px-2 sm:px-4 hidden sm:table-cell">
                    <span className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm">
                      Coming Soon
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Weekly Performance - Compact Mobile View */}
      <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-4 py-3 sm:px-6 sm:py-4">
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-xl sm:text-2xl">📊</span>
            <h2 className="text-lg sm:text-xl font-bold text-white">
              Weekly Performance
            </h2>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="block sm:hidden p-4 space-y-3">
          {Array.from({ length: 10 }, (_, week) => (
            <div
              key={week + 1}
              className="bg-slate-50 dark:bg-slate-700 rounded-lg p-3"
            >
              <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2 text-sm">
                Week {week + 1}
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {sortedTeams.map((team) => {
                  const weeklyPoints =
                    team.team.points.weeks[`week${week + 1}`] || 0;
                  return (
                    <div
                      key={team.team.id}
                      className="flex items-center justify-between"
                    >
                      <span className="text-xs text-slate-600 dark:text-slate-400 truncate max-w-[80px]">
                        {team.team.team}
                      </span>
                      <span
                        className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                          weeklyPoints > 0
                            ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                            : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                        }`}
                      >
                        {weeklyPoints}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 px-3 py-2 text-sm">
                  Week
                </TableHead>
                {sortedTeams.map((team) => (
                  <TableHead
                    key={team.team.id}
                    className="font-bold text-slate-900 dark:text-slate-100 text-center min-w-[80px] px-2 py-2 text-sm"
                  >
                    <div className="truncate">{team.team.team}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 10 }, (_, week) => (
                <TableRow
                  key={week + 1}
                  className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-600"
                >
                  <TableCell className="py-2 px-3">
                    <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                      Week {week + 1}
                    </span>
                  </TableCell>
                  {sortedTeams.map((team) => {
                    const weeklyPoints =
                      team.team.points.weeks[`week${week + 1}`] || 0;
                    return (
                      <TableCell
                        key={team.team.id}
                        className="py-2 text-center px-2"
                      >
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                            weeklyPoints > 0
                              ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300"
                              : "bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400"
                          }`}
                        >
                          {weeklyPoints}
                        </span>
                      </TableCell>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
