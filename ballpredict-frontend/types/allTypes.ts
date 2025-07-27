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

export type SeasonPrediction = {
  id: string;
  userId: string;
  userName: string;
  category: string;
  guess: string;
  createdAt: string;
  updatedAt: string;
};

export type UserSeasonPredictions = {
  userId: string;
  afcNorth: string | null;
  afcSouth: string | null;
  afcEast: string | null;
  afcWest: string | null;
  nfcNorth: string | null;
  nfcSouth: string | null;
  nfcEast: string | null;
  nfcWest: string | null;
  seasonMvp: string | null;
  rookieOfTheYear: string | null;
  rushingChampion: string | null;
  mostReceivingYards: string | null;
  mostPassingYards: string | null;
  afcFirstSeed: string | null;
  nfcFirstSeed: string | null;
  superBowlChamp: string | null;
};

export type LeagueSeasonPredictions = {
  [userId: string]: {
    userName: string;
    predictions: SeasonPrediction[];
  };
};
