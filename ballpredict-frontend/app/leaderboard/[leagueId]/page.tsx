import { getLeagueScores, getAllGames } from "@/services/api";
import { auth } from "@clerk/nextjs/server";
import LeaderboardClient from "./LeaderBoardClient";
import { TeamWithGuesses, Game } from "@/types/allTypes";

export default async function LeagueLeaderboard({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  type GameGuessDict = {
    [gameId: string]: {
      [userId: string]: number;
    };
  };

  const { leagueId } = await params;
  const { userId, getToken } = await auth();

  if (!userId) return <div>Sign in to view this page</div>;

  const token = await getToken({ template: "supabase" });
  if (!token) return <div>Unable to authenticate</div>;

  const allTeams = await getLeagueScores(leagueId, token);
  const initialWeek = 1; // default view
  const allGames = await getAllGames(token);

  const gameGuessMap: GameGuessDict = {};
  allGames.forEach((game: Game) => {
    gameGuessMap[game.id] = {};
  });

  allTeams.forEach((team: TeamWithGuesses) => {
    team.guesses.forEach((guess) => {
      if (gameGuessMap[guess.gameId]) {
        gameGuessMap[guess.gameId][team.team.id] = guess.prediction;
      }
    });
  });

  allGames.forEach((game: Game) => {
    const guessesForGame = gameGuessMap[game.id] || {};
    game.guesses = Object.entries(guessesForGame).map(([userId, guess]) => ({
      userId,
      guess,
    }));
  });
  return (
    <LeaderboardClient
      teams={allTeams}
      initialWeek={initialWeek}
      allGames={allGames}
      leagueId={leagueId}
    />
  );
}
