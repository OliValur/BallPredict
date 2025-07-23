import { getLeagueScores, getGamesAndUserGuesses } from "@/services/api";
import { auth } from "@clerk/nextjs/server";
import LeaderboardClient from "./LeaderBoardClient";

export default async function LeagueLeaderboard({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const { userId, getToken } = await auth();

  if (!userId) return <div>Sign in to view this page</div>;

  const token = await getToken({ template: "supabase" });
  if (!token) return <div>Unable to authenticate</div>;

  const scores = await getLeagueScores(leagueId, token);
  const initialWeek = 1; // default view
  const gameData = await getGamesAndUserGuesses(initialWeek, token);

  return (
    <LeaderboardClient
      leagueId={leagueId}
      token={token}
      teams={scores}
      initialWeek={initialWeek}
      initialGames={gameData}
    />
  );
}
