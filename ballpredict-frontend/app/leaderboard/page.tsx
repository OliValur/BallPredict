import { auth } from "@clerk/nextjs/server";
import { getUserLeagues } from "@/services/api";
import Link from "next/link";

export default async function LeaderboardPage() {
  const { userId, getToken } = await auth();

  if (!userId) {
    return <div>Sign in to view this page</div>;
  }

  const token = await getToken({ template: "supabase" });

  if (!token) {
    return <div>Unable to authenticate</div>;
  }

  const leaderboard = await getUserLeagues(token);

  return (
    <main>
      <h1>Leaderboard</h1>
      {leaderboard.map((entry) => (
        <p key={entry.id}>
          <Link href={`/leaderboard/${entry.id}`}>{entry.name}</Link>
        </p>
      ))}
    </main>
  );
}
