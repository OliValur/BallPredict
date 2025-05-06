"use client";
import { useAuth } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getGamesAndUserGuesses } from "@/services/api";

export default function GameGuesses() {
  const { getToken } = useAuth();

  const query = useQuery({
    queryKey: ["gameGuesses"],
    queryFn: async () => {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        throw new Error("No token found");
      }
      const data = await getGamesAndUserGuesses(1, token);
      console.log("Fetched data:", data);
      return data;
    },
  });

  if (query.isLoading) return <p>Loading...</p>;
  if (query.isError) return <p>Error: {(query.error as Error).message}</p>;

  return (
    <div>
      <h1>Game Guesses</h1>
      {query.data.map((game: any) => (
        <div key={game.id}>
          <p>{game.awayTeam}</p>
          {/* could add guess logic here */}
        </div>
      ))}
    </div>
  );
}
