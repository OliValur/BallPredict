"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@clerk/clerk-react";
import { getSeasonPredictions, submitSeasonPredictions } from "@/services/api";
import Image from "next/image";
import { getTeamLogoPath } from "../../utils/getTeamLogoPath";

export default function SeasonPredictionsTest() {
  const { getToken } = useAuth();
  const [afcNorth, setAfcNorth] = useState("");

  useEffect(() => {
    const fetch = async () => {
      const token = await getToken({ template: "supabase" });
      const data = await getSeasonPredictions(token);
      if (data?.afcNorth) setAfcNorth(data.afcNorth);
    };
    fetch();
  }, [getToken]);

  const submitGuess = async (guess: string) => {
    const token = await getToken({ template: "supabase" });
    try {
      await submitSeasonPredictions("AfcNorth", guess, token);
      alert("Prediction submitted!");
    } catch (error) {
      console.error("Error submitting:", error);
      alert("Error submitting prediction");
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-2">Test Season Prediction</h1>
      <label className="block mb-1">AFC North</label>

      <button
        onClick={() => submitGuess("Baltimore Ravens")}
        className=" text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <Image
          src={getTeamLogoPath("Baltimore Ravens")}
          alt="Baltimore Ravens"
          width={60}
          height={60}
          className="my-2"
        />
      </button>
      <button
        onClick={() => submitGuess("Cincinnati Bengals")}
        className=" text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <Image
          src={getTeamLogoPath("Cincinnati Bengals")}
          alt="Cincinnati Bengals"
          width={60}
          height={60}
          className="my-2"
        />
      </button>
      <button
        onClick={() => submitGuess("Cleveland Browns")}
        className=" text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <Image
          src={getTeamLogoPath("Cleveland Browns")}
          alt="Cleveland Browns"
          width={60}
          height={60}
          className="my-2"
        />
      </button>
      <button
        onClick={() => submitGuess("Pittsburgh Steelers")}
        className=" text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        <Image
          src={getTeamLogoPath("Pittsburgh Steelers")}
          alt="Pittsburgh Steelers"
          width={60}
          height={60}
          className="my-2"
        />
      </button>
    </div>
  );
}
