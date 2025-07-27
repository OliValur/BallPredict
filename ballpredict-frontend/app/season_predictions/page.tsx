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
    <div>
      <div className="grid md:grid-cols-2 grid-cols-1">
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
          initialGuess={currentGuesses.superBowlWinner}
        />
      </div>
      <div>
        <PlayerGuesses
          currentGuesses={currentGuesses}
          submitGuess={submitGuess}
        />
      </div>
    </div>
  );
}
