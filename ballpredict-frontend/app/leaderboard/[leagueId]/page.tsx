import { getLeagueScores } from "@/services/api";
import { auth } from "@clerk/nextjs/server";

type Team = {
  id: string;
  team: string;
  points: {
    weeks: Record<string, number>;
    totalPoints: number;
  };
};

type guesses = {
  guesses: {
    userId: string;
    prediction: number;
  }[];
};

type TeamWithGuesses = Team & guesses;

export default async function LeagueLeaderboard({
  params,
}: {
  params: Promise<{ leagueId: string }>;
}) {
  const { leagueId } = await params;
  const { userId, getToken } = await auth();

  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  const token = await getToken({ template: "supabase" });

  if (!token) {
    return <div>Unable to authenticate</div>;
  }
  console.log("League slug:", leagueId);
  console.log("token:", token);
  const scores: TeamWithGuesses[] = await getLeagueScores(leagueId, token);
  console.log("League scores data:", scores);

  return (
    <div>
      <h2>League: {leagueId}</h2>
      <ul>
        {scores.map((team) => (
          <li key={team.id}>
            {" "}
            {team.team.team} Giskið er:{" "}
            {team.guesses[0]?.prediction
              ? team.guesses[0].prediction
              : "Engin spá"}{" "}
          </li>
        ))}
      </ul>
    </div>
  );
}
