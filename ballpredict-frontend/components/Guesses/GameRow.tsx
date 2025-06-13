"use client";
import React from "react";

import { Game } from "@/types/game";
import TeamBox from "./TeamBox";
import { submitGuess, updateGuess } from "@/services/api";
import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function GameRow(game: Game) {
  const isStarted: boolean = new Date(game.startTime) < new Date();
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  const createGuessMutation = useMutation({
    mutationFn: async (guess: { gameId: number; guess: number }) => {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        throw new Error("No token found");
      }
      return submitGuess(guess.gameId, guess.guess, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameGuesses"] });
    },
    onError: (error) => {
      console.error("Error submitting guess:", error);
    },
  });

  const updateGuessMutation = useMutation({
    mutationFn: async (guess: { gameId: number; guess: number }) => {
      const token = await getToken({ template: "supabase" });
      if (!token) {
        throw new Error("No token found");
      }
      return updateGuess(guess.gameId, guess.guess, token);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gameGuesses"] });
    },
    onError: (error) => {
      console.error("Error updating guess:", error);
    },
  });
  const handleClick = async (gameId: number, guess: number) => {
    if (isStarted) {
      console.log("Game is finished, cannot submit guess." + gameId + guess);
      return;
    }
    if (!game.guesses || game.guesses.length === 0) {
      console.log("Calling submitGuess");
      createGuessMutation.mutate({ gameId, guess });
      return;
    }
    console.log("Calling updateGuess");
    updateGuessMutation.mutate({ gameId, guess });
  };
  return (
    <div className="mb-4 bg-red-900 ">
      <div className="flex flex-row items-center justify-between p-4 border-b border-white">
        <div
          className={`flex flex-col bg-blue-700 ${
            game.guesses &&
            game.guesses.length > 0 &&
            game.guesses[0].guess === 1
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          <button
            className={`${
              game.isFinished
                ? "hover:cursor-not-allowed"
                : "hover:cursor-pointer"
            }`}
            onClick={() => handleClick(game.id, 1)}
          >
            <TeamBox
              teamName={game.awayTeam}
              teamScore={game.awayTeamScore}
              isWinner={game.result === 1}
            />
          </button>
        </div>

        <div
          className={`flex flex-col bg-blue-700 ${
            game.guesses &&
            game.guesses.length > 0 &&
            game.guesses[0].guess === 2
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          <button
            className={`${
              game.isFinished
                ? "hover:cursor-not-allowed"
                : "hover:cursor-pointer"
            }`}
            onClick={() => handleClick(game.id, 2)}
          >
            <TeamBox
              teamName={game.homeTeam}
              teamScore={game.homeTeamScore}
              isWinner={game.result === 2}
            />
          </button>
        </div>
      </div>
      <div className="items-center justify-center flex flex-row">
        <div className="bg-amber-500">{game.awayTeamScore}</div>
        <div className="bg-blue-400 justify-center text-center text-white w-1/4">
          {game.startTime.toLocaleString()}
        </div>
        <div>{game.homeTeamScore}</div>
      </div>
    </div>
  );
}
