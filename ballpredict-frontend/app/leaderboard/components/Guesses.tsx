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
  return (
    <div>
      <Table className="mt-8">
        <TableHeader>
          <TableRow>
            <TableHead>Game</TableHead>
            {sortedTeams.map((team) => (
              <TableHead key={team.team.id}>{team.team.team}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {weeksGames.map((game) => (
            <TableRow key={game.id}>
              <TableCell>
                {game.homeTeam} vs {game.awayTeam}
              </TableCell>
              {sortedTeams.map((team) => {
                const guess = team.guesses.find((g) => g.gameId === game.id);
                // If game hasnt started don't show guesses
                if (game.startTime > new Date().toISOString()) {
                  return (
                    <TableCell key={team.team.id}>
                      <p>{guess ? "🔒" : "❓"}</p>
                    </TableCell>
                  );
                }
                // If game is started but not finished, show guesses
                if (!game.isFinished) {
                  return (
                    <TableCell key={team.team.id}>
                      {guess ? guess.prediction : "No Guess"}
                    </TableCell>
                  );
                }
                // If game is finished, show result
                return (
                  <TableCell key={team.team.id}>
                    {guess ? guess.prediction : "No Guess"}{" "}
                    {game.result !== null && (
                      <span className="text-green-500">
                        {game.result === 1
                          ? "🏆"
                          : game.result === 2
                          ? "🏅"
                          : "Draw"}
                      </span>
                    )}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
