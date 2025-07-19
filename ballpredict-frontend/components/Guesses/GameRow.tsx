"use client";
import React, { useState } from "react";
import { Game } from "@/types/game";
import TeamBox from "./TeamBox";
import { submitGuess, updateGuess } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";

interface GameRowProps {
  game: Game;
  userId: string;
  token: string;
  initialGuess?: { guess: number } | null;
}
export default function GameRow({
  game,
  userId,
  token,
  initialGuess,
}: GameRowProps) {
  const startDate = new Date(game.startTime);
  const isStarted = startDate < new Date();
  const [currentGuess, setCurrentGuess] = useState(initialGuess);
  const options = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  } as const;

  const createGuessMutation = useMutation({
    mutationFn: async (guess: { gameId: number; guess: number }) => {
      return submitGuess(guess.gameId, guess.guess, token);
    },
    onSuccess: (_, variables) => {
      setCurrentGuess({ guess: variables.guess });
    },
    onError: (error) => console.error("Error submitting guess:", error),
  });

  const updateGuessMutation = useMutation({
    mutationFn: async (guess: { gameId: number; guess: number }) => {
      return updateGuess(guess.gameId, guess.guess, token);
    },
    onSuccess: (_, variables) => {
      setCurrentGuess({ guess: variables.guess });
    },
    onError: (error) => console.error("Error updating guess:", error),
  });

  const handleClick = (guessValue: number) => {
    if (isStarted) return;
    if (!currentGuess) {
      createGuessMutation.mutate({ gameId: game.id, guess: guessValue });
    } else {
      updateGuessMutation.mutate({ gameId: game.id, guess: guessValue });
    }
  };

  const awayIsPicked = currentGuess?.guess === 1;
  const homeIsPicked = currentGuess?.guess === 2;

  const getButtonStyles = (isPicked: boolean) => {
    return [
      "flex flex-col transition-all",
      isPicked ? "bg-green-500" : "bg-gray-500",
      isStarted
        ? "cursor-not-allowed opacity-60"
        : "hover:shadow-md cursor-pointer",
    ].join(" ");
  };

  const getStatusDisplay = () => {
    if (!isStarted) return startDate.toLocaleString("is-IS", options);
    if (!game.isFinished) return "Game started – score pending";
    return "Game finished";
  };

  const getScoreBlock = () => {
    if (!game.isFinished) {
      return (
        <div className="w-full py-2 text-center text-sm text-gray-300 ">
          {getStatusDisplay()}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-4 px-4 py-2  text-sm text-white">
        <div className="min-w-[40px] text-center">{game.awayTeamScore}</div>
        <div className="w-1/3 text-center font-medium">
          {getStatusDisplay()}
        </div>
        <div className="min-w-[40px] text-center">{game.homeTeamScore}</div>
      </div>
    );
  };

  const containerBg = isStarted ? "bg-gray-700" : "bg-gray-900";

  return (
    <div
      className={`mb-4 rounded-lg border border-white ${containerBg} text-white shadow-md`}
    >
      <div className="flex flex-row items-center justify-between p-1  border-white md:bg-amber-50">
        {/* Away Team */}
        <button
          disabled={isStarted}
          onClick={() => handleClick(1)}
          className={getButtonStyles(awayIsPicked)}
        >
          <TeamBox
            teamName={game.awayTeam}
            teamScore={game.awayTeamScore}
            isWinner={game.result === 1}
            isGuess={currentGuess?.guess === 1}
            isCorrect={
              currentGuess?.guess === 1 && game.isFinished
                ? game.result === 1
                : null
            }
          />
        </button>

        {/* Home Team */}
        <button
          disabled={isStarted}
          onClick={() => handleClick(2)}
          className={getButtonStyles(homeIsPicked)}
        >
          <TeamBox
            teamName={game.homeTeam}
            teamScore={game.homeTeamScore}
            isWinner={game.result === 2}
            isGuess={currentGuess?.guess === 2}
            isCorrect={
              currentGuess?.guess === 2 && game.isFinished
                ? game.result === 2
                : null
            }
          />
        </button>
      </div>

      {/* Score or status */}
      {getScoreBlock()}
    </div>
  );
}
