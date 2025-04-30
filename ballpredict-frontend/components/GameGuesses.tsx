"use client";
import React from "react";
import { useState, useEffect } from "react";
import { useGamesAndUserGuesses } from "@/services/api";

export default function GameGuesses() {
  const [gameGuesses, setGameGuesses] = useState([]);
  const { getGamesAndUserGuesses } = useGamesAndUserGuesses();
  useEffect(() => {
    async function fetchGameGuesses() {
      try {
        const data = await getGamesAndUserGuesses(1);
        console.log("Fetched game guesses:", data);
      } catch (error) {
        console.error("Error fetching game guesses:", error);
      }
    }

    fetchGameGuesses();
  }, []);
  return (
    <div>
      <h1>Game Guesses</h1>
      <p>Game guesses page content goes here.</p>
    </div>
  );
}
