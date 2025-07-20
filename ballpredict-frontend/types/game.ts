export type Game = {
  id: number;
  homeTeam: string;
  awayTeam: string;
  startTime: Date;
  homeTeamScore: number | null;
  awayTeamScore: number | null;
  result: number | null;
  isFinished: boolean;
  guesses: {
    userId: string;
    guess: number;
  }[];
  week: number;
};
