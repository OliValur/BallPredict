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
  let borderColor = "border-gray-400";
  if (isGuess) {
    if (isCorrect === true) {
      borderColor = "border-green-500";
    } else if (isCorrect === false) {
      borderColor = "border-red-500";
    } else {
      borderColor = "border-blue-500";
    }
  }

  let bgColor = "bg-gray-700";
  if (isWinner === true) {
    bgColor = "bg-green-600";
  } else if (isWinner === false) {
    bgColor = "bg-red-600";
  }

  return (
    <div
      className={`flex flex-col items-center justify-center p-3 rounded-lg border-2 text-white transition-all ${bgColor} ${borderColor}`}
    >
      <span className="text-md font-bold">{teamName}</span>
      <Image
        src={getTeamLogoPath(teamName)}
        alt={teamName}
        width={40}
        height={40}
        className="my-2"
      />
      <span className="text-sm text-gray-200">
        {teamScore !== null ? `Score: ${teamScore}` : "—"}
      </span>
      {isGuess && (
        <span className="mt-1 text-xs font-medium text-yellow-300">
          {isCorrect === true
            ? "✅ Your Pick (Correct)"
            : isCorrect === false
            ? "❌ Your Pick"
            : "🟦 Your Pick"}
        </span>
      )}
    </div>
  );
}
