"use client";
import { getUserLeagues, createLeague, joinLeague } from "@/services/api";
import { useAuth } from "@clerk/clerk-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Link from "next/link";
import Form from "next/form";
import { Button } from "@/components/ui/button";

type League = {
  id: string;
  name: string;
  inviteCode?: string;
  memberCount?: number;
};

export default function LeaderboardPage() {
  const { getToken } = useAuth();
  const router = useRouter();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user leagues on component mount
  useEffect(() => {
    const fetchLeagues = async () => {
      try {
        const token = await getToken({ template: "supabase" });
        if (!token) {
          setError("Unable to authenticate");
          return;
        }
        const leaderboard = await getUserLeagues(token);
        setLeagues(leaderboard);
      } catch (err) {
        setError("Failed to load leagues");
        console.error("Error fetching leagues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLeagues();
  }, [getToken]);

  const createLeagueHandler = async (formData: FormData) => {
    const leagueName = formData.get("leagueName") as string;
    const token = await getToken({ template: "supabase" });
    if (!token) {
      setError("No authentication token found");
      return;
    }
    try {
      const response = await createLeague(leagueName, token);
      if (response && response.id) {
        router.push(`/leaderboard/${response.id}`);
      }
    } catch (error) {
      console.error("Error creating league:", error);
      setError("Failed to create league");
    }
  };

  const joinLeagueHandler = async (formData: FormData) => {
    const inviteCode = formData.get("inviteCode") as string;
    if (inviteCode.length !== 8) {
      setError("Invalid invite code length. It should be 8 characters.");
      return;
    }
    const token = await getToken({ template: "supabase" });
    if (!token) {
      setError("No authentication token found");
      return;
    }
    try {
      const response = await joinLeague(inviteCode, token);
      if (response && response.id) {
        // Refresh the leagues list
        const updatedLeagues = await getUserLeagues(token);
        setLeagues(updatedLeagues);
        setError(null);
      }
    } catch (error) {
      console.error("Error joining league:", error);
      setError("Failed to join league. Check the invite code.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="text-lg text-slate-600 dark:text-slate-400">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            My Leagues
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            View your leagues, create new ones, or join existing leagues
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-red-700 dark:text-red-300">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* My Leagues Section */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🏆</span>
                  <h2 className="text-xl font-bold text-white">My Leagues</h2>
                </div>
              </div>

              <div className="p-6">
                {leagues.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {leagues.map((league) => (
                      <Link
                        key={league.id}
                        href={`/leaderboard/${league.id}`}
                        className="group block p-4 bg-slate-50 dark:bg-slate-700 rounded-lg border border-slate-200 dark:border-slate-600 hover:shadow-md hover:scale-105 transition-all duration-200"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-slate-900 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400">
                              {league.name}
                            </h3>
                            {league.inviteCode && (
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                Code: {league.inviteCode}
                              </p>
                            )}
                            {league.memberCount && (
                              <p className="text-sm text-slate-500 dark:text-slate-400">
                                {league.memberCount} members
                              </p>
                            )}
                          </div>
                          <div className="text-blue-500 dark:text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity">
                            →
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-6xl mb-4">🏈</div>
                    <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
                      No Leagues Yet
                    </h3>
                    <p className="text-slate-600 dark:text-slate-400">
                      Create your first league or join an existing one to get
                      started!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Actions Section */}
          <div className="space-y-6">
            {/* Create League */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">➕</span>
                  <h2 className="text-xl font-bold text-white">
                    Create League
                  </h2>
                </div>
              </div>

              <div className="p-6">
                <Form action={createLeagueHandler} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      League Name
                    </label>
                    <input
                      type="text"
                      name="leagueName"
                      placeholder="Enter league name"
                      required
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  >
                    Create League
                  </Button>
                </Form>
              </div>
            </div>

            {/* Join League */}
            <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-red-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🚪</span>
                  <h2 className="text-xl font-bold text-white">Join League</h2>
                </div>
              </div>

              <div className="p-6">
                <Form action={joinLeagueHandler} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                      Invite Code
                    </label>
                    <input
                      type="text"
                      name="inviteCode"
                      placeholder="Enter 8-character code"
                      required
                      maxLength={8}
                      className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-orange-600 hover:bg-orange-700 dark:bg-orange-500 dark:hover:bg-orange-600"
                  >
                    Join League
                  </Button>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
