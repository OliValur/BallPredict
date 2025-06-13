import { getTeamLogoPath } from "@/utils/getTeamLogoPath";
import Image from "next/image";

export default function TeamBox({
  teamName,
  teamScore,
  isWinner,
}: {
  teamName: string;
  teamScore: number | null;
  isWinner: boolean | null;
}) {
  return (
    <div
      className={` flex flex-row items-center justify-center p-4 border rounded-lg
      `}
    >
      <span className="text-md font-semibold">{teamName}</span>
      <span className="text-sm text-gray-500">
        {teamScore !== null ? `Score: ${teamScore}` : "No score yet"}
      </span>
      <Image
        src={getTeamLogoPath(teamName)}
        alt={teamName}
        width={40}
        height={40}
      />
    </div>
  );
}
