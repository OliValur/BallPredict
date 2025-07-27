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
    const baseStyles =
      "flex flex-col flex-1 items-center p-3 rounded-lg transition-all duration-300 relative overflow-hidden min-h-[130px]";

    if (isStarted && isWinner) {
      return `${baseStyles} bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-md ring-2 ring-emerald-300`;
    }
    if (isStarted && isPicked && !isWinner) {
      // User picked this team but it lost
      return `${baseStyles} bg-gradient-to-br from-red-400 to-red-500 text-white shadow-md ring-2 ring-red-300 opacity-80`;
    }
    if (isPicked && !isStarted) {
      return `${baseStyles} bg-gradient-to-br from-blue-400 to-blue-600 text-white shadow-md transform hover:scale-102 ring-2 ring-blue-300`;
    }
    if (!isPicked && !isStarted) {
      return `${baseStyles} bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-md hover:scale-102 cursor-pointer text-slate-900 dark:text-white`;
    }
    if (isStarted && !isPicked) {
      // Game started but user didn't pick this team
      return `${baseStyles} bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 opacity-60`;
    }

    return baseStyles;
  };
  const getStatusDisplay = () => {
    if (!isStarted) return startDate.toLocaleString("en-US", options);
    if (!game.isFinished) return "🟢 Game in progress";
    return "🏁 Final";
  };

  const getScoreBlock = () => {
    if (!game.isFinished) {
      return (
        <div
          className={`${
            isStarted
              ? "bg-gradient-to-r from-orange-100 to-orange-200 dark:from-orange-900/30 dark:to-orange-800/30"
              : "bg-slate-100 dark:bg-slate-700"
          } rounded-b-xl px-3 py-2 text-center`}
        >
          <p
            className={`text-xs font-medium ${
              isStarted
                ? "text-orange-700 dark:text-orange-300"
                : "text-slate-600 dark:text-slate-300"
            }`}
          >
            {getStatusDisplay()}
          </p>
        </div>
      );
    }

    return (
      <div className="bg-gradient-to-r from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-b-xl px-3 py-2">
        <div className="flex items-center justify-center">
          <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            {getStatusDisplay()}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="group relative">
      {/* Gradient border effect */}
      <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur opacity-0 group-hover:opacity-20 transition duration-300"></div>

      <div className="relative bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden">
        {/* Teams Section */}
        <div className="flex gap-2 p-3">
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
            {/* Visual indicators */}
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
              {awayIsPicked && !isStarted && (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              )}
              {awayIsPicked && isStarted && (
                <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
              {isStarted && game.result === 1 && (
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  <span className="text-sm">👑</span>
                </div>
              )}
            </div>
            <TeamBox teamName={game.awayTeam} teamScore={null} />
          </button>

          {/* VS Divider */}
          <div className="flex items-center justify-center px-1">
            <div className="bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-600 dark:to-slate-700 rounded-full w-8 h-8 flex items-center justify-center shadow-sm">
              <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                VS
              </span>
            </div>
          </div>

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
            {/* Visual indicators */}
            <div className="absolute top-2 right-2 flex flex-col items-end gap-1">
              {homeIsPicked && !isStarted && (
                <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
              )}
              {homeIsPicked && isStarted && (
                <div className="bg-blue-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  ✓
                </div>
              )}
              {isStarted && game.result === 2 && (
                <div className="bg-yellow-500 text-white rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                  <span className="text-sm">👑</span>
                </div>
              )}
            </div>
            <TeamBox teamName={game.homeTeam} teamScore={null} />
          </button>
        </div>

        {/* Status/Score Section */}
        {getScoreBlock()}
      </div>
    </div>
  );
}
