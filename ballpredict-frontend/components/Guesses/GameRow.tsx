"use client";
import React, { useState } from "react";
import { Game } from "@/types/allTypes";
import TeamBox from "./TeamBox";
import { submitGuess, updateGuess } from "@/services/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
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
  const queryClient = useQueryClient();
  const createGuessMutation = useMutation({
    mutationFn: async (guess: { gameId: number; guess: number }) => {
      return submitGuess(guess.gameId, guess.guess, token);
    },
    onSuccess: (_, variables) => {
      setCurrentGuess({ guess: variables.guess });
      queryClient.setQueryData(["gameGuesses", game.week], (oldGames) => {
        if (!oldGames) return oldGames;

        return oldGames.map((g) => {
          if (g.id !== variables.gameId) return g;

          const newGuess = { userId, guess: variables.guess };

          return {
            ...g,
            guesses: [
              // remove old guess by same user
              ...g.guesses.filter((guess) => guess.userId !== userId),
              newGuess,
            ],
          };
        });
      });
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

  const getButtonStyles = (
    isPicked: boolean,
    isWinner: boolean,
    isStarted: boolean
  ) => {
    if (isStarted && isWinner) {
      return "flex flex-col flex-1 items-center p-2 rounded-md bg-green-400 shadow-md";
    }
    if (isPicked && !isStarted) {
      return "flex flex-col flex-1 items-center p-2 rounded-md bg-cyan-400 shadow-md";
    }
    if (!isPicked && !isStarted) {
      return "flex flex-col flex-1 items-center p-2 rounded-md bg-gray-600 hover:bg-gray-700 transition-colors";
    }
    // Default styles for unpicked teams

    return [
      "flex flex-col flex-1 items-center p-2 transition-all rounded-md",
      isPicked ? "bg-cyan-400" : "bg-gray-600",
      isStarted
        ? "cursor-not-allowed opacity-60 "
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
        <div className="w-full py-2 text-center text-sm text-gray-300">
          {getStatusDisplay()}
        </div>
      );
    }

    return (
      <div className="flex items-center justify-center gap-4 px-4 py-2 text-white">
        <div className="w-1/3 text-center text-sm font-medium">
          {getStatusDisplay()}
        </div>
      </div>
    );
  };

  const containerBg = isStarted ? "bg-gray-300" : "bg-gray-900";

  return (
    <div className={`mb-4 rounded-md ${containerBg} text-white shadow`}>
      <div className="flex gap-2 p-2">
        {/* Away Team */}
        <button
          disabled={isStarted}
          onClick={() => handleClick(1)}
          className={getButtonStyles(
            awayIsPicked,
            game.result === 1,
            isStarted
          )}
          aria-pressed={awayIsPicked}
          aria-label={`Pick ${game.awayTeam}`}
        >
          <TeamBox teamName={game.awayTeam} teamScore={game.awayTeamScore} />
        </button>
        {/* Home Team */}
        <button
          disabled={isStarted}
          onClick={() => handleClick(2)}
          className={getButtonStyles(
            homeIsPicked,
            game.result === 2,
            isStarted
          )}
          aria-pressed={homeIsPicked}
          aria-label={`Pick ${game.homeTeam}`}
        >
          <TeamBox teamName={game.homeTeam} teamScore={game.homeTeamScore} />
        </button>
      </div>

      {/* Score or status */}
      {getScoreBlock()}
    </div>
  );
}
