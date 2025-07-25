import { getTeamLogoPath } from "@/utils/getTeamLogoPath";
import Image from "next/image";

export default function TeamBox({
  teamName,
  teamScore,
  isWinner,
  isGuess,
  isCorrect,
}: {
  teamName: string;
  teamScore: number | null;
  isWinner: boolean | null;
  isGuess?: boolean;
  isCorrect?: boolean | null;
}) {
  return (
    <div className="flex flex-col items-center p-2 rounded-md ">
      <span className="text-center text-xl font-semibold ">{teamName}</span>
      <Image
        src={getTeamLogoPath(teamName)}
        alt={teamName}
        width={60}
        height={60}
        className="my-2"
      />
      {teamScore !== null && (
        <span className="text-lg font-bold">{teamScore}</span>
      )}
    </div>
  );
}
