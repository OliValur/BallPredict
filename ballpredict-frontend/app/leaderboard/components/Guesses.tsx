import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Game, TeamWithGuesses } from "@/types/allTypes";

export default function GameGuesses({
  sortedTeams,
  weeksGames,
}: {
  sortedTeams: TeamWithGuesses[];
  weeksGames: Game[];
}) {
  const getGameStatus = (game: Game) => {
    if (game.startTime > new Date().toISOString()) return "upcoming";
    if (!game.isFinished) return "live";
    return "finished";
  };

  const getResultIcon = (result: number | null, userGuess: number | null) => {
    if (!result || !userGuess) return null;

    // Check if the user's guess matches the actual result
    if (result === userGuess) {
      return "✅"; // Correct guess
    } else {
      return "❌"; // Wrong guess
    }
  };

  const formatGameScore = (game: Game) => {
    // Type assertion to access score properties that exist in the API but not in the type
    const gameWithScores = game as Game & {
      homeTeamScore?: number | null;
      awayTeamScore?: number | null;
    };

    const awayScore = gameWithScores.awayTeamScore;
    const homeScore = gameWithScores.homeTeamScore;

    if (
      awayScore !== null &&
      homeScore !== null &&
      awayScore !== undefined &&
      homeScore !== undefined
    ) {
      return {
        awayScore,
        homeScore,
        awayTeamWon: awayScore > homeScore,
        homeTeamWon: homeScore > awayScore,
        isTie: awayScore === homeScore,
      };
    }
    return null;
  };

  const renderGameTitle = (game: Game, gameStatus: string) => {
    const scoreData = formatGameScore(game);

    if (gameStatus === "finished" && scoreData) {
      return (
        <div className="flex items-center gap-2 flex-wrap">
          <span
            className={`font-semibold ${
              scoreData.homeTeamWon
                ? "text-green-600 dark:text-green-400"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {game.homeTeam}
          </span>
          <span className="text-slate-800 dark:text-slate-200">
            {scoreData.homeScore}
          </span>
          <span className="text-slate-500">-</span>
          <span className="text-slate-800 dark:text-slate-200">
            {scoreData.awayScore}
          </span>
          <span
            className={`font-semibold ${
              scoreData.awayTeamWon
                ? "text-green-600 dark:text-green-400"
                : "text-slate-600 dark:text-slate-400"
            }`}
          >
            {game.awayTeam}
          </span>
          <span className="text-xs px-2 py-1 rounded-full font-medium bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200">
            Final
          </span>
        </div>
      );
    }

    return (
      <span className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
        {game.homeTeam} vs {game.awayTeam}
      </span>
    );
  };

  return (
    <div className="mt-6 sm:mt-8">
      {/* Mobile Card View */}
      <div className="block sm:hidden space-y-4">
        {weeksGames.map((game) => {
          const gameStatus = getGameStatus(game);
          return (
            <div
              key={game.id}
              className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            >
              <div
                className={`px-4 py-3 ${
                  gameStatus === "upcoming"
                    ? "bg-slate-50 dark:bg-slate-700"
                    : gameStatus === "live"
                    ? "bg-yellow-50 dark:bg-yellow-900/20"
                    : "bg-green-50 dark:bg-green-900/20"
                }`}
              >
                <div className="flex items-center justify-between">
                  {renderGameTitle(game, gameStatus)}
                  {gameStatus !== "finished" && (
                    <span
                      className={`text-xs px-2 py-1 rounded-full font-medium ${
                        gameStatus === "upcoming"
                          ? "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300"
                          : "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
                      }`}
                    >
                      {gameStatus === "upcoming" ? "Upcoming" : "Live"}
                    </span>
                  )}
                </div>
              </div>
              <div className="p-4">
                <div className="grid grid-cols-2 gap-2">
                  {sortedTeams.map((team) => {
                    const guess = team.guesses.find(
                      (g) => g.gameId === game.id
                    );
                    return (
                      <div
                        key={team.team.id}
                        className="flex items-center justify-between bg-slate-50 dark:bg-slate-700 rounded-lg p-2"
                      >
                        <span className="text-xs font-medium text-slate-600 dark:text-slate-400 truncate max-w-[60px]">
                          {team.team.team}
                        </span>
                        <div className="flex items-center gap-1">
                          {gameStatus === "upcoming" ? (
                            <span className="text-sm">
                              {guess ? "🔒" : "❓"}
                            </span>
                          ) : (
                            <>
                              <span className="text-xs text-slate-700 dark:text-slate-300">
                                {guess ? "" : "No Guess"}
                              </span>
                              {gameStatus === "finished" &&
                                game.result !== null &&
                                guess && (
                                  <span className="text-sm ml-1">
                                    {getResultIcon(
                                      game.result,
                                      guess.prediction
                                    )}
                                  </span>
                                )}
                            </>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop Table View */}
      <div className="hidden sm:block bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎯</span>
            <h2 className="text-xl font-bold text-white">Game Predictions</h2>
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-slate-50 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
                <TableHead className="font-bold text-slate-900 dark:text-slate-100 px-4 py-3">
                  Game
                </TableHead>
                {sortedTeams.map((team) => (
                  <TableHead
                    key={team.team.id}
                    className="font-bold text-slate-900 dark:text-slate-100 text-center px-2 py-3 min-w-[100px]"
                  >
                    <div className="truncate">{team.team.team}</div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {weeksGames.map((game) => {
                const gameStatus = getGameStatus(game);
                return (
                  <TableRow
                    key={game.id}
                    className={`hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors border-b border-slate-100 dark:border-slate-600 ${
                      gameStatus === "live"
                        ? "bg-yellow-50/50 dark:bg-yellow-900/10"
                        : gameStatus === "finished"
                        ? "bg-green-50/50 dark:bg-green-900/10"
                        : ""
                    }`}
                  >
                    <TableCell className="py-3 px-4">
                      <div className="flex items-center gap-2 flex-wrap">
                        {renderGameTitle(game, gameStatus)}
                        {gameStatus !== "finished" && (
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              gameStatus === "upcoming"
                                ? "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300"
                                : "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200"
                            }`}
                          >
                            {gameStatus === "upcoming" ? "Upcoming" : "Live"}
                          </span>
                        )}
                      </div>
                    </TableCell>
                    {sortedTeams.map((team) => {
                      const guess = team.guesses.find(
                        (g) => g.gameId === game.id
                      );
                      return (
                        <TableCell
                          key={team.team.id}
                          className="py-3 px-2 text-center"
                        >
                          <div className="flex items-center justify-center gap-1">
                            {gameStatus === "upcoming" ? (
                              <span className="text-lg">
                                {guess ? "🔒" : "❓"}
                              </span>
                            ) : (
                              <>
                                <span
                                  className={`text-sm font-medium ${
                                    guess
                                      ? "text-slate-700 dark:text-slate-300"
                                      : "text-slate-400 dark:text-slate-500"
                                  }`}
                                >
                                  {guess ? "" : "No Guess"}
                                </span>
                                {gameStatus === "finished" &&
                                  game.result !== null &&
                                  guess && (
                                    <span className="text-lg ml-1">
                                      {getResultIcon(
                                        game.result,
                                        guess.prediction
                                      )}
                                    </span>
                                  )}
                              </>
                            )}
                          </div>
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
