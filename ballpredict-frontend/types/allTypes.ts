export type Game = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  startTime: string;
  isFinished: boolean;
  result: number | null;
  guesses: {
    userId: string;
    guess: number;
  }[];
  week: number;
};

export type Team = {
  id: string;
  team: string;
  points: {
    weeks: Record<string, number>;
    totalPoints: number;
  };
};

export type TeamWithGuesses = {
  team: Team;
  guesses: {
    gameId: string;
    prediction: number;
  }[];
};
