"use client";
import Image from "next/image";
import { getTeamLogoPath } from "@/utils/getTeamLogoPath";

interface DivisionWinnerProps {
  divisionName: string;
  divisionDbName: string;
  teams: string[];
  onSubmit: (category: string, guess: string) => void;
  initialGuess?: string;
}

export default function DivisionWinner({
  divisionName,
  divisionDbName,
  teams,
  onSubmit,
  initialGuess,
}: DivisionWinnerProps) {
  return (
    <div className="  text-center border-4 mt-2 border-red-400 border-solid">
      <h2 className=" ">{divisionName}</h2>
      <div className="flex flex-row ">
        {teams.map((team) => (
          <button
            key={team}
            onClick={() => onSubmit(divisionDbName, team)}
            className=" rounded hover:bg-blue-700"
          >
            <div
              className={`${
                team === initialGuess ? "bg-green-500" : ""
              } items-center flex flex-col rounded-md`}
            >
              <Image
                src={getTeamLogoPath(team)}
                alt={team}
                width={60}
                height={60}
                className="my-2"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
