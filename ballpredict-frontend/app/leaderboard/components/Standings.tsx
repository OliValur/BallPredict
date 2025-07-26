"use client";

import { TeamWithGuesses } from "@/types/allTypes";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
  TableHead,
} from "@/components/ui/table";

export default function Standing({ teams }: { teams: TeamWithGuesses[] }) {
  const sortedTeams = [...teams].sort(
    (a, b) => b.team.points.totalPoints - a.team.points.totalPoints
  );
  console.log("Sorted Teams:", sortedTeams);

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Rank</TableHead>
            <TableHead>Team</TableHead>
            <TableHead>Total Points</TableHead>
            <TableHead>Regular Season Points</TableHead>
            <TableHead>Playoff Points</TableHead>
            <TableHead>Season Guess Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedTeams.map((team, index) => (
            <TableRow key={team.team.id}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{team.team.team}</TableCell>
              <TableCell>{team.team.points.totalPoints}</TableCell>
              <TableCell>Redda síðar</TableCell>
              <TableCell>Redda síðar</TableCell>
              <TableCell>Redda síðar</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <h2 className="text-lg font-semibold">Weekly Scores</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Week</TableHead>
            {sortedTeams.map((team) => (
              <TableHead key={team.team.id}>{team.team.team}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }, (_, week) => (
            <TableRow key={week + 1}>
              <TableCell>{week + 1}</TableCell>
              {sortedTeams.map((team) => {
                const weeklyPoints =
                  team.team.points.weeks[`week${week + 1}`] || 0;
                return <TableCell key={team.team.id}>{weeklyPoints}</TableCell>;
              })}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
