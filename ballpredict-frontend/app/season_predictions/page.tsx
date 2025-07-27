"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getSeasonPredictions, submitSeasonPredictions } from "@/services/api";
import DivisionPrediction from "./DivisionWinner";
import PlayerGuesses from "./PlayerGuesses";

export default function SeasonPredictionsTest() {
  const { getToken } = useAuth();
  const [currentGuesses, setCurrentGuesses] = useState<
    Partial<Record<string, string>>
  >({});
  useEffect(() => {
    const fetch = async () => {
      const token = await getToken({ template: "supabase" });
      const data = await getSeasonPredictions(token);

      if (data) setCurrentGuesses(data);
    };
    fetch();
  }, []);

  const submitGuess = async (category: string, guess: string) => {
    const token = await getToken({ template: "supabase" });
    const prevGuesses = { ...currentGuesses };
    try {
      setCurrentGuesses((prev) => ({
        ...prev,
        [category.charAt(0).toLowerCase() + category.slice(1)]: guess,
      }));
      await submitSeasonPredictions(category, guess, token);
      //set first letter of category to lowercase
    } catch (error) {
      setCurrentGuesses(prevGuesses);
      console.error("Error submitting:", error);
      alert(
        "Error submitting prediction, please let Óli know and try again later"
      );
    }
  };
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-slate-100 mb-2">
            Season Predictions
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Make your predictions for the upcoming NFL season
          </p>
        </div>

        {/* Division Winners Section */}
        <div className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <h2 className="text-xl font-bold text-white">
                  Division Winners
                </h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                <DivisionPrediction
                  divisionName="AFC North"
                  divisionDbName="AfcNorth"
                  teams={[
                    "Baltimore Ravens",
                    "Cincinnati Bengals",
                    "Cleveland Browns",
                    "Pittsburgh Steelers",
                  ]}
                  onSubmit={submitGuess}
                  initialGuess={currentGuesses?.afcNorth}
                />
                <DivisionPrediction
                  divisionName="AFC South"
                  divisionDbName="AfcSouth"
                  teams={[
                    "Houston Texans",
                    "Indianapolis Colts",
                    "Jacksonville Jaguars",
                    "Tennessee Titans",
                  ]}
                  onSubmit={submitGuess}
                  initialGuess={currentGuesses.afcSouth}
                />
                <DivisionPrediction
                  divisionName="AFC East"
                  divisionDbName="AfcEast"
                  teams={[
                    "Buffalo Bills",
                    "Miami Dolphins",
                    "New England Patriots",
                    "New York Jets",
                  ]}
                  onSubmit={submitGuess}
                  initialGuess={currentGuesses.afcEast}
                />
                <DivisionPrediction
                  divisionName="AFC West"
                  divisionDbName="AfcWest"
                  teams={[
                    "Denver Broncos",
                    "Kansas City Chiefs",
                    "Las Vegas Raiders",
                    "Los Angeles Chargers",
                  ]}
                  onSubmit={submitGuess}
                  initialGuess={currentGuesses.afcWest}
                />
                <DivisionPrediction
                  divisionName="NFC North"
                  divisionDbName="NfcNorth"
                  teams={[
                    "Chicago Bears",
                    "Detroit Lions",
                    "Green Bay Packers",
                    "Minnesota Vikings",
                  ]}
                  onSubmit={submitGuess}
                  initialGuess={currentGuesses.nfcNorth}
                />
                <DivisionPrediction
                  divisionName="NFC South"
                  divisionDbName="NfcSouth"
                  teams={[
                    "Atlanta Falcons",
                    "Carolina Panthers",
                    "New Orleans Saints",
                    "Tampa Bay Buccaneers",
                  ]}
                  onSubmit={submitGuess}
                  initialGuess={currentGuesses.nfcSouth}
                />
                <DivisionPrediction
                  divisionName="NFC East"
                  divisionDbName="NfcEast"
                  teams={[
                    "Dallas Cowboys",
                    "New York Giants",
                    "Philadelphia Eagles",
                    "Washington Commanders",
                  ]}
                  onSubmit={submitGuess}
                  initialGuess={currentGuesses.nfcEast}
                />
                <DivisionPrediction
                  divisionName="NFC West"
                  divisionDbName="NfcWest"
                  teams={[
                    "Arizona Cardinals",
                    "Los Angeles Rams",
                    "San Francisco 49ers",
                    "Seattle Seahawks",
                  ]}
                  onSubmit={submitGuess}
                  initialGuess={currentGuesses.nfcWest}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Super Bowl Winner Section */}
        <div className="mb-12">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-500 to-orange-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏈</span>
                <h2 className="text-xl font-bold text-white">
                  Super Bowl Champion
                </h2>
              </div>
            </div>

            <div className="p-6">
              <DivisionPrediction
                divisionName="Super Bowl Winner"
                divisionDbName="SuperBowlChamp"
                teams={[
                  "Baltimore Ravens",
                  "Cincinnati Bengals",
                  "Cleveland Browns",
                  "Pittsburgh Steelers",
                  "Houston Texans",
                  "Indianapolis Colts",
                  "Jacksonville Jaguars",
                  "Tennessee Titans",
                  "Buffalo Bills",
                  "Miami Dolphins",
                  "New England Patriots",
                  "New York Jets",
                  "Denver Broncos",
                  "Kansas City Chiefs",
                  "Las Vegas Raiders",
                  "Los Angeles Chargers",
                  "Chicago Bears",
                  "Detroit Lions",
                  "Green Bay Packers",
                  "Minnesota Vikings",
                  "Atlanta Falcons",
                  "Carolina Panthers",
                  "New Orleans Saints",
                  "Tampa Bay Buccaneers",
                  "Dallas Cowboys",
                  "New York Giants",
                  "Philadelphia Eagles",
                  "Washington Commanders",
                  "Arizona Cardinals",
                  "Los Angeles Rams",
                  "San Francisco 49ers",
                  "Seattle Seahawks",
                ]}
                onSubmit={submitGuess}
                initialGuess={currentGuesses.superBowlChamp}
              />
            </div>
          </div>
        </div>

        {/* Player Predictions Section */}
        <div className="mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="bg-gradient-to-r from-emerald-500 to-teal-600 px-6 py-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl">⭐</span>
                <h2 className="text-xl font-bold text-white">
                  Player Predictions
                </h2>
              </div>
            </div>

            <div className="p-6">
              <PlayerGuesses
                currentGuesses={currentGuesses}
                submitGuess={submitGuess}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
