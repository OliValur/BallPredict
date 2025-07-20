/*
import { useQuery } from "@tanstack/react-query";
import { getUserLeagues } from "@/services/api";
import { getAuth, clerkClient } from "@clerk/nextjs/server";
import type { NextApiRequest, NextApiResponse } from "next";

export default function LeaderboardPage() {
 
  const { data, isSuccess } = useQuery({
    queryKey: ["userLeagues"],
    queryFn: () => getUserLeagues(),
  });

  if (!isSuccess) {
    return <div>Error loading user leagues</div>;
  }


  return (
    <div>
      <h1>Leaderboard</h1>
      <p>Leaderboard page content goes here.</p>
    </div>
  );
}
*/
// app/leaderboard/[leagueId]/page.tsx
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
